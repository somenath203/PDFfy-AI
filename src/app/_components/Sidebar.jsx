'use client';

import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import { MdOutlineDashboard } from "react-icons/md";
import { IoShieldOutline } from "react-icons/io5";
import Link from "next/link";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Progress } from "@/components/ui/progress";
import UploadPDF from "./UploadPDF";
import { api } from "../../../convex/_generated/api";


const Sidebar = () => {


  const { user } = useUser();


  const [openDrawer, setOpenDrawer] = useState(false);


  const pathname = usePathname();


  const currentUserInfo = useQuery(api.user.getCurrentUserLoggedInInfo, {
    emailId: user?.emailAddresses[0]?.emailAddress
  });

  const allPDFOfCurrentlyLoggedInUser = useQuery(api.pdfFileStorage.getAllPDFFilesUploadedByCurrentlyLoggedInUser, {
    emailOfTheCurrentlyLoggedInUser: user?.emailAddresses[0]?.emailAddress
  });


  return (
    <>
      <GiHamburgerMenu className="text-xl cursor-pointer" onClick={() => setOpenDrawer(true)} />

        <Sheet open={openDrawer} onOpenChange={setOpenDrawer}>

          <SheetContent side='left'>

            <SheetHeader>

              <SheetTitle className='flex items-center gap-1'>

                <FaRegFilePdf className="text-3xl lg:text-4xl" />

                <span className="text-xl lg:text-2xl tracking-wider">PDFfy AI</span>

              </SheetTitle>

            </SheetHeader>

            <div className="mt-10">

              <UploadPDF 
                setOpenDrawer={setOpenDrawer} 
              />

            </div>

            <div className="flex flex-col gap-3 mt-4">

              <Link 
                href='/dashboard'
                className={`flex gap-1 items-center cursor-pointer hover:bg-slate-100 rounded-lg py-5 pl-3 ${pathname === '/dashboard' && 'bg-slate-200'}`}
              > 

                <MdOutlineDashboard className="text-xl lg:text-3xl" />

                <h2 className="text-base lg:text-lg tracking-wide">Workspace</h2>

              </Link>

              <Link 
                href='/payment' 
                className={`flex gap-1 items-center cursor-pointer hover:bg-slate-100 rounded-lg py-5 pl-3 ${pathname === '/payment' && 'bg-slate-200'}`}
              > 

                <IoShieldOutline className="text-xl lg:text-3xl" />

                <h2 className="text-base lg:text-lg tracking-wide">Upgrade</h2>

              </Link>

            </div>


            <div className="absolute bottom-9 lg:bottom-16 w-[80%]">

              {!currentUserInfo?.updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment && <Progress value={(allPDFOfCurrentlyLoggedInUser?.length / 5) * 100} />}

              {!currentUserInfo?.updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment && <p className="mt-2 tracking-wider text-sm lg:text-base">{allPDFOfCurrentlyLoggedInUser?.length} out of 5 PDF uploaded</p>}

              {!currentUserInfo?.updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment ? (

                <p className="mt-1 text-gray-600 tracking-wider text-sm lg:text-base">Upgrade to upload unlimited PDFs</p>

              ) : (

                <p className="mt-1 text-gray-600 tracking-wider text-sm lg:text-base">Your premium account is active! Enjoy unlimited PDF uploads without any restrictions.</p>
              )}

            </div>
            
          </SheetContent>

        </Sheet>
    </>
  );
};


export default Sidebar;
