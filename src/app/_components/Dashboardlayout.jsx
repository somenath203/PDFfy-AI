'use client';

import dynamic from "next/dynamic";


const Dashboardlayout = ({ children }) => {


  const NavbarDynamicComponent = dynamic(() => import('@/app/_components/Header'), { ssr: false });


  return (
    <>
    
      <NavbarDynamicComponent />

      <div className="p-10">

        { children }

      </div>

    </>
  )
}

export default Dashboardlayout;