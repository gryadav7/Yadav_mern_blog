import React, { useState } from 'react'
import logo from '@/assets/images/logo-white.png'
import { Button } from './ui/button'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { MdLogin } from "react-icons/md";
import SearchBox from "./SearchBox";
import { RouteIndex, RouteSignIn, RouteProfile, RouteBlogAdd } from '@/helpers/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import usericon from '@/assets/images/user.png'

import { CgProfile } from "react-icons/cg";
import { FaRegPlusSquare } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { showToast } from '@/helpers/showToast';
import { removeUser, } from '@/redux/user/user.slice';
import { getEnv } from '@/helpers/getEnv';
import {IoMdSearch} from 'react-icons/io';
import {AiOutlineMenu} from 'react-icons/ai'
import { useSidebar } from './ui/sidebar';

const Topbar = () => {
   const {toggleSidebar} = useSidebar()
 const [showSearch,setShowSearch] = useState(false)
   const dispath = useDispatch()
   const navigate = useNavigate()

   const user = useSelector((state) => state.user)
   const handleLogout = async () => {
      try {
         const response = await fetch(
            `${getEnv("VITE_API_BASE_URL")}/auth/logout`,
            {
               method: "POST",
               credentials: "include",
            }
         );

         const data = await response.json();

         if (!response.ok) {
            return showToast('error', data.message)
         }
         dispath(removeUser())
         navigate(RouteIndex);
         showToast('success', data.message)
      } catch (error) {
         showToast('error', error.message)
      }
   }

const toggleSearch =()=>{
   setShowSearch(!showSearch)
}


   return (
      <div className='flex justify-between itme-center h-16 fixed w-full z-20 bg-white px-5 border-b'>
         
   <div className='flex justify-center items-center gap-2'>
      <Button onClick={toggleSidebar} className ='md:hidden' type='button'>
      <AiOutlineMenu/>

      </Button>
      <Link to={RouteIndex}>
      <img src={logo} className='md:w-auto w-48' />
      </Link>
   </div>

   <div className='w-[500px]'>
      <div
         className={`absolute md:relative md:block bg-white left-0 w-full 
         md:top-0 top-16 md:p-0 p-5 
         ${showSearch ? "block" : "hidden"}`}
      >
         <SearchBox />
      </div>
   </div>

   <div className='flex items-center gap-5'>
      <Button onClick={toggleSearch} type='button' className='md:hidden block'>
         <IoMdSearch size={25} />
      </Button>

      {!user.isLoggedIn ? (
         <Button asChild className='rounded-full'>
            <Link to={RouteSignIn}>
               <MdLogin />
               Sign In
            </Link>
         </Button>
      ) : (
         <DropdownMenu>
            <DropdownMenuTrigger>
               <Avatar>
                  <AvatarImage src={user?.user?.avatar || usericon} />
                  <AvatarFallback>CN</AvatarFallback>
               </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
               <DropdownMenuLabel>
                  <p>{user?.user?.name}</p>
                  <p className='text-sm'>{user?.user?.email}</p>
               </DropdownMenuLabel>

               <DropdownMenuSeparator />

               <DropdownMenuItem asChild className='cursor-pointer'>
                  <Link to={RouteProfile}>
                     <CgProfile />
                     Profile
                  </Link>
               </DropdownMenuItem>

               <DropdownMenuItem asChild className='cursor-pointer'>
                  <Link to={RouteBlogAdd}>
                     <FaRegPlusSquare />
                     Create Blog
                  </Link>
               </DropdownMenuItem>

               <DropdownMenuSeparator />

               <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
                  <FiLogOut color='red' />
                  Logout
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      )}
   </div>

</div>

   )
}

export default Topbar