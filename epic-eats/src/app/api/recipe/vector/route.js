import connectDB from "@/db.mjs";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { Recipe } from "../../../../../Model/Recipe.mjs";
import { embedText } from "@/lib/embedding";

export const dynamic = 'force-dynamic';

const VECTOR_INDEX = process.env.MONGODB_VECTOR_INDEX || 'default';


// --- HANDLE VECTOR SEARCH (POST) ---
export async function POST(request) {
  console.log('Received vector search request');
  const session = await getServerSession(options);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  await connectDB();
  const { q, limit: bodyLimit, page: bodyPage } = await request.json();
  if (!q || !String(q).trim()) {
    return new Response(JSON.stringify({ error: 'Query text is required' }), { status: 400 });
  }
  const limit = Math.max(1, Number(bodyLimit || 10));
  const page = Math.max(1, Number(bodyPage || 1));
  const queryVector = await embedText(q);

  if (!Array.isArray(queryVector) || queryVector.length === 0) {
    return new Response(JSON.stringify({ error: 'queryVector is required' }), { status: 400 });
  }

  try {
    const aggregationPipeline = [
      {
        $vectorSearch: {
          index: VECTOR_INDEX,
          path: 'embedding',
          queryVector,
          numCandidates: Math.max(limit * 20, 100),
          limit
        }
      },
      {
        $lookup: {
          from: "users", // The name of your users collection
          localField: "userId",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      {
        // Unwind the authorDetails array to make it a single object
        $unwind: {
          path: "$authorDetails",
          preserveNullAndEmptyArrays: true // Keep recipes even if the author is not found
        }
      },
      // Group to ensure distinct recipes in case earlier stages caused duplicates
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          maxScore: { $max: "$score" }
        }
      },
      // Put document back at the root and keep the best score
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$doc", { score: "$maxScore" }]
          }
        }
      },
      // Sort by score descending for stable ordering
      { $sort: { score: -1 } },
      {
        $project: {
          _id: 1, title: 1, description: 1, image: 1, createdAt: 1, likes: 1, likesCount: 1,
          score: { $meta: 'vectorSearchScore' },
          userId: {
            _id: "$authorDetails._id",
            name: "$authorDetails.username",
            email: "$authorDetails.email",
            image: "$authorDetails.image",
            profilePic: "$authorDetails.profilePic"
          }
        }
      }
    ];
    const items = await Recipe.aggregate(aggregationPipeline);
    console.log(`Vector search found ${items.length} items for query: "${q}"`)
    console.log('Items:', items);
    return new Response(JSON.stringify({ items, total: items.length, page, limit }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (e) {
    console.error('Vector search failed:', e?.message || e);
    return new Response(JSON.stringify({ error: 'Vector search failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
