'use client';

import Link from "next/link";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaRegFilePdf } from "react-icons/fa6";
import { AiOutlineFilePdf } from "react-icons/ai";
import { LuBookOpen } from "react-icons/lu";
import { IoSparklesOutline } from "react-icons/io5";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const Page = () => {


  const { user } = useUser();

  const router = useRouter();


  const handleLogoutUser = () => {

    router.push('/');
    
    toast.success('you have been logged out successfully');


  }


  return (
    <div className="min-h-screen">

      <nav className="sticky top-0 z-50 bg-white shadow-xl">

        <div className="container mx-auto flex items-center justify-between p-4">

          <div className='flex items-center gap-1'>

            <FaRegFilePdf className="text-2xl font-semibold" />

            <span className="text-xl tracking-wider font-bold">PDFfy AI</span>

          </div>

          <div className="space-x-4">

            {user ? <SignOutButton redirectUrl='/'>

                <RiLogoutCircleRLine className='text-2xl cursor-pointer' onClick={handleLogoutUser} />

              </SignOutButton> : <Link href='/sign-in'>

              <Button className="bg-black text-white hover:bg-gray-800">
                Sign In
              </Button>

            </Link>}

          </div>

        </div>

      </nav>


      <header className="container mx-auto px-4 py-16 text-center">

        <h1 className="text-5xl font-bold mb-6 tracking-wide">
          Revolutionize Your PDF Experience
        </h1>

        <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8 tracking-wide">
          Upload, annotate, and unlock insights from your PDFs with AI-powered assistance. 
          Take smarter notes, generate instant answers, and organize your documents effortlessly.
        </p>

        <Link href='/dashboard' className="space-x-4">

          <Button className="bg-black text-white hover:bg-gray-800 text-xl py-8 px-16 tracking-wider font-semibold">
            Get Started
          </Button>

        </Link>

      </header>


      <section className="container mx-auto px-4 py-16">

        <div className="grid md:grid-cols-3 gap-8">

          <Card className="border-black/20 hover:shadow-lg transition-shadow">

            <CardHeader>

              <CardTitle className="flex gap-2 items-center">

                <AiOutlineFilePdf className="text-xl" /> 

                <span className="tracking-wide text-lg">PDF Upload</span>

              </CardTitle>

            </CardHeader>

            <CardContent>
              <p className="tracking-wide">Easily upload and manage your PDF documents in one centralized platform.</p>
            </CardContent>

          </Card>


          <Card className="border-black/20 hover:shadow-lg transition-shadow">

            <CardHeader>

              <CardTitle className="flex gap-2 items-center">

                <LuBookOpen className="text-xl" /> 

                <span className="tracking-wide text-lg">Smart Annotations</span>

              </CardTitle>

            </CardHeader>

            <CardContent>
              <p className="tracking-wide">Take real-time notes directly on your PDFs with seamless synchronization.</p>
            </CardContent>

          </Card>


          <Card className="border-black/20 hover:shadow-lg transition-shadow">

            <CardHeader>

              <CardTitle className="flex gap-2 items-center">
                
                <IoSparklesOutline className="text-xl" /> 

                <span className="tracking-wide text-lg">AI Insights</span>
                
              </CardTitle>

            </CardHeader>

            <CardContent>
              <p className="tracking-wide">Generate instant answers and extract key information using advanced AI technology.</p>
            </CardContent>

          </Card>

        </div>

      </section>


      <section className="bg-black text-white py-16 text-center">

        <h2 className="text-4xl font-bold mb-6 tracking-wide">Start Your PDF Journey Today</h2>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 tracking-wide">
          Transform the way you interact with documents. PDFfy is your all-in-one PDF companion.
        </p>

        <Link href='/dashboard'>

          <Button size="lg" variant="secondary" className="bg-white text-black hover:bg-gray-200">
            Get Started
          </Button>

        </Link>

      </section>

    </div>
  );
};


export default Page;