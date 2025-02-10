"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
    const path = usePathname();
    useEffect(() =>{
        console.log(path);
        
    },[])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
        <Image src={'/logo1.png'} width={120} height = {80} alt ='logo' />
        <ul className=' hidden md:flex gap-10'>
        <li className={`hover:text-blue-800 hover:font-bold transition-all
            cursor-pointer
            ${path=='/dashboard'&&'text-blue-800 font-bold'}
        `}
        >Dashboard</li>
        <li className={`hover:text-blue-800 hover:font-bold transition-all
            cursor-pointer
            ${path=='/dashboard/questions'&&'text-blue-800 font-bold'}
        `}>Question</li>
        <li className={`hover:text-blue-800 hover:font-bold transition-all
            cursor-pointer
            ${path=='/dashboard/upgrade'&&'text-blue-800 font-bold'}
        `}>Upgrade</li>
        <li className={`hover:text-blue-800 hover:font-bold transition-all
            cursor-pointer
            ${path=='/dashboard/how'&&'text-blue-800 font-bold'}
        `}>How it Works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header