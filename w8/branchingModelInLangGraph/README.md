working with langgraph basics using gemini flash 2.0 

langgraph has different methods and terminologies like nodes, edges, graphs, prompts etc. 
also supports conditional edges. 
 
 conditionalEdge accept this arguments .addConditionalEdges(from: string, conditionFn: function, mapping: object)

Can track  remember previous messages, in langchain we do with biufferMemory or windowMemeory like methods but in lang graph we have state, state tracks and remember your previous messages, state is an object which have  some properties like content, HumanMessage ,AIMessage, mentioned below

state from calculator node: {
  messages: [
    HumanMessage {
      "id": "d8fadsae4-f0d8-4e05-8ebd-cda0c8197114",
      "content": "2 -0",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "994455d7-d325-439d-8c95-a3c1b6dsa9f1",
      "content": "Result: 2",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [],
      "invalid_tool_calls": []
    },
    HumanMessage {
      "id": "6374f0a6-7c28-486a-ab52-b2fdsffc9b6",
      "content": "2 -0",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  ]
}

as you can see state  object and this also have previous messages in messages array.

what if we see model in console, in our case is gemini, we have different properties like:
lc_serializable: true
apiKey, model, temperature
verbose : false 
if we define verbose:true this will work same as stroing previous messages in messages array through state