'use client';

import { FaCheckCircle } from 'react-icons/fa';
import { useMutation, useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

import Dashboardlayout from '@/app/_components/Dashboardlayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../../../../convex/_generated/api';


const Page = () => {


  const { user } = useUser();

  if (!user) {

    return null;
    
  }

  
  const upgradeUserAccountToPremiumMutation = useMutation(api.user.updateUserPlanOnPayment);

  const getUserPremiumAccountInfo = useQuery(api.user.getCurrentUserLoggedInInfo, {
    emailId: user?.emailAddresses[0]?.emailAddress,
  });


  const onPaymentSuccessFunc = async (e) => {

    try {

      const amount = 1000000;

      const currency = 'INR';


      const receiptId = process.env.NEXT_PUBLIC_RAZORPAY_RECEIPT_ID;
      
      const resRazorpayOrder = await fetch(`/api/create-razorpay-order`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({
          amount: amount,       
          currency: currency,   
          receipt: receiptId, 
        }),
      });


      const resultFromRazorpayOrder = await resRazorpayOrder.json();


      const optionsForRazorpayPopup = {
        key: "",
        amount: amount, 
        currency: currency,
        name: "PDFfy AI",
        description: "PDFfy AI Premium Account Payment",
        order_id: resultFromRazorpayOrder?.data?.id,
        handler: async (response) => {

          const razorpay_order_id = response?.razorpay_order_id;

          const razorpay_payment_id = response?.razorpay_payment_id;

          const razorpay_signature = response?.razorpay_signature
          

          const resRazorpayTransaction = await fetch(`/api/validate-razorpay-transaction`, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json", 
            },
            body: JSON.stringify({
              razorpay_order_id: razorpay_order_id,
              razorpay_payment_id: razorpay_payment_id,
              razorpay_signature: razorpay_signature
            }),
          });

          const resultFromRazorpayTransaction = await resRazorpayTransaction.json();


          if (resultFromRazorpayTransaction?.success === true) {

            const result = await upgradeUserAccountToPremiumMutation({
              userEmailIDWhoMadeThePayment: user?.emailAddresses[0]?.emailAddress,
              restrictUploadPDF: false,
              updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment: true
            });
        
        
            if (result) {
        
              toast.success('Your account has been successfully upgraded to premium.');
        
            } else {
        
              toast.error('Something went wrong. Please try after sometime.');
        
            }

          }
          
 
        },
        prefill: {
          name: user?.fullName,
          email: user?.emailAddresses[0]?.emailAddress,
        },
        theme: {
          color: '#090DEFFF'
        }
      }


      const instanceOfRazorpay = new Razorpay(optionsForRazorpayPopup);

      instanceOfRazorpay.on("payment.failed", (response) => {
        alert(response.error.code);
      })

      instanceOfRazorpay.open();

      e.preventDefault();


    } catch (error) {
      
      console.log(error);
      
    }

  }


  return (
    <Dashboardlayout>

      <p className="font-medium text-3xl mb-2 text-center tracking-wide">Plans</p>

      <p className="text-center">
        Upgrade your plan to enjoy unlimited PDF uploads!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

        <Card className="shadow-lg border border-gray-200">


          <CardHeader>

            <CardTitle className="text-2xl font-bold text-gray-800 tracking-wide">
              Starter Plan
            </CardTitle>

          </CardHeader>


          <CardContent>

            <ul className="space-y-4 text-gray-600">

              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>Upload up to 5 PDFs</span>
              </li>

              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>Create notes on uploaded PDFs</span>
              </li>

              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>Generate AI-based answers to questions</span>
              </li>

            </ul>

          </CardContent>


          <CardFooter className="flex justify-center">

            {!getUserPremiumAccountInfo?.updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment && <Button variant="outline" className="w-full" disabled>
              Your current plan
            </Button>}

          </CardFooter>


        </Card>


        <Card className="shadow-lg border border-gray-200">


          <CardHeader>

            <CardTitle className="text-2xl font-bold text-gray-800 tracking-wide">
              Pro Plan
            </CardTitle>

          </CardHeader>


          <CardContent>

            <ul className="space-y-4 text-gray-600">

              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>All features from the Starter Plan</span>
              </li>

              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span>Upload unlimited PDFs</span>
              </li>

            </ul>

            <div className="mt-6 text-center">
              <p className="text-3xl font-bold text-gray-800">₹ 10,000</p>
              <p className="text-sm text-gray-500">One-time payment</p>
            </div>

          </CardContent>

          <CardFooter className="flex justify-center">
            
            {getUserPremiumAccountInfo?.updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment ? <Button className="w-full bg-green-800" disabled>
              Your Premium Plan is Active
            </Button> : <Button className="w-full" onClick={onPaymentSuccessFunc}>
              Upgrade your Plan
            </Button>}

          </CardFooter>

        </Card>

      </div>
      
    </Dashboardlayout>
  );
};

export default Page;
