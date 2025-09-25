import { pipeline } from '@xenova/transformers';


class EmbeddingPipelineSingleton {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2'; // The model you are using
  static instance = null;

  // A static method to get the pipeline instance
  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      console.log('Initializing embedding model for the first time...');

      this.instance = await pipeline(this.task, this.model, { progress_callback });
      console.log('Embedding model loaded successfully.');
    }
    return this.instance;
  }
}



export async function embedText(text) {
  try {
    const normalized = String(text || '').trim();
    if (!normalized) {
      return [];
    }

    const extractor = await EmbeddingPipelineSingleton.getInstance();
    const output = await extractor(normalized, { pooling: 'mean', normalize: true });
    return Array.from(output?.data || []);

  } catch (error) {
    console.error('Error generating embedding:', error);
    return [];
  }
}

export function buildRecipeEmbeddingInput({ title, description, ingredients }) {
  const parts = [title, description, ingredients];
  return parts.filter(Boolean).join('\n');
}




// Next.js server runtime bundles this file for Node, which cannot load Web Worker blobs.
// Disable the WASM proxy worker so the model runs in-process and avoids ERR_WORKER_PATH.
// if (env.backends?.onnx?.wasm) {
//   env.backends.onnx.wasm.proxy = false;
//   env.backends.onnx.wasm.numThreads = 1;
// }


