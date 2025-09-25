// src/ask/ask.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StateGraph } from '@langchain/langgraph';
import { MongoService } from '../mongo/mongo.service';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AskService implements OnModuleInit {
  private graph: any;
  private model: ChatGoogleGenerativeAI;

  MessagesAnnotation = z.object({
    userId: z.string(),
    messages: z.array(
      z.object({
        role: z.string(),
        content: z.string(),
      }),
    ),
    memory: z.string().optional(),
    route: z.string().optional(),
    mongoQuery: z.any().optional(),
    result: z.any().optional(),
    collection: z.string().optional(),
  });

  constructor(private readonly mongoService: MongoService) {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
      model: 'gemini-2.0-flash',
    });
  }

  async onModuleInit() {
    await this.initializeGraph();
    console.log('✅ AskService initialized with memory system');
  }

  private async initializeGraph() {
    // 1. Relevancy Checker
    const relevancyChecker = async (state: any) => {
      const input = state.messages.at(-1)?.content || '';
      // const isRelevant =
      //   /cricket|run|score|match|odi|test|t20|team|player|wicket|century|average|strike rate/i.test(
      //     input,
      //   );

      const prompt = `
You are an intelligent assistant for a cricket information system.

QUESTION: "${input}"

Determine whether the question is related to the game of cricket or not.

Reply with ONLY "Yes" or "No".
`;

     const response = await this.model.invoke(prompt);
     const geminiResponse = this.extractContent(response);
      const isCricketRelated = geminiResponse
        .trim()
        .toLowerCase()
        .startsWith('yes');

      if (!isCricketRelated) {
        return {
          ...state,
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

      return { ...state, route: 'memoryRetriever' };
    };

    // 2. Memory Retriever
    const memoryRetriever = async (state: any) => {
      const { userId } = state;

      try {
        // Get last 10 conversations
        const conversations = await this.mongoService
          .getCollection('conversations')
          .find({ userId: new ObjectId(userId) })
          .sort({ createdAt: -1 })
          .limit(10)
          .toArray();

        // Get summary if exists
        const summary = await this.mongoService
          .getCollection('summaries')
          .findOne({ userId: new ObjectId(userId) });

        const memoryContext = [
          ...(summary ? [`Summary: ${summary.summary}`] : []),
          ...conversations.map(
            (c) => `Previous: Q: ${c.question} | A: ${c.answer}`,
          ),
        ].join('\n');

        console.log('🧠 Retrieved memory context:', memoryContext);

        return {
          ...state,
          memory: memoryContext || 'No previous conversations',
          route: 'queryGenerator',
        };
      } catch (error) {
        console.error('❌ Error retrieving memory:', error);
        return {
          ...state,
          memory: 'No memory available',
          route: 'queryGenerator',
        };
      }
    };

    // 3. Query Generator (Enhanced with Memory)
    const queryGenerator = async (state: any) => {
      const userQuestion = state.messages.at(-1).content;
      const memoryContext = state.memory || '';

//       const prompt = `
// You are a MongoDB query expert specialized in cricket statistics with memory of past conversations.

// PAST CONTEXT:
// ${memoryContext}

// USER QUESTION: "${userQuestion}"

// You are accessing the "cricket_db" database with collections: "test", "odi", and "t20".

// Important fields (case-sensitive):
// - Team
// - Score
// - Runs
// - Overs
// - RPO
// - Lead
// - Inns
// - Result
// - Opposition
// - Ground
// - Start Date


// Return ONLY a valid JSON object with these fields:
// - "collection": one of "test", "odi", or "t20"
// - "query": MongoDB query
// - "sort": sorting object (optional)
// - "limit": number (optional)
// - "projection": (optional)

// Example output:
// {
//   "collection": "odi",
//   "query": { "Runs": { "$exists": true } },
//   "sort": { "Runs": -1 },
//   "limit": 5,
//   "projection": { "Team": 1, "Runs": 1, "Opposition": 1, "Ground": 1, "_id": 0 }
// }
// `;


const prompt = `
You are a senior-level MongoDB query expert specialized in cricket statistics.

Your task is to convert the user's question into an accurate MongoDB query for the "cricket_db" database.

 DATABASE INFO:
- Collections: "test", "odi", "t20"
- All field names are case-sensitive:
  - "Team" (string)
  - "Score" (string, e.g. "222/8")
  - "Runs" (number)
  - "Overs" (string)
  - "RPO" (string, e.g. "4.12")
  - "Lead" (optional)
  - "Inns" (string)
  - "Result" (string: "won", "lost", "draw")
  - "Opposition" (string)
  - "Ground" (string)
  - "Start Date" (string, e.g. "5-Jan-71")

 QUERY RULES:

1. Use only the above fields. Never create or assume additional fields.
2. For highest/lowest "Runs" or "Score", sort on **"Runs"** field.
3. For filtering based on RPO (e.g., "RPO above 5"), use '$expr' + '$toDouble' because RPO is stored as string.

Example:
{
  "$expr": {
    "$gt": [ { "$toDouble": "$RPO" }, 5 ]
  }
}

4. For date filtering ("after 2019", "before 2010", etc.), use regex on "Start Date" because it's stored as a string.

Examples:
- After 2019:
  { "Start Date": { "$regex": "^(?!.*(197|198|199|200[0-9]|201[0-9]))" } }

- Before 2010:
  { "Start Date": { "$regex": "^(19|200[0-9])" } }

5. For team-based filters:
- "matches by Pakistan" → { "Team": "Pakistan" }
- "against India" → { "Opposition": "India" }

6. For result-based filters:
- "who won", "winning matches" → { "Result": "won" }

7. For numeric filters:
- "scores above 300" → { "Runs": { "$gt": 300 } }

8. For count-based questions:
- Return only the query object. (No need for projection, sort, or limit)

   OUTPUT FORMAT:

Respond with **only** a valid JSON object. No markdown, no explanation, no extra text.

Example:
{
  "collection": "odi",
  "query": { "Runs": { "$exists": true } },
  "sort": { "Runs": -1 },
  "limit": 5,
  "projection": {
    "Team": 1,
    "Runs": 1,
    "Opposition": 1,
    "Ground": 1,
    "Start Date": 1,
    "_id": 0
  }
}

📎 PREVIOUS CONTEXT:
${memoryContext}

  USER QUESTION:
"${userQuestion}"
`;


      try {
        const response = await this.model.invoke([
          { role: 'user', content: prompt },
        ]);

        const responseText = this.extractContent(response);
        console.log('🧠 Gemini Query Generation Output:', responseText);

        const cleanedResponse = this.cleanJsonResponse(responseText);
        const mongoQuery = JSON.parse(cleanedResponse);

        console.log('✅ Parsed Query Data:', mongoQuery);
        return { ...state, mongoQuery };
      } catch (error) {
        console.error('❌ Error generating query:', error);
        return this.createFallbackQuery(state, error);
      }
    };

    // 4. Query Executor
    const queryExecutor = async (state: any) => {
      console.log(
        '📦 Executing query with state:',
        JSON.stringify(state, null, 2),
      );

      if (!state.mongoQuery) {
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content:
                '❌ Could not generate a valid query. Please try rephrasing your question.',
            },
          ],
          route: 'finalResponse',
        };
      }

      const { collection, query, sort, limit, projection } = state.mongoQuery;
      const question =
        state.messages
          .find((m: any) => m.role === 'user')
          ?.content.toLowerCase() || '';

      // Validate and determine collection
      const validCollection = this.determineCollection(question, collection);
      if (!validCollection) {
        return this.handleInvalidCollection(state, collection);
      }

      // Build final query parameters
      const finalQuery = this.buildFinalQuery(question, query);
      const finalSort = this.determineSortOrder(question, sort);
      const finalLimit = limit || 100;

      console.log(`🔍 Executing query:`, {
        collection: validCollection,
        query: finalQuery,
        sort: finalSort,
        limit: finalLimit,
      });

      try {
        const col = this.mongoService.getCollection(validCollection);
        let cursor = col.find(finalQuery);

        if (finalSort) cursor = cursor.sort(finalSort);
        if (finalLimit) cursor = cursor.limit(finalLimit);
        if (projection) cursor = cursor.project(projection);

        const data = await cursor.toArray();
        console.log(
          `✅ Found ${data.length} documents from ${validCollection}`,
        );

        if (data.length > 0) {
          data.slice(0, 3).forEach((doc: any, index: number) => {
            console.log(
              `   ${index + 1}. Team: ${doc.Team}, Runs: ${doc.Runs}`,
            );
          });
        }

        return {
          ...state,
          result: data,
          collection: validCollection,
          route: 'answerFormatter',
        };
      } catch (error) {
        console.error('❌ Database error:', error);
        return this.handleDatabaseError(state, error);
      }
    };

    // 5. Answer Formatter
    const answerFormatter = async (state: any) => {
      const question =
        state.messages.find((m: any) => m.role === 'user')?.content || '';
      const result = state.result || [];
      const collection = state.collection || 'cricket';

      if (!result || result.length === 0) {
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content:
                '❌ No data found for your query. Please try a different question.',
            },
          ],
          route: 'memorySaver',
        };
      }

      try {
        const formattedAnswer = await this.formatAnswer(
          question,
          result,
          collection,
        );

        return {
          ...state,
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content: formattedAnswer,
            },
          ],
          route: 'memorySaver',
        };
      } catch (error) {
        console.error('❌ Error formatting answer:', error);
        return this.handleAnswerFormatError(state, error);
      }
    };

    // 6. Memory Saver
    const memorySaver = async (state: any) => {
      try {
        await this.saveConversation(state);
        return { ...state, route: 'finalResponse' };
      } catch (error) {
        console.error('❌ Error saving memory:', error);
        return { ...state, route: 'finalResponse' }; // Continue even if memory save fails
      }
    };

    // 7. Final Response
    const finalResponse = async (state: any) => {
      console.log('🏁 Final response ready');
      return state;
    };

    // Build the graph
    const graph = new StateGraph(this.MessagesAnnotation)
      .addNode('relevancyChecker', relevancyChecker)
      .addNode('memoryRetriever', memoryRetriever)
      .addNode('queryGenerator', queryGenerator)
      .addNode('queryExecutor', queryExecutor)
      .addNode('answerFormatter', answerFormatter)
      .addNode('memorySaver', memorySaver)
      .addNode('finalResponse', finalResponse)

      // Add edges
      .addEdge('__start__', 'relevancyChecker')
      .addConditionalEdges(
        'relevancyChecker',
        (state: any) => state.route || 'finalResponse',
        {
          memoryRetriever: 'memoryRetriever',
          finalResponse: 'finalResponse',
        },
      )
      .addEdge('memoryRetriever', 'queryGenerator')
      .addEdge('queryGenerator', 'queryExecutor')
      .addEdge('queryExecutor', 'answerFormatter')
      .addEdge('answerFormatter', 'memorySaver')
      .addEdge('memorySaver', 'finalResponse');

    this.graph = graph.compile();
    console.log('✅ LangGraph workflow with memory system initialized');
  }

  // Helper methods
  private extractContent(response: any): string {
    if (typeof response.content === 'string') {
      return response.content;
    }
    if (Array.isArray((response.content as any)?.parts)) {
      return (
        (response.content as any).parts.map((p: any) => p.text).join('\n') || ''
      );
    }
    return JSON.stringify(response.content) || '';
  }

  private cleanJsonResponse(responseText: string): string {
    let cleaned = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^[^{[]*/, '')
      .trim();

    const lastBrace = Math.max(
      cleaned.lastIndexOf('}'),
      cleaned.lastIndexOf(']'),
    );
    if (lastBrace !== -1) {
      cleaned = cleaned.slice(0, lastBrace + 1);
    }

    cleaned = cleaned.replace(/ISODate\("([^"]+)"\)/g, '"$1"');
    cleaned = cleaned.replace(/\/\/.*$/gm, '');

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object found in model output');

    return jsonMatch[0];
  }

  private createFallbackQuery(state: any, error: any): any {
    const question = state.messages.at(-1).content.toLowerCase();
    let collection = 'odi';

    if (question.includes('t20') || question.includes('twenty20')) {
      collection = 't20';
    } else if (question.includes('test')) {
      collection = 'test';
    }

    let sortOrder = { Runs: -1 };
    if (question.includes('lowest score') || question.includes('lowest')) {
      sortOrder = { Runs: 1 };
    }

    const fallbackQuery = {
      collection: collection,
      query: { Runs: { $gt: 0 } },
      sort: sortOrder,
      limit: 100,
      projection: {
        Team: 1,
        Runs: 1,
        Overs: 1,
        Opposition: 1,
        Ground: 1,
        'Start Date': 1,
        _id: 0,
      },
    };

    console.log('🔄 Using fallback query:', fallbackQuery);
    return { ...state, mongoQuery: fallbackQuery };
  }

  private determineCollection(
    question: string,
    suggestedCollection: string,
  ): string | null {
    if (question.includes('odi') || question.includes('one day')) return 'odi';
    if (question.includes('t20') || question.includes('twenty20')) return 't20';
    if (question.includes('test')) return 'test';

    if (
      suggestedCollection &&
      ['test', 'odi', 't20'].includes(suggestedCollection)
    ) {
      return suggestedCollection;
    }

    return 'odi'; // Default
  }

  private handleInvalidCollection(state: any, collection: string): any {
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

  private buildFinalQuery(question: string, suggestedQuery: any): any {
    if (!suggestedQuery || typeof suggestedQuery !== 'object') {
      return { Runs: { $gt: 0 } };
    }
    return suggestedQuery;
  }

  private determineSortOrder(question: string, suggestedSort: any): any {
    if (question.includes('lowest score') || question.includes('lowest')) {
      return { Runs: 1 };
    }
    if (question.includes('highest score') || question.includes('highest')) {
      return { Runs: -1 };
    }
    return suggestedSort || { Runs: -1 };
  }

  private handleDatabaseError(state: any, error: any): any {
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

  // private async formatAnswer(
  //   question: string,
  //   results: any[],
  //   collection: string,
  // ): Promise<string> {
  //   const header = this.getAnswerHeader(question, collection);

  //   // If result is exactly one item and it has <= 2-3 fields: show as simple text
  //   if (results.length === 1) {
  //     const flatFields = Object.keys(results[0] || {}).length;

  //     if (flatFields <= 3) {
  //       return await this.formatSingleResult(question, results[0], collection);
  //     }
  //   }

  //   // For multiple or complex results, return markdown table
  //   return this.formatAsMarkdownTable(results, header);
  // }

  private async formatAnswer(
    question: string,
    results: any[],
    collection: string,
  ): Promise<string> {
    const header = this.getAnswerHeader(question, collection);

    // Har case me table me dikhana hai
    return this.formatAsMarkdownTable(results, header);
  }

  private formatAsMarkdownTable(results: any[], header: string): string {
    if (!results || results.length === 0) return 'No results to show.';

    const displayData = results;

    // Dynamically get all keys from data to build columns
    const allKeys = Array.from(
      new Set(displayData.flatMap((obj) => Object.keys(obj))),
    ).filter((k) => k !== '_id'); // Hide _id

    // Table header
    let markdown = `### ${header}\n\n| ${allKeys.join(' | ')} |\n| ${allKeys.map(() => '---').join(' | ')} |\n`;

    // Table rows
    for (const row of displayData) {
      const rowData = allKeys.map((key) => {
        const value = row[key];
        if (value instanceof Date) return value.toISOString().split('T')[0];
        return value ?? '';
      });
      markdown += `| ${rowData.join(' | ')} |\n`;
    }

    return markdown;
  }

  private getAnswerHeader(question: string, collection: string): string {
    const q = question.toLowerCase();
    if (q.includes('lowest'))
      return `Lowest scores in ${collection.toUpperCase()}:`;
    if (q.includes('highest'))
      return `Highest scores in ${collection.toUpperCase()}:`;
    if (q.includes('won') || q.includes('who won'))
      return `Match results in ${collection.toUpperCase()}:`;
    if (q.includes('how many'))
      return `Count results in ${collection.toUpperCase()}:`;
    return `Cricket data from ${collection.toUpperCase()}:`;
  }

  private async formatSingleResult(
    question: string,
    result: any,
    collection: string,
  ): Promise<string> {
    const prompt = `
Based on this cricket data, provide a concise answer to the question.

Question: "${question}"
Collection: ${collection}
Data: ${JSON.stringify(result)}

Provide a clear, direct answer focusing on the key information.
`;

    const response = await this.model.invoke([
      { role: 'user', content: prompt },
    ]);
    return this.extractContent(response);
  }

  private formatMultipleResults(
    question: string,
    results: any[],
    collection: string,
    header: string,
  ): string {
    let response = `${header}\n\n`;

    results.slice(0, 5).forEach((result, index) => {
      response += `${index + 1}. Team: ${result.Team || 'N/A'}`;
      if (result.Runs) response += `, Runs: ${result.Runs}`;
      if (result.Opposition) response += ` vs ${result.Opposition}`;
      if (result.Ground) response += ` at ${result.Ground}`;
      if (result.Result) response += ` (${result.Result})`;
      response += '\n';
    });

    if (results.length > 5) {
      response += `\n... and ${results.length - 5} more results`;
    }

    return response;
  }

  private handleAnswerFormatError(state: any, error: any): any {
    return {
      ...state,
      messages: [
        ...state.messages,
        {
          role: 'assistant',
          content:
            '✅ Here are the results:\n' +
            JSON.stringify(state.result, null, 2),
        },
      ],
      route: 'memorySaver',
    };
  }

  private async saveConversation(state: any): Promise<void> {
    const { userId, messages } = state;

    const userMessage = messages.find((m: any) => m.role === 'user');
    const assistantMessage = messages.find((m: any) => m.role === 'assistant');

    if (!userMessage || !assistantMessage) {
      console.log('⚠️ No complete conversation to save');
      return;
    }

    const conversationsCollection =
      this.mongoService.getCollection('conversations');

    // Save conversation
    await conversationsCollection.insertOne({
      userId: new ObjectId(userId),
      question: userMessage.content,
      answer: assistantMessage.content,
      createdAt: new Date(),
    });

    console.log('💾 Conversation saved to memory');

    // Check if we need to summarize (every 5 conversations)
    const conversationCount = await conversationsCollection.countDocuments({
      userId: new ObjectId(userId),
    });

    if (conversationCount >= 5) {
      await this.createSummary(userId);
    }
  }

  private async createSummary(userId: string): Promise<void> {
    const conversationsCollection =
      this.mongoService.getCollection('conversations');
    const summariesCollection = this.mongoService.getCollection('summaries');

    const recentConversations = await conversationsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const summaryPrompt = `
Summarize these cricket conversations into 3-5 key bullet points about the user's interests:

${recentConversations.map((c: any) => `Q: ${c.question}\nA: ${c.answer}`).join('\n\n')}

Focus on:
- Types of questions asked (scores, players, matches, etc.)
- Specific teams or players mentioned
- Preferred formats (Test, ODI, T20)
- Key facts discussed

Keep it concise and useful for future context.
`;

    try {
      const summaryResp = await this.model.invoke([
        { role: 'user', content: summaryPrompt },
      ]);
      const summaryText = this.extractContent(summaryResp);

      await summariesCollection.updateOne(
        { userId: new ObjectId(userId) },
        {
          $set: {
            summary: summaryText,
            lastUpdated: new Date(),
            conversationCount: recentConversations.length,
          },
        },
        { upsert: true },
      );

      console.log('📝 Memory summary updated');

      // Clean up old conversations
      await conversationsCollection.deleteMany({
        userId: new ObjectId(userId),
        _id: { $nin: recentConversations.map((c: any) => c._id) },
      });
    } catch (error) {
      console.error('❌ Error creating summary:', error);
    }
  }

  async processQuestion(userId: string, question: string): Promise<string> {
    try {
      if (!this.graph) {
        throw new Error('Graph not initialized');
      }

      console.log(`🤔 Processing question from user ${userId}: "${question}"`);

      const result = await this.graph.invoke({
        userId,
        messages: [{ role: 'user', content: question }],
      });

      const lastAssistantMsg = result.messages.findLast(
        (m: any) => m.role === 'assistant',
      );
      return lastAssistantMsg
        ? lastAssistantMsg.content
        : 'No response generated';
    } catch (error) {
      console.error('❌ Error processing question:', error);
      return '❌ Sorry, an error occurred while processing your question.';
    }
  }

  async getHistory(userId: string) {
    try {
      // Conversations (last 10)
      const conversations = await this.mongoService
        .getCollection('conversations')
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();

      // Summary
      const summary = await this.mongoService
        .getCollection('summaries')
        .findOne({ userId: new ObjectId(userId) });

      return {
        userId,
        summary: summary ? summary.summary : null,
        conversations: conversations.map((c) => ({
          question: c.question,
          answer: c.answer,
          createdAt: c.createdAt,
        })),
      };
    } catch (error) {
      console.error('❌ Error fetching history:', error);
      throw new Error('Failed to fetch conversation history');
    }
  }
}
