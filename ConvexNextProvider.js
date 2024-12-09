'use client';


import { ConvexProvider, ConvexReactClient } from 'convex/react';


const ConvexNextProvider = ({ children }) => {


  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);


  return (
    <ConvexProvider client={convex}>
        {children}
    </ConvexProvider>
  )

}


export default ConvexNextProvider;