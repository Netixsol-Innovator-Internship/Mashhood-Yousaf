import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import readline from "readline";
import { Client } from "langsmith";
 
// 1. Initialize Gemini model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.0-flash", // free tier
});
// console.log('model', model)
// Node 1: Gemini chatbot
const callModel = async (state) => {
  const response = await model.invoke(state.messages);

  return { messages: [response] };
};

// Node 2: Calculator
const calculaterNode = async (state) => {
  const input = state.messages[state.messages.length - 1].content;
  // console.log(`input from calculator node: ${input}`);
  const result = calculator(input);
  console.log(`result from calculator node: ${result}`);
  // console.log("state from calculator node:", state);
  return {
    messages: [
      ...state.messages,
      { role: "assistant", content: `Result: ${result}` },
    ],
  };
};     

// 3. Create graph
const graph = new StateGraph(MessagesAnnotation)
  .addNode("chatbot", callModel)
  .addNode("calculator", calculaterNode)
  .addConditionalEdges("__start__", router, {
    chatbot: "chatbot",
    calculator: "calculator",
  });

const app = graph.compile();

// Initialize LangSmith client (make sure LANGCHAIN_API_KEY is in .env)
const client = new Client({
  apiUrl: "https://api.smith.langchain.com",
  apiKey: process.env.LANGCHAIN_API_KEY,
});

// await client.publishGraph(app.getGraph(), {
//   name: "pr-memorable-cloth-37",
//   description: "A LangGraph chatbot with calculator and Gemini",
// });
// Publish the graph to LangSmith (structure only, not traces)
try {
  await client.createProject({
    projectName: "gemini-calc-chatbot",
    description: "A LangGraph chatbot with calculator and Gemini",
    // If you want to include the graph structure, you might need to convert it to a compatible format
    // This typically involves logging runs or using LangSmith's tracing capabilities
  });
  console.log("Project created successfully in LangSmith");
} catch (error) {
  console.error("Error creating LangSmith project:", error.message);
}

// 4. Setup CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function router(state) {
  const input = state.messages[state.messages.length - 1].content;
  const isMath = /^[0-9+\-*/(). ]+$/.test(input); // regex check
  return isMath ? "calculator" : "chatbot";
}

function calculator(input) {
  try {
    return eval(input);
  } catch {
    return "Sorry, I couldn’t calculate that.";
  }
}

console.log("Gemini LangGraph Chatbot started! Type 'exit' to quit.");

async function ask(state = { messages: [] }) {
  // console.log( 'state from ask function ' , state)
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit" || input.trim().length < 1) {
      rl.close();
      return;
    }
    const newState = await app.invoke({
      messages: [...state.messages, { role: "user", content: input }],
    });
    // console.log('newState', newState)
    const lastMessage = newState.messages[newState.messages.length - 1];
    console.log("AI:", lastMessage.content);

    ask(newState);
  });
}


// / Generate graph visualization (FIXED)
try {
  // Alternative approach - save the graph structure as text
  const graphStructure = JSON.stringify(app.getGraph(), null, 2);
  fs.writeFileSync("graph_structure.json", graphStructure);
  console.log("Graph structure saved as graph_structure.json");
} catch (error) {
  console.log(
    "Note: Advanced graph visualization not available in this version"
  );
}

// 

ask();
// fs.writeFileSync("graph.svg", await graph.getGraph().drawMermaidSvg());
// fs.writeFileSync("graph.svg", await graph.getGraph().drawMermaidSvg());
