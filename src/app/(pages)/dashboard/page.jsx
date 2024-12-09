'use client';

import { FaFilePdf } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useEffect } from "react";

import Dashboardlayout from "@/app/_components/Dashboardlayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { api } from "../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



const Page = () => {


  const { user } = useUser();


  const allPDFOfCurrentlyLoggedInUser = useQuery(api.pdfFileStorage.getAllPDFFilesUploadedByCurrentlyLoggedInUser, {
    emailOfTheCurrentlyLoggedInUser: user?.emailAddresses[0]?.emailAddress
  });


  const userRestrictAccountMutation = useMutation(api.user.updateUserPlanOnPayment);


  useEffect(() => {
    
    const restrictUserFromUploadingPDFFunc = async () => {

      try {

        if (allPDFOfCurrentlyLoggedInUser?.length === 5) {

          await userRestrictAccountMutation({
            userEmailIDWhoMadeThePayment: user?.emailAddresses[0]?.emailAddress,
            restrictUploadPDF: true,
            updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment: false
          });
          
        }
        
      } catch (error) {
        
        console.log(error);
        
      }

    }

    allPDFOfCurrentlyLoggedInUser && restrictUserFromUploadingPDFFunc();

  }, [allPDFOfCurrentlyLoggedInUser]);
  

  return (
    <Dashboardlayout>

      <h2 className="text-xl lg:text-2xl font-medium tracking-wide text-center lg:text-left">Your Workspace</h2>

      {!allPDFOfCurrentlyLoggedInUser ? (

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          {[1, 2, 3, 4].map((item) => (

            <Card key={item} className='bg-slate-200 animate-pulse'>

                <CardHeader>

                </CardHeader>

                <CardContent>

                </CardContent>

            </Card>

          ))}

        </div>

      ) : (
        allPDFOfCurrentlyLoggedInUser?.length === 0 ? (
          <Alert className="w-2/5 mt-10 border-l-4 border-orange-600 bg-orange-50 p-4 rounded-lg">

            <AlertTitle className="text-lg font-semibold text-orange-800 tracking-wide">
              No PDFs Found
            </AlertTitle>

            <AlertDescription className="text-sm text-orange-700 tracking-wide">
              It looks like there are no PDF files available in your account at the moment.
            </AlertDescription>

          </Alert>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

            {allPDFOfCurrentlyLoggedInUser?.map((pdfFile) => (

              <Link key={pdfFile?._id} href={`workspace/${pdfFile?.fileId}`}>

                <Card className='flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:scale-105 transition-all duration-500'>

                  <CardHeader>

                    <CardTitle>

                      <FaFilePdf className="text-red-500 text-6xl" />

                    </CardTitle>

                  </CardHeader>

                  <CardContent className='text-center'>

                    <h2 className="font-medium text-lg lg:text-xl capitalize">{pdfFile?.fileName}</h2>

                  </CardContent>

                </Card>

              </Link>

            ))}

          </div>
        )
      )}

    </Dashboardlayout>
  )
}


export default Page;