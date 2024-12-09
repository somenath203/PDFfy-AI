import { Outfit } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

import "./globals.css";
import ConvexNextProvider from '../../ConvexNextProvider';


const outfit = Outfit({subsets: ['latin']});


export const metadata = {
  title: "PDFfy AI",
  description: "Docify AI: Effortlessly unlock knowledge from your PDFs with AI-powered question answering.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

      <html lang="en" suppressHydrationWarning>

        <body className={outfit.className}>

          <ConvexNextProvider>
            {children}
          </ConvexNextProvider>

          <Toaster 
            richColors 
            position='top-right' 
            duration={6000}
          />

          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          
        </body>

      </html>

    </ClerkProvider>
  );
}
