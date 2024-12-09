import { NextResponse } from "next/server";
import crypto from 'crypto';


export async function POST(request) {

    try {

        const incomingData = await request.json();

        
        const razorpay_order_id = incomingData?.razorpay_order_id;

        const razorpay_payment_id = incomingData?.razorpay_payment_id;

        const razorpay_signature = incomingData?.razorpay_signature


        const sha = crypto.createHmac('sha256', process.env.NEXT_PUBLIC_RAZORPAY_SECRET_KEY);


        sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);


        const digest = sha.digest('hex');


        if(digest !== razorpay_signature) {
            return NextResponse.json({
                success: false,
                message: 'Invalid Transaction',
            }, { status: 500 });
        };

        return NextResponse.json({
            success: true,
            message: 'transaction is successful',
        }, { status: 200 });
        
        
    } catch (error) {

        console.log(error);
        
        return NextResponse.json({
            success: false,
            message: error.message,
            data: null
        }, { status: 500 });

    }

}