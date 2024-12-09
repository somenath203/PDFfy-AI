'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import Dashboardlayout from '@/app/_components/Dashboardlayout';
import PDFViewer from '@/app/_components/PDFViewer';
import { api } from '../../../../../convex/_generated/api';
import TextEditor from '@/app/_components/TextEditor';
import { Button } from '@/components/ui/button';


const Page = () => {


  const { id } = useParams();
  

  const getPDFFileFromDB = useQuery(api.pdfFileStorage.getPDFFileUrlById, {
    pdfFileId: id,
  });


  return (
    <Dashboardlayout>

      <p className='text-center mt-3 mb-8 text-xl lg:text-3xl tracking-wider capitalize font-bold'>{getPDFFileFromDB?.fileName}</p>

      <Link href='/dashboard'>

        <Button variant='outline'>Back to Workspace</Button>

      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 items-center'>

        <div>
          <TextEditor fileId={id} />
        </div>

        <div>
          <PDFViewer pdfFileUrl={getPDFFileFromDB?.urlOfTheUploadedPdfFile} />
        </div>

      </div>

    </Dashboardlayout>
  );
};


export default Page;
