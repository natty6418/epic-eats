import connectDB from "@/db.mjs";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { Recipe } from "../../../../Model/Recipe.mjs";

import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEN_API_KEY,
});
const systemPrompt = 'You are a friendly and helpful assistant that' +
  'specializes in providing delicious recipes.' +
  ' When a user asks for a recipe, you should first try to find' +
  ' related recipes using your search tool before providing a new' +
  'recipe. Prioritize using the vectorSearch tool. It is recommended' +
  'to request for multiple recipes to get an idea of the best recipe' +
  'to suggest.';
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
        tools: [{ functionDeclaration: vectorSearchFunctionDeclaration }],
      }
    }

    if (firstTurn) {
      requestOptions.systemInstruction = systemPrompt;
      firstTurn = false;
    }
    response = await ai.models.generateContent(requestOptions);

    if (response.functionCalls && response.functionCalls.length > 0) {
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
