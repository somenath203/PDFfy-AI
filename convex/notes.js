import { v } from "convex/values";

import { mutation, query } from "./_generated/server";


export const addNote = mutation({
    args: {
        fileId: v.string(),
        notes: v.any(),
        emailOfTheUserCreatedTheNote: v.string()
    },
    handler: async (ctx, args) => {

        const doesNoteAlreadyExist = await ctx
                                           .db
                                           .query('savedNotes')
                                           .filter((q) => q.eq(q.field('fileId'), args.fileId))
                                           .collect();

        
        if (doesNoteAlreadyExist?.length === 0) {

            await ctx.db.insert('savedNotes', {
                fileId: args.fileId,
                notes: args.notes,
                emailOfTheUserCreatedTheNote: args.emailOfTheUserCreatedTheNote
            });

        } else {

            await ctx.db.patch(doesNoteAlreadyExist[0]?._id, {
                notes: args.notes 
            });

        }
    }
});


export const getNoteForAParticularFileId = query({
    args: {
        fileId: v.string()
    },
    handler: async (ctx, args) => {

        const result = await ctx
                             .db
                             .query('savedNotes')
                             .filter((q) => q.eq(q.field('fileId'), args.fileId))
                             .collect();


        return result[0]?.notes;

    }
});