import { NextResponse } from "next/server";
import Razorpay from 'razorpay';


export async function POST(request) {

    try {

        const incomingData = await request.json();


        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.NEXT_PUBLIC_RAZORPAY_SECRET_KEY
        });


        const orderCreated = await razorpay.orders.create(incomingData);

        if(!orderCreated) {
            return NextResponse.json({
                success: false,
                message: 'failed to generate order ID',
                data: null
            }, { status: 500 });
        }

        
        return NextResponse.json({
            success: true,
            message: 'order ID generated successfully',
            data: orderCreated
        }, { status: 201 });
        
        
    } catch (error) {

        console.log(error);
        
        return NextResponse.json({
            success: false,
            message: error.message,
            data: null
        }, { status: 500 });

    }

}