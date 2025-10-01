// src/ask/ask.service.ts
/* eslint-disable */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StateGraph } from '@langchain/langgraph';
import { MongoService } from '../mongo/mongo.service';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { SymptomMapperService } from '../symptom-mapper/symptom-mapper.service';
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
    symptomAnalysis: z.any().optional(),
    isSymptomQuery: z.boolean().optional(),
  });

  constructor(
    private readonly mongoService: MongoService,
    private readonly symptomMapper: SymptomMapperService,
  ) {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
      model: 'gemini-2.5-flash',
    });
  }

  async onModuleInit() {
    await this.initializeGraph();
    console.log('✅ AskService initialized with memory system');
  }

  // Add this new node to detect symptom queries
  private async symptomDetector(state: any) {
    const input = state.messages.at(-1)?.content || '';

    const prompt = `
Analyze if the following user input describes health symptoms or medical concerns that could be addressed with supplements:

USER INPUT: "${input}"

Examples of symptom descriptions:
- "I feel tired and weak"
- "My joints hurt"
- "I'm losing hair"
- "I have trouble sleeping"
- "My skin is dry"
- "I get sick often"
- "I have low energy"

Examples of non-symptom queries:
- "Show me vitamin C products"
- "What omega-3 supplements do you have?"
- "Products under 500 rupees"
- "Supplements from BrandX"

If the input describes symptoms, health concerns, or how the user is feeling physically/mentally, respond with "symptom".
If it's a direct product request or general question, respond with "product".

Respond with only one word: either "symptom" or "product".
`;

    try {
      const response = await this.model.invoke(prompt);
      const analysis = this.extractContent(response).trim().toLowerCase();
      const isSymptomQuery = analysis === 'symptom';

      return {
        ...state,
        isSymptomQuery,
        route: isSymptomQuery ? 'symptomAnalyzer' : 'relevancyChecker',
      };
    } catch (error) {
      console.error('❌ Error in symptom detector:', error);
      return { ...state, isSymptomQuery: false, route: 'relevancyChecker' };
    }
  }

  // Add this new node to analyze symptoms
  private async symptomAnalyzer(state: any) {
    const input = state.messages.at(-1)?.content || '';

    try {
      const analysis = await this.symptomMapper.analyzeSymptoms(input);

      // Build MongoDB query based on symptom analysis
      const keywordFilters = analysis.keywords.map((keyword) => ({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { ingredients: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
        ],
      }));

      const categoryFilters = analysis.categories.map((category) => ({
        category: { $regex: category, $options: 'i' },
      }));

      const mongoQuery = {
        filter: {
          $or: [
            ...(keywordFilters.length > 0 ? [{ $or: keywordFilters }] : []),
            ...(categoryFilters.length > 0 ? [{ $or: categoryFilters }] : []),
          ],
        },
        limit: analysis.confidence > 0.7 ? 8 : 4, // Show more results for high confidence
      };

      return {
        ...state,
        symptomAnalysis: analysis,
        mongoQuery,
        route: 'queryExecutor',
      };
    } catch (error) {
      console.error('❌ Error in symptom analyzer:', error);
      return {
        ...state,
        route: 'relevancyChecker', // Fall back to regular product search
      };
    }
  }

  // Update the resultHandler to format symptom responses
  private async resultHandler(state: any) {
    if (!state.result || state.result.length === 0) {
      const noProductsMessage = state.isSymptomQuery
        ? "I understand your health concerns. While I couldn't find specific products matching your symptoms, I recommend consulting with a healthcare professional for personalized advice."
        : "I couldn't find any products matching your criteria. Please try different search terms or broader criteria.";

      return {
        ...state,
        messages: [
          ...state.messages,
          { role: 'assistant', content: noProductsMessage },
        ],
        route: 'memorySaver',
      };
    }

    let responseContent = '';

    if (state.isSymptomQuery && state.symptomAnalysis) {
      const { explanation, confidence, categories } = state.symptomAnalysis;

      responseContent = `${explanation}\n\n`;

      if (confidence < 0.6) {
        responseContent +=
          '⚠️ Note: This is a general suggestion. For specific medical advice, please consult a healthcare professional.\n\n';
      }

      responseContent += `Based on your symptoms, I found ${state.result.length} product(s) that might help:\n\n`;
    } else {
      responseContent = `I found ${state.result.length} product(s) matching your criteria:\n\n`;
    }

    const productList = state.result
      .map(
        (product: any, index: number) =>
          `${index + 1}. **${product.name}** (${product.brand}) - ₹${product.price}\n   ${product.description}\n   Dosage: ${product.dosage || 'Not specified'}\n   Ingredients: ${product.ingredients}`,
      )
      .join('\n\n');

    responseContent += productList;

    // Add follow-up question for low confidence symptom matches
    if (state.isSymptomQuery && state.symptomAnalysis?.confidence < 0.5) {
      responseContent += `\n\n💡 Could you provide more details about your symptoms? This helps me give you better recommendations.`;
    }

    return {
      ...state,
      messages: [
        ...state.messages,
        { role: 'assistant', content: responseContent },
      ],
      route: 'memorySaver',
    };
  }

  private async initializeGraph() {
    // 1. Relevancy Checker: Verify if question is about products
    const relevancyChecker = async (state: any) => {
      const input = state.messages.at(-1)?.content || '';

      const prompt = `
You are an intelligent assistant for a healthcare product recommendation system.

QUESTION: "${input}"

Determine whether the user's question is related to the healthcare products listed in the product catalog.
The catalog includes details like product name, category, brand, description, price, ingredients (e.g., Vitamin C), and dosage (e.g., "2 capsules per day", "once daily").

Examples of relevant questions:
- Suggest a product under 1000 rupees
- Which product contains Vitamin C?
- I have weak bones, recommend something
- Any supplement that can be taken twice a day?
- Show me Omega-3 supplements from CleanLiving
- Products between 100 to 1000 rupees
- Anything that can be taken 1 time per day
- Supplements with dosage of 2 times daily

If the question is related to the product catalog (including dosage, price ranges, frequency), answer ONLY with "Yes".
If not related (e.g., personal health issues without asking for a product, general medical advice, unrelated topics), answer ONLY with "No".
`;

      try {
        const response = await this.model.invoke(prompt);
        const geminiResponse = this.extractContent(response);
        const isProductRelated = geminiResponse
          .trim()
          .toLowerCase()
          .startsWith('yes');

        if (!isProductRelated) {
          return {
            ...state,
            messages: [
              ...state.messages,
              {
                role: 'assistant',
                content:
                  '❌ Sorry, I can only answer product-related questions.',
              },
            ],
            route: 'finalResponse',
          };
        }

        return { ...state, route: 'memoryRetriever' };
      } catch (error) {
        console.error('❌ Error in relevancy checker:', error);
        return { ...state, route: 'memoryRetriever' };
      }
    };

    // 2. Memory Retriever: Pull last convos & summary for context
    const memoryRetriever = async (state: any) => {
      const { userId } = state;

      try {
        const conversations = await this.mongoService
          .getCollection('conversations')
          .find({ userId: new ObjectId(userId) })
          .sort({ createdAt: -1 })
          .limit(10)
          .toArray();

        const summary = await this.mongoService
          .getCollection('summaries')
          .findOne({ userId: new ObjectId(userId) });

        const memoryContext = [
          ...(summary ? [`Summary: ${summary.summary}`] : []),
          ...conversations.map(
            (c) => `Previous: Q: ${c.question} | A: ${c.answer}`,
          ),
        ].join('\n');

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

    // 3. Query Generator: Use Gemini to generate MongoDB filter JSON
    const queryGenerator = async (state: any) => {
      const userQuestion = state.messages.at(-1).content;
      const memoryContext = state.memory || '';

      const prompt = `
You are a healthcare assistant and MongoDB query generator for a product recommendation system.

You are a smart and helpful assistant for a health supplement store. Users ask about products by name, brand, ingredients, category, price range, or dosage frequency.

Your job is to understand user queries even if they have spelling mistakes, typos, incomplete or approximate words.

- If a user misspells a brand, product name, ingredient, or category, find the closest matching products.
- If a user asks for products in a price range (e.g., "between 100 and 1000", "100 to 1000 rupees"), filter products accordingly.
- If a user asks about dosage frequency (e.g., "2 times a day", "once daily", "1 time per day"), search in the dosage field.
- Always return relevant products with clear details: name, price, description, brand, and ingredients.
- If no matching product is found, politely say "Sorry, no products match your query."
- Be friendly, clear, and helpful.

Examples of queries you should handle:
- "show me nutraa coreee supplements"
- "I want omega-4 products"
- "products between 100 to 1000 rupees"
- "energy support by nutracore"
- "supplement with glucosamine and msm"
- "any products range from 100 to 1000 rupees"
- "which can take 2 times or 1 times a day"
- "product which can be taken 1 times a day"

The product catalog contains these fields:
- name (string)
- category (string)
- brand (string)
- ingredients (string)
- description (string)
- dosage (string) - e.g., "2 capsules daily", "once per day", "1 tablet twice daily"
- price (number)

Your task:

1. Parse the user's question.
2. Extract meaningful filters for MongoDB:

For keywords: 
- First, identify the meaningful **keywords** from the user's question. 
- If the question includes **phrases** like "immune system", split them into individual keywords like "immune" and "system".
- Then, for each keyword, generate **separate $regex** (case-insensitive) filters on these fields:
  - name
  - ingredients
  - description
  - category
  - brand
  - dosage (for frequency-related queries)
Use "$or" to combine all the keyword regex filters.

For price: recognize price-related conditions and generate appropriate MongoDB numeric filters.
For dosage: recognize frequency patterns like "2 times", "once", "daily", "per day" and search in dosage field.

3. If user asks for specific number of products, limit results accordingly.
4. Return a valid MongoDB filter JSON object, and a separate limit number if applicable.

Examples:

USER: "any products range from 100 to 1000 rupees"
OUTPUT:
{
  "filter": { 
    "price": { "$gte": 100, "$lte": 1000 } 
  },
  "limit": 10
}

USER: "any which can take 2 times or 1 times a day"
OUTPUT:
{
  "filter": {
    "$or": [
      { "dosage": { "$regex": "2 times", "$options": "i" } },
      { "dosage": { "$regex": "twice", "$options": "i" } },
      { "dosage": { "$regex": "1 time", "$options": "i" } },
      { "dosage": { "$regex": "once", "$options": "i" } },
      { "dosage": { "$regex": "daily", "$options": "i" } }
    ]
  },
  "limit": 10
}

USER: "product which can be taken 1 times a day"
OUTPUT:
{
  "filter": {
    "$or": [
      { "dosage": { "$regex": "1 time", "$options": "i" } },
      { "dosage": { "$regex": "once", "$options": "i" } },
      { "dosage": { "$regex": "daily", "$options": "i" } }
    ]
  },
  "limit": 10
}

USER: "Show me Omega-3 supplements under 500 rupees"
OUTPUT:
{
  "filter": {
    "$and": [
      { 
        "$or": [
          { "ingredients": { "$regex": "omega-3", "$options": "i" } },
          { "name": { "$regex": "omega-3", "$options": "i" } },
          { "description": { "$regex": "omega-3", "$options": "i" } }
        ]
      },
      { "price": { "$lte": 500 } }
    ]
  },
  "limit": 10
}

USER: "${userQuestion}"

ONLY return a JSON object with "filter" and optionally "limit". No explanations or markdown.
`;

      try {
        const response = await this.model.invoke([
          { role: 'user', content: prompt },
        ]);
        const responseText = this.extractContent(response);
        console.log('Raw Gemini response:', responseText);

        const cleanedResponse = this.cleanJsonResponse(responseText);
        const mongoQuery = JSON.parse(cleanedResponse);
        console.log('mongoQuery', mongoQuery);

        return { ...state, mongoQuery, route: 'queryExecutor' };
      } catch (error) {
        console.error('❌ Error generating query:', error);
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content:
                "I understand you're looking for healthcare products. Could you please provide more specific details like product type, brand, or ingredients you're interested in?",
            },
          ],
          route: 'finalResponse',
        };
      }
    };

    // 4. Query Executor: Run the Mongo query and return products
    const queryExecutor = async (state: any) => {
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

      try {
        const collection = this.mongoService.getCollection('products');
        console.log('collection', collection);
        const { filter, limit } = state.mongoQuery;

        let cursor = collection.find(filter || {});
        console.log('cursor', cursor);

        if (limit && typeof limit === 'number') {
          cursor = cursor.limit(limit);
        } else {
          cursor = cursor.limit(10); // default limit
        }

        const data = await cursor.toArray();
        console.log('data', data);

        return {
          ...state,
          result: data,
          collection: 'products',
          route: 'memorySaver',
        };
      } catch (error) {
        console.error('❌ Database error:', error);
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              role: 'assistant',
              content: '❌ Database error occurred. Please try again later.',
            },
          ],
          route: 'finalResponse',
        };
      }
    };

    // 5. Memory Saver: Save Q&A into conversations collection
    const memorySaver = async (state: any) => {
      try {
        await this.saveConversation(state);
      } catch (error) {
        console.error('❌ Error saving memory:', error);
      }
      return { ...state, route: 'finalResponse' };
    };

    // 6. Final Response: End of flow, just return state
    const finalResponse = async (state: any) => {
      return state;
    };

    // Build graph with nodes and transitions
    const graph = new StateGraph(this.MessagesAnnotation)
      .addNode('symptomDetector', this.symptomDetector.bind(this))
      .addNode('symptomAnalyzer', this.symptomAnalyzer.bind(this))
      .addNode('relevancyChecker', relevancyChecker)
      .addNode('memoryRetriever', memoryRetriever)
      .addNode('queryGenerator', queryGenerator)
      .addNode('queryExecutor', queryExecutor)
      .addNode('resultHandler', this.resultHandler.bind(this))
      .addNode('memorySaver', memorySaver)
      .addNode('finalResponse', finalResponse)

      // Updated flow
      .addEdge('__start__', 'symptomDetector')
      .addConditionalEdges(
        'symptomDetector',
        (state: any) => state.route || 'relevancyChecker',
        {
          symptomAnalyzer: 'symptomAnalyzer',
          relevancyChecker: 'relevancyChecker',
        },
      )
      .addEdge('symptomAnalyzer', 'queryExecutor')
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
      .addEdge('queryExecutor', 'resultHandler')
      .addEdge('resultHandler', 'memorySaver')
      .addEdge('memorySaver', 'finalResponse');

    this.graph = graph.compile();
    console.log('✅ LangGraph workflow with symptom analysis initialized');
  }

  // Extract content from Gemini response
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

  // Clean JSON response string from Gemini to parse safely
  private cleanJsonResponse(responseText: string): string {
    let cleaned = responseText.trim();

    // Remove code block markers
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7); // Remove ```json
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3); // Remove ```
    }

    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3); // Remove ending ```
    }

    // Remove extra characters after valid JSON
    const lastBrace = Math.max(
      cleaned.lastIndexOf('}'),
      cleaned.lastIndexOf(']'),
    );
    if (lastBrace !== -1) {
      cleaned = cleaned.slice(0, lastBrace + 1);
    }

    // Remove ISODate wrappers if any
    cleaned = cleaned.replace(/ISODate\("([^"]+)"\)/g, '"$1"');

    // Optional: Remove inline comments
    cleaned = cleaned.replace(/\/\/.*$/gm, '');

    try {
      // Validate JSON
      JSON.parse(cleaned);
      return cleaned;
    } catch (err) {
      console.error('❌ Failed to parse JSON:', err);
      throw new Error('Cleaned response is not valid JSON');
    }
  }

  // Save Q&A conversation to MongoDB
  private async saveConversation(state: any): Promise<void> {
    const { userId, messages, mongoQuery, result } = state;

    const userMessage = messages.find((m: any) => m.role === 'user');
    const assistantMessage = messages.find((m: any) => m.role === 'assistant');

    if (!userMessage) return; // nothing to save if no user message

    const conversationsCollection =
      this.mongoService.getCollection('conversations');

    // Store the question and the answer or the raw JSON result (stringified)
    await conversationsCollection.insertOne({
      userId: new ObjectId(userId),
      question: userMessage.content,
      answer: assistantMessage?.content || JSON.stringify(result || {}),
      mongoQuery,
      result,
      createdAt: new Date(),
    });

    console.log('💾 Conversation saved to memory');
  }

  // Main entry point for processing user questions
  async processQuestion(userId: string, question: string): Promise<any> {
    try {
      if (!this.graph) {
        throw new Error('Graph not initialized');
      }

      const result = await this.graph.invoke({
        userId,
        messages: [{ role: 'user', content: question }],
      });

      console.log('Graph result:', JSON.stringify(result, null, 2));

      // Find the assistant's response message
      const assistantMessage = result.messages.find(
        (m: any) => m.role === 'assistant',
      );

      if (assistantMessage) {
        return {
          success: true,
          response: assistantMessage.content,
          products: result.result || [],
        };
      } else {
        // If no assistant message found, create a default response
        return {
          success: true,
          response: 'I found these products matching your criteria:',
          products: result.result || [],
        };
      }
    } catch (error) {
      console.error('❌ Error processing question:', error);
      return {
        success: false,
        error: '❌ Sorry, an error occurred while processing your question.',
        response: 'Please try again with a different question.',
      };
    }
  }

  // Get conversation history & summary for a user
  async getHistory(userId: string) {
    try {
      const conversations = await this.mongoService
        .getCollection('conversations')
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();

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
