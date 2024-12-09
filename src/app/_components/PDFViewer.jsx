import { ImSpinner2 } from "react-icons/im";


const PDFViewer = ({ pdfFileUrl }) => {

  if (!pdfFileUrl) {

    return (

      <div className="min-h-screen flex flex-col items-center gap-4 mt-20">

        <ImSpinner2 className="text-5xl transition-all animate-spin duration-1000" />

        <p className="tracking-wider text-lg">Loading the PDF Preview...</p>

      </div>
    
    )
  
  }
  
  return (
    pdfFileUrl && <div>

      <iframe src={pdfFileUrl} className="h-[70vh] lg:h-[90vh] w-full"></iframe>

    </div>
  )

}

export default PDFViewer;