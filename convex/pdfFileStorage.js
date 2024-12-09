import { v } from "convex/values";

import { mutation, query } from "./_generated/server";


export const generateUploadUrl = mutation(async (ctx) => {

  return await ctx.storage.generateUploadUrl();

});


export const insertFileAndItsInfoIntoDB = mutation({
  args: {
    fileName: v.string(),
    fileId: v.string(),
    storageId: v.string(),
    urlOfTheUploadedPdfFile: v.string(),
    emailOfTheUserWhoUploadedThePdfFile: v.string()
  },
  handler: async (ctx, args) => {

    await ctx.db.insert('pdfFile', {
      fileName: args.fileName,
      fileId: args.fileId,
      storageId: args.storageId,
      urlOfTheUploadedPdfFile: args.urlOfTheUploadedPdfFile,
      emailOfTheUserWhoUploadedThePdfFile: args.emailOfTheUserWhoUploadedThePdfFile
    });

    return 'pdf file and all its details are uploaded successfully'

  }
});


export const getUrlOfTheUploadedPDFFile = mutation({
  args: {
    storageId: v.string()
  },
  handler: async (ctx, args) => {

    const urlOfTheUploadedPDF = ctx.storage.getUrl(args.storageId);

    return urlOfTheUploadedPDF;
    
  }
});


export const getPDFFileUrlById = query({
  args: {
    pdfFileId: v.string()
  },
  handler: async (ctx, args) => {

    const result = await ctx
                         .db
                         .query('pdfFile')
                         .filter((q) => q.eq(q.field('fileId'), args.pdfFileId))
                         .collect();

    return result[0]; 

  }
});


export const getAllPDFFilesUploadedByCurrentlyLoggedInUser = query({
  args: {
    emailOfTheCurrentlyLoggedInUser: v.string()
  },
  handler: async (ctx, args) => {

    const result = await ctx
                         .db
                         .query('pdfFile')
                         .filter((q) => q.eq(q.field('emailOfTheUserWhoUploadedThePdfFile'), args.emailOfTheCurrentlyLoggedInUser))
                         .collect();

    
    return result;

  }
});