import { v } from "convex/values";

import { mutation, query } from "./_generated/server";


export const createUser = mutation({
    args: {
        fullName: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        restrictUploadPDF: v.boolean(),
        updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment: v.boolean()
    },
    handler: async (ctx, args) => {
        

        const user = await ctx
                           .db
                           .query('users') 
                           .filter((q) => q.eq(q.field('email'), args.email))
                           .collect();


        if (user?.length === 0) {

            await ctx.db.insert('users', {
                fullName: args.fullName,
                email: args.email,
                imageUrl: args.imageUrl,
                restrictUploadPDF: args.restrictUploadPDF,
                updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment: args.updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment
            });

            return 'user created successfully';

        }

        return 'user already exists';

    }
});


export const updateUserPlanOnPayment = mutation({
    args: {
        userEmailIDWhoMadeThePayment: v.string(),
        restrictUploadPDF: v.boolean(),
        updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment: v.boolean()
    },
    handler: async (ctx, args) => {

        const result = await ctx
                             .db
                             .query('users')
                             .filter((q) => q.eq(q.field('email'), args.userEmailIDWhoMadeThePayment))
                             .collect();

        
        if (result) {

            await ctx.db.patch(result[0]?._id, {
                restrictUploadPDF: args.restrictUploadPDF,
                updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment: args.updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment
            });

            return true;

        }

        return false;
        
    }
});


export const getCurrentUserLoggedInInfo = query({
    args: {
        emailId: v.string()
    },
    handler: async (ctx, args) => {

        const result = await ctx
                             .db
                             .query('users')
                             .filter((q) => q.eq(q.field('email'), args.emailId))
                             .collect();


        return result[0];

    }
});