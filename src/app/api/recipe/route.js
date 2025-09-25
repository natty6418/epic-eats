import connectDB from "@/db.mjs";
import { Recipe, validateRecipe } from "../../../../Model/Recipe.mjs";
import { User } from "../../../../Model/User.mjs";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { embedText, buildRecipeEmbeddingInput } from "@/lib/embedding";


export async function POST(request) {
  await connectDB();
  const session = await getServerSession(options);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  const userId = session.user.id;
  const data = await request.json();
  const ingredients = Array.isArray(data.ingredients)
    ? data.ingredients.map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        if (typeof item.ingredient === 'string' || typeof item.quantity === 'string') {
          const left = item.ingredient || '';
          const right = item.quantity ? ` – ${item.quantity}` : '';
          return `${left}${right}`.trim();
        }
        const keys = Object.keys(item).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
        if (keys.length) {
          return keys.map(k => item[k]).join('');
        }
      }
      return '';
    }).filter(Boolean)
    : String(data.ingredients || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  const { error } = validateRecipe({ ...data, ingredients });
  if (error) {
    return new Response(JSON.stringify({ error: error.details[0].message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  const recipe = new Recipe({ ...data, ingredients, userId: userId, createdAt: new Date() });
  try {
    const embeddingSource = buildRecipeEmbeddingInput({
      title: recipe.title,
      description: recipe.description,

      ingredients: recipe.ingredients
    });
    recipe.embedding = await embedText(embeddingSource);
  } catch (err) {
    console.error('Failed to generate recipe embedding:', err?.message || err);
    recipe.embedding = [];
  }

  await recipe.save();
  const user = await User.findById(userId);
  user.recipes.push(recipe);
  await user.save();
  return new Response(JSON.stringify(recipe), {
    status: 201,
    headers: {
      'Content-Type': 'application/json'
    }
  });

}
export const dynamic = 'force-dynamic';
export async function GET(request) {
  await connectDB();
  const session = await getServerSession(options);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  const searchParams = request.nextUrl.searchParams;
  const qParam = searchParams.get('q') || '';
  const query = qParam.trim();
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  const page = Math.max(1, Number(pageParam || 0));
  const limit = Math.max(1, Number(limitParam || 0));
  const filter = query ? { title: { $regex: query, $options: 'i' } } : {};

  // Backward-compatible behavior: if no page/limit provided, return full list as before
  if (!pageParam && !limitParam) {
    const recipes = await Recipe.find(filter).populate('userId');
    return new Response(JSON.stringify(recipes), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const skip = (page - 1) * (limit || 20);
  const [items, total] = await Promise.all([
    Recipe.find(filter).populate('userId').skip(skip).limit(limit || 20),
    Recipe.countDocuments(filter)
  ]);
  return new Response(JSON.stringify({ items, total, page: page || 1, limit: limit || 20 }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
