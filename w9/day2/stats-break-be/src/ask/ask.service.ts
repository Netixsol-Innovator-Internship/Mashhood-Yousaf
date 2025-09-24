// src/ask/ask.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StateGraph } from '@langchain/langgraph';
import { MongoService } from '../mongo/mongo.service';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AskService implements OnModuleInit {
  private graph;

  constructor(private readonly mongoService: MongoService) {}

  async onModuleInit() {
    this.initializeGraph();
    console.log('✅ AskService initialized with database connection');
  }

  // Remove the entire waitForDatabaseConnection method

  private model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
    model: 'gemini-2.5-flash',
  });

  MessagesAnnotation = z.object({
    messages: z.array(
      z.object({
        role: z.string(),
        content: z.string(),
      }),
    ),
    route: z.string().optional(),
    mongoQuery: z.any().optional(),
    result: z.any().optional(),
  });

  private initializeGraph() {
    const relevancyChecker = async (state) => {
      const input = state.messages.at(-1)?.content || '';
      const isRelevant =
        /cricket|run|score|match|odi|test|t20|team|player|wicket|century|average|strike rate/i.test(
          input,
        );

      if (!isRelevant) {
        return {
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content: '❌ Sorry, I can only answer cricket-related questions.',
            },
          ],
          route: 'finalResponse',
        };
      }

      return { ...state, route: 'queryGenerator' };
    };

    const queryGenerator = async (state) => {
      const userQuestion = state.messages.at(-1).content;

      const prompt = `
You are a MongoDB query expert for cricket statistics.
Given a user question about cricket, generate a MongoDB query for the cricket_db database.

Available collections: "test", "odi", "t20"

IMPORTANT: The database has these EXACT field names (case-sensitive):
- Team (team name)
- Score (team score/runs, like "214/5")
- Runs (numeric runs)
- Overs 
- RPO (runs per over)
- Lead
- Inns (innings)
- Result
- Opposition
- Ground
- "Start Date"

Handle special question types:
- "highest score" → sort by "Runs": -1
- "lowest score" → sort by "Runs": 1
- "who won" or "Result" → filter by { "Result": "won" }
- "how many tests/ODIs/T20s" → use count of documents
- "matches played by X" → filter { "Team": "X" }
- "scores against Y" → filter by { "Opposition": "Y" }

Return ONLY valid JSON with these fields:
- "collection": one of "test", "odi", or "t20"
- "query": MongoDB query object
- "sort": sorting object (optional)
- "limit": number (optional)
- "projection": fields to return (optional)
- "aggregation": boolean (optional)
- "pipeline": MongoDB aggregation pipeline (if applicable)

User Question: "${userQuestion}"
`;

      try {
        const response = await this.model.invoke([
          { role: 'user', content: prompt },
        ]);

        const responseText =
          typeof response.content === 'string'
            ? response.content
            : Array.isArray((response.content as any)?.parts)
              ? (response.content as any).parts.map((p) => p.text).join('\n') ||
                ''
              : '';

        // Clean the response
        const cleanedResponse = responseText
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .replace(/^[^{]*/, '') // Remove any text before the first {
          .replace(/[^}]*$/, '') // Remove any text after the last }
          .trim();

        console.log('🧠 Cleaned Gemini Output:\n', cleanedResponse);

        const queryData = JSON.parse(cleanedResponse);
        console.log('✅ Parsed Query Data:', queryData);

        return {
          ...state,
          mongoQuery: queryData,
        };
      } catch (error) {
        console.error('❌ Error generating query:', error);
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content: '❌ Error generating query. Please try again.',
            },
          ],
          route: 'finalResponse',
        };
      }
    };

    const queryExecutor = async (state) => {
      console.log(
        '📦 Incoming state at queryExecutor:',
        JSON.stringify(state, null, 2),
      );

      if (!state.mongoQuery) {
        console.error('❌ mongoQuery missing from state!');
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content:
                '❌ Could not generate a valid MongoDB query. Please try rephrasing your question.',
            },
          ],
          route: 'finalResponse',
        };
      }

      const { collection, query, sort, limit, projection } = state.mongoQuery;

      // Validate collection
      if (!collection || !['test', 'odi', 't20'].includes(collection)) {
        console.error('❌ Invalid collection:', collection);
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content: `❌ Invalid collection "${collection}". Available collections: test, odi, t20.`,
            },
          ],
          route: 'finalResponse',
        };
      }

      try {
        const col = this.mongoService.getCollection(collection);
        console.log(`✅ Accessing collection: ${collection}`);

        let data;

        // Check if query is an aggregation pipeline (array) or find query (object)
        if (Array.isArray(query)) {
          // This is an aggregation pipeline
          console.log('🔧 Using aggregation pipeline');
          data = await col.aggregate(query).toArray();
        } else {
          // This is a regular find query
          console.log('🔧 Using find query');
          let cursor = col.find(query || {});
          if (sort) cursor = cursor.sort(sort);
          if (limit) cursor = cursor.limit(limit);
          if (projection) cursor = cursor.project(projection);
          data = await cursor.toArray();
        }

        console.log(
          `✅ Query executed successfully. Found ${data.length} documents`,
        );
        console.log('📊 Actual query results:', JSON.stringify(data, null, 2));

        return { ...state, result: data };
      } catch (error) {
        console.error('❌ Database error:', error);
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content: '❌ Database error occurred. Please try again.',
            },
          ],
          route: 'finalResponse',
        };
      }
    };
    const getAnswerHeader = (question: string) => {
      const q = question.toLowerCase();
      if (q.includes('lowest')) return 'Here are the lowest team scores:';
      if (q.includes('highest')) return 'Here are the highest team scores:';
      if (q.includes('won') || q.includes('who won')) return 'Match result:';
      if (q.includes('how many') && q.includes('test'))
        return 'Total Test matches:';
      if (q.includes('score')) return 'Match score details:';
      return 'Here is the information you requested:';
    };

    const answerFormatter = async (state: any) => {
      console.log('📊 Formatting answer with result:', state.result);

      const question = state.messages?.[0]?.content || '';

      if (!state.result || state.result.length === 0) {
        return {
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content: '❌ No data found for your question.',
            },
          ],
        };
      }

      try {
        const allFields = new Set<string>();
        state.result.forEach((doc: any) => {
          Object.keys(doc).forEach((field) => allFields.add(field));
        });

        const headers = Array.from(allFields).filter(
          (field) => field !== '_id',
        );
        const rows = state.result.map((row: any) =>
          headers.map((h) => String(row[h] || 'N/A')).join(' | '),
        );

        const table = [
          `**${headers.join(' | ')}**`,
          headers.map(() => '---').join(' | '),
          ...rows,
        ].join('\n');

        const header = getAnswerHeader(question);

        return {
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content: `${header}\n\n${table}`,
            },
          ],
        };
      } catch (error) {
        console.error('❌ Error formatting answer:', error);
        return {
          messages: [
            ...state.messages,
            { role: 'assistant', content: '❌ Error formatting results.' },
          ],
        };
      }
    };

   
    const finalResponse = async (state) => {
      console.log('🏁 Final response state:', state);
      return state;
    };

    const graph = new StateGraph(this.MessagesAnnotation)
      .addNode('relevancyChecker', relevancyChecker)
      .addNode('queryGenerator', queryGenerator)
      .addNode('queryExecutor', queryExecutor)
      .addNode('answerFormatter', answerFormatter)
      .addNode('finalResponse', finalResponse)
      .addConditionalEdges('__start__', () => 'relevancyChecker', {
        relevancyChecker: 'relevancyChecker',
      })
      .addConditionalEdges(
        'relevancyChecker',
        (state) => state.route ?? 'finalResponse',
        {
          queryGenerator: 'queryGenerator',
          finalResponse: 'finalResponse',
        },
      )
      .addEdge('queryGenerator', 'queryExecutor')
      .addEdge('queryExecutor', 'answerFormatter')
      .addEdge('answerFormatter', 'finalResponse');

    this.graph = graph.compile();
    console.log('✅ LangGraph workflow initialized');
  }

  async processQuestion(question: string) {
    try {
      if (!this.graph) {
        throw new Error('Graph not initialized');
      }

      console.log(`🤔 Processing question: "${question}"`);
      const result = await this.graph.invoke({
        messages: [{ role: 'user', content: question }],
      });

      const lastMessage = result.messages.at(-1);
      return lastMessage ? lastMessage.content : 'No response generated';
    } catch (error) {
      console.error('❌ Error processing question:', error);
      return '❌ Sorry, an error occurred while processing your question.';
    }
  }
}
