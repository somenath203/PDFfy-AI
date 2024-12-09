import { ConvexVectorStore } from '@langchain/community/vectorstores/convex';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from 'convex/values';

import { action } from './_generated/server.js';


export const ingest = action({

  args: {
    textDocument: v.any(),
    textDocumentId: v.string()
  },

  handler: async (ctx, args) => {
    await ConvexVectorStore.fromTexts(
      
      args.textDocument, 

      { fileId: args.textDocumentId }, 

      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_GEMINI_API_KEY,
        model: "text-embedding-004", 
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),

      { ctx }

    );

    return 'embedding process completed';
    
  },
});


export const vectorSearchForTextInConvexDB = action({
  args: {
    text: v.string(),
    pdfFileId: v.string()
  },
  handler: async (ctx, args) => {

    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_GEMINI_API_KEY,
        model: "text-embedding-004", 
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),

      { ctx }

    )


    const result = (await vectorStore.similaritySearch(args.text, 1)).filter((q) => q.metadata.fileId === args.pdfFileId);

    return JSON.stringify(result);

  }
});