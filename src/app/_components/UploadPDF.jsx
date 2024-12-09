'use client';

import { useAction, useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { ImSpinner7 } from "react-icons/im";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { PDFDocument } from 'pdf-lib';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { api } from '../../../convex/_generated/api';



const getNumberOfPages = async (file) => {

  const arrayBuffer = await file.arrayBuffer(); 

  const pdfDoc = await PDFDocument.load(arrayBuffer); 

  return pdfDoc.getPageCount(); 

};


const UploadPDF = ({ setOpenDrawer }) => {


  const { user } = useUser();


  const router = useRouter();


  const emailIdOfTheCurrentlyLoggedInUser = user?.emailAddresses[0]?.emailAddress;


  const [ openFileUploadAlertDialog, setOpenFileUploadAlertDialog ] = useState(false);

  const [ nameOfFileInput, setNameOfFileInput ] = useState('');

  const [ actualFileInput, setActualFileInput ] = useState(null);

  const [ pdfFileUploadErrorMsg, setPdfFileUploadErrorMsg ] = useState('');

  const [ loading, setLoading ] = useState(false);


  const currentUserInfo = useQuery(api.user.getCurrentUserLoggedInInfo, {
    emailId: emailIdOfTheCurrentlyLoggedInUser
  });
    
  const generateUploadURL = useMutation(api.pdfFileStorage.generateUploadUrl);

  const uploadFileAndItsDetailsToDBMutation = useMutation(api.pdfFileStorage.insertFileAndItsInfoIntoDB);

  const getUrlOfTheUploadedPDFFile = useMutation(api.pdfFileStorage.getUrlOfTheUploadedPDFFile);

  const embedDocument = useAction(api.myActions.ingest);


  const onSubmitForm = async (e) => {

    e.preventDefault();

    try {
      
      setLoading(true);


      const maxFileSizeInBytes = 5 * 1024 * 1024; 

      if (actualFileInput && actualFileInput.size > maxFileSizeInBytes) {

        setPdfFileUploadErrorMsg('File size cannot be greater than 5 mb.');

      } else if (await getNumberOfPages(actualFileInput) > 1) {

        setPdfFileUploadErrorMsg('For optimal performance and memory efficiency, uploading PDF files with more than 1 page is not supported.');

      } else {

        setPdfFileUploadErrorMsg('');

        const urlWherePdfIsToBeUploaded = await generateUploadURL();

        const result = await fetch(urlWherePdfIsToBeUploaded, {
          method: 'POST',
          headers: {
            'Content-Type': actualFileInput.type
          },
          body: actualFileInput
        });


        const { storageId } = await result.json();

        const fileId = uuidv4();


        const uploadedPDFUrl = await getUrlOfTheUploadedPDFFile({
          storageId: storageId
        });


        await uploadFileAndItsDetailsToDBMutation({
          fileName: nameOfFileInput,
          fileId: fileId,
          storageId: storageId,
          urlOfTheUploadedPdfFile: uploadedPDFUrl,
          emailOfTheUserWhoUploadedThePdfFile: emailIdOfTheCurrentlyLoggedInUser
        });


        const extractedTextFromPDF = await fetch(`/api/pdf-loader?pdfUrl=${uploadedPDFUrl}`);

        const extractedTextFromPDFResultFromJSON = await extractedTextFromPDF.json();


        embedDocument({
          textDocument: extractedTextFromPDFResultFromJSON.result,
          textDocumentId: fileId 
        });

        toast.success('pdf uploaded successfully and the pdf content embeddings are created successfully');


        router.push(`workspace/${fileId}`);


        setOpenFileUploadAlertDialog(false);

        setOpenDrawer(false);

      }
      

    } catch (error) {

      console.log(error);

      toast.error( error.message || 'something went wrong, please try again after sometime');
      
    } finally {

      setLoading(false);
    
    }
   
  }


  return (
    <>

      {currentUserInfo?.restrictUploadPDF ? (
        
        <div>

          <Button 
            className="flex items-center justify-center gap-1 py-6 w-full" 
            disabled
          >
            <span className="text-3xl">+</span>
            <span className="text-sm tracking-wide">Upload PDF</span>
          </Button>


          <Alert className="p-4 mt-4 border border-red-400">

            <AlertTitle className="text-red-800 font-semibold tracking-wide">Upload Limit Reached</AlertTitle>

            <AlertDescription className="text-red-700 tracking-wide">
              Your account has reached its upload limit. Upgrade to premium for more PDF upload capacity.
            </AlertDescription>

          </Alert>

        </div>

      ) : (
        <Button 
          className="flex items-center justify-center gap-1 py-6 w-full" 
          onClick={() => setOpenFileUploadAlertDialog(true)}
        >
          <span className="text-3xl">+</span>
          <span className="text-sm tracking-wide">Upload PDF</span>
        </Button>
      )}


      <AlertDialog open={openFileUploadAlertDialog} onOpenChange={setOpenFileUploadAlertDialog}>

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>Upload your PDF file</AlertDialogTitle>
            
            <AlertDialogDescription asChild>


              <form className='flex flex-col my-2 gap-3' onSubmit={onSubmitForm}>


                <div className='flex flex-col gap-2'>

                  <Label>File Name</Label>

                  <Input 
                    type='text' 
                    placeholder='enter the name of your file' 
                    onChange={(e) => setNameOfFileInput(e.target.value)}
                    required
                  />

                </div>


                <div className='flex flex-col gap-2'>

                  <Label>Select the file to upload</Label>

                  <Input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => setActualFileInput(e.target.files[0])} 
                    required
                  />

                  { pdfFileUploadErrorMsg !== '' && <Alert variant="destructive">

                      <AlertTitle>Error</AlertTitle>

                      <AlertDescription>
                        { pdfFileUploadErrorMsg }
                      </AlertDescription>

                    </Alert>}

                </div>


                <AlertDialogFooter>
                    
                  <Button 
                    type='button'
                    variant='ghost' 
                    disabled={loading}
                    onClick={() => setOpenFileUploadAlertDialog(false)}
                  >Cancel</Button>

                  <Button type='submit' disabled={loading}>
                    { loading ? <ImSpinner7 className='transition-all animate-spin duration-1000' /> : <span>Submit</span> }
                  </Button>

                </AlertDialogFooter>


              </form>

            </AlertDialogDescription>
            
          </AlertDialogHeader>

        </AlertDialogContent>

      </AlertDialog>
    </>
  );
};


export default UploadPDF;
