import { NextResponse } from "next/server";
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';


export async function GET(req) {


    const searchParams = req.nextUrl.searchParams;

    const urlOfTheUploadedPDFFromTheSearchParams = searchParams.get('pdfUrl');

    
    const res = await fetch(urlOfTheUploadedPDFFromTheSearchParams);

    const data = await res.blob();

    const loader = new WebPDFLoader(data);

    const docsFromPDF = await loader.load();

    
    let wholePdfTextContentInOneString = '';

    docsFromPDF.forEach((docFromPDF) => (

        wholePdfTextContentInOneString = wholePdfTextContentInOneString + docFromPDF.pageContent

    ));


    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    const wholePdfTextContentInOneStringChunks = await splitter.createDocuments([wholePdfTextContentInOneString]);

    
    let allChunksInsideAList = [];

    wholePdfTextContentInOneStringChunks.forEach((chunk) => {

        allChunksInsideAList.push(chunk.pageContent);

    });


    return NextResponse.json({
        result: allChunksInsideAList
    });

}