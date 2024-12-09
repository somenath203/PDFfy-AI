import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';


export default defineSchema({

  users: defineTable({
    fullName: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    restrictUploadPDF: v.boolean(),
    updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment: v.boolean()
  }),

  pdfFile: defineTable({
    fileName: v.string(),
    fileId: v.string(),
    storageId: v.string(),
    urlOfTheUploadedPdfFile: v.string(),
    emailOfTheUserWhoUploadedThePdfFile: v.string()
  }),

  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768, 
  }),

  savedNotes: defineTable({
    fileId: v.string(),
    notes: v.any(),
    emailOfTheUserCreatedTheNote: v.string()
  })
  
});
