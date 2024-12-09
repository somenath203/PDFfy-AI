'use client';

import { UserButton } from "@clerk/nextjs";
import { FaRegFilePdf } from "react-icons/fa6";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";

import Sidebar from "./Sidebar";
import { api } from "../../../convex/_generated/api";


const Header = () => {

  
  const { user } = useUser();

  const userMutation = useMutation(api.user.createUser);


  const handleUserInDB = async () => {

    try {

      await userMutation({
        fullName: user?.fullName,
        email: user?.emailAddresses[0]?.emailAddress,
        imageUrl: user?.imageUrl,
        restrictUploadPDF: false,
        updateProgressBarAndNoOfPDFsTextUponSuccessfullPayment: false
      });

      
    } catch (error) {
      
      console.log(error);
      
    }

  };


  useEffect(() => {

    user && handleUserInDB();

  }, [user]);


  return (
    <nav className="w-full flex items-center justify-between px-10 py-5 shadow-xl">

      <div className="flex items-center gap-4">
        
        <Sidebar />

        <div className='flex items-center gap-1'>

          <FaRegFilePdf className="text-2xl font-semibold" />

          <span className="text-xl tracking-wider font-bold">PDFfy AI</span>

        </div>

      </div>

      <UserButton />

    </nav>
  )
}

export default Header;