import connectDB from "@/db.mjs";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { Recipe } from "../../../../Model/Recipe.mjs";
import { embedText } from "../../../lib/embedding";

import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEN_API_KEY });
const systemPrompt = `You are the "Epic Eats Assistant," a friendly and highly-specialized AI chef. Your sole purpose is to provide users with delicious recipes. Your knowledge and conversation are strictly limited to food, ingredients, and cooking techniques.

**Core Directives:**

1.  **Stay in the Kitchen:** You MUST ONLY discuss topics related to food and cooking. If a user asks about anything else (like math, history, or general knowledge), you must politely decline and guide the conversation back to recipes.
    * *Example Refusal:* "As the Epic Eats Assistant, my expertise is all about food! I can't help with that, but I'd be happy to find a great recipe for you."

2.  **Search First, Always:** When a user requests a recipe, your first action is ALWAYS to use the \`vectorSearch\` tool to find existing recipes. Do not create a recipe from your general knowledge unless the search returns no relevant results.
    * When you call the tool, request a \`limit\` of at least 3-5 recipes to get a good variety to analyze.

3.  **Synthesize and Create:** After receiving the search results from the tool, your job is to analyze them and create a single, consolidated, and easy-to-follow recipe for the user. Do not just list the search results. If the search results are poor, you can then generate a new recipe, but mention that you're providing a fresh one.

4.  **Mandatory Recipe Format:** ALL recipe responses you provide to the user MUST follow this exact Markdown format. Do not deviate.

    ---

    ### **[Recipe Title]**

    **Description:** [A brief, enticing one-paragraph description of the dish.]

    **Ingredients:**
    * [Quantity] [Unit] [Ingredient Name]
    * [Quantity] [Unit] [Ingredient Name]
    * ...

    **Instructions:**
    1.  [First step of the instructions.]
    2.  [Second step of the instructions.]
    3.  ...

    ---
`;
const VECTOR_INDEX = process.env.MONGODB_VECTOR_INDEX || 'default';

const vectorSearchFunctionDeclaration = {
  name: 'vectorSearch',
  description: 'Search for related recipes in a vector database using a query.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'The search query to find related recipes.',
      },
      limit: {
        type: Type.INTEGER,
        description: 'The number of top related recipes to return.',
        default: 5,
      },
    },
    required: ['query'],
  },
};

async function vectorSearchFunction(q, bodyLimit = 10) {
  console.log("Querying DB")
  if (!q || !String(q).trim()) {
    return { data: [], error: 'Query parameter "q" is required' };
  }
  const limit = Math.max(1, Number(bodyLimit || 10));
  const queryVector = await embedText(q);

  if (!Array.isArray(queryVector) || queryVector.length === 0) {
    return { data: [], error: 'Failed to generate embedding for the query' };
  }

  try {
    const aggregationPipeline = [
      { $vectorSearch: { index: VECTOR_INDEX, path: 'embedding', queryVector, numCandidates: Math.max(limit * 20, 100), limit } },
      { $group: { _id: "$_id", doc: { $first: "$$ROOT" }, maxScore: { $max: "$score" } } },
      { $replaceRoot: { newRoot: { $mergeObjects: ["$doc", { score: "$maxScore" }] } } },
      { $sort: { score: -1 } },
      { $project: { title: 1, description: 1, instructions: 1, ingredients: 1, score: { $meta: 'vectorSearchScore' } } }
    ];
    const items = await Recipe.aggregate(aggregationPipeline);
    return { data: items, error: null };
  } catch (e) {
    console.error('Vector search failed:', e?.message || e);
    return { data: [], error: 'Vector search operation failed' };
  }
}

export async function POST(request) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  await connectDB();
  const data = await request.json();
  const { history: clientHistory, isFirstTurn } = data || {};
  const history = clientHistory ? clientHistory.map(item => {
    if (item.content) {
      return {
        role: item.role,
        parts: [{ text: item.content }]
      };
    }
    return item;
  }) : [];
  let firstTurn = isFirstTurn;

  let done = false;
  let response;
  while (!done) {
    const requestOptions = {
      model: 'gemini-2.5-flash',
      contents: history,
      config: {
        tools: [{ functionDeclarations: [vectorSearchFunctionDeclaration] }],
      }
    }

    if (firstTurn) {
      requestOptions.systemInstruction = systemPrompt;
      firstTurn = false;
    }
    response = await ai.models.generateContent(requestOptions);

    if (response.functionCalls && response.functionCalls.length > 0) {
      console.log("Function call detected")
      const functionCall = response.functionCalls[0];
      const res = await vectorSearchFunction(functionCall.args.query, functionCall.args.limit);


      history.push({
        role: "model",
        parts: [{ functionCall: { name: functionCall.name, args: functionCall.args } }]
      });

      history.push({
        role: "function",
        parts: [{ functionResponse: { name: functionCall.name, response: res } }]
      });
    } else {

      history.push({ role: "model", parts: [{ text: response.text }] });
      done = true;
    }

  }


  return new Response(JSON.stringify({ message: response.text, history }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}