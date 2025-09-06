"use client";
import Link from 'next/link';
import { useState } from 'react';

import { FiMenu } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';

import Login from '../app/(auth)/Login';
import Signup from '../app/(auth)/SignUp';
import { useAuth } from '@/src/hooks/useAuth';

type NavItem = {
    label: string;
    link: string,
    children?: NavItem[];
}

const navItems: NavItem[] = [
    {
        label: "Home",
        link: "/",
    },
    {
        label: "Features",
        link: "#",
        children: [
            {
                label: "Consulting",
                link: "/features/consulting"
            },
            {
                label: "Development",
                link: "/features/development"
            },
            {
                label: "Design",
                link: "/features/design"
            }
        ]
    },
    {
        label: "About",
        link: "/about",
    }
];

export default function Navbar() {
    const [animationParent] = useAutoAnimate();
    const [isSideMenuOpen, setSideMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSingUp, setshowSingUp] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    
    const { authUser, logout } = useAuth();

    function toggleSideMenu() {
        setSideMenuOpen(!isSideMenuOpen);
    }

    function closeSideMenu() {
        setSideMenuOpen(false);
    }

    function handleLogout() {
        logout();
        setShowProfileDropdown(false);
    }

    return(
        <nav>
            <div className="mx-auto flex w-full max-w-7xl justify-between px-3 py-7 text-sm border-b">
                <h1 className="py-1 md:py-0 text-4xl font-extrabold tracking-wide bg-gradient-to-r bg-clip-text text-black drop-shadow-md">
                    Easyhire<span className="text-shadow-black">Desk</span>
                </h1>
                
                <section ref={animationParent} className="flex items-center">
                    {isSideMenuOpen && <MobileSideMenu closeSideMenu={closeSideMenu} />}
                    <div className="hidden md:flex items-center gap-4 transition-all">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.link ?? "#"}
                                className="relative group px-2 py-3 transition-all"
                            >
                                <p className="flex cursor-pointer items-center gap-2 text-neutral-400 group-hover:text-black ">
                                    <span>{item.label}</span>
                                    {item.children && (
                                        <IoIosArrowDown
                                           className="rotate-180 transition-all group-hover:rotate-0" 
                                        />
                                    )}
                                </p>

                                {item.children && (
                                    <div className="absolute right-0 top-10 hidden w-auto flex-col gap-2 rounded-lg bg-white py-3 shadow-md transition-all group-hover:flex">
                                        {item.children.map((child, idx) => (
                                            <Link
                                                key={idx}
                                                href={child.link ?? "#"}
                                                className="flex cursor-pointer items-center py-1 pl-6 pr-8 text-neutral-400 hover:text-black"
                                            >
                                                <span className="whitespace-nowrap pl-3">
                                                    {child.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="hidden md:flex items-center gap-8">
                    {!authUser ? (
                        <>
                            <button onClick={() => setShowLogin(true)} className="h-fit text-neutral-400 transition-all hover:text-black/90">
                                Login
                            </button>
                            <button onClick={() => setshowSingUp(true)} className="h-fit text-neutral-400 transition-all hover:border-black hover:text-black/90 rounded-xl border-2 border-neutral-400 px-4 py-2">
                                SignUp
                            </button>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                            >
                                {authUser.profilePic ? (
                                    <img 
                                        src={authUser.profilePic} 
                                        alt="Profile" 
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="w-5 h-5 text-gray-600" />
                                )}
                            </button>

                            {showProfileDropdown && (
                                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-medium text-gray-900">{authUser.email}</p>
                                        <p className="text-xs text-gray-500 capitalize">{authUser.role}</p>
                                    </div>
                                    
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowProfileDropdown(false)}
                                    >
                                        Profile
                                    </Link>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <FiMenu
                   onClick={toggleSideMenu}
                   className="cursor-pointer text-4xl md:hidden" 
                />
            </div>

            <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
            <Signup isOpen={showSingUp} onClose={() => setshowSingUp(false)} />
        </nav>
    )
}

function SingleNavItem( item: NavItem ) {
    const [animationParent] = useAutoAnimate();
    const [isItemOpen, setItem] = useState(false);

    function toggleItem() {
        return setItem(!isItemOpen);
    }

    return(
        <Link
           ref={animationParent}
           onClick={item.children ? toggleItem : undefined}
           href={item.link ?? "#"}
           className="relative px-2 py-3 transition-all"
        >
            <p className="flex cursor-pointer items-center gap-2 text-neutral-400 group-hover:text-black">
                <span>{item.label}</span>
                {item.children && (
                    <IoIosArrowDown
                       className={`text-xs transition-all ${isItemOpen ? "rotate-0" : "rotate-180"}`} 
                    />
                )}
            </p>

            {isItemOpen && item.children && (
                <div className="w-auto flex flex-col gap-1 rounded-lg bg-white py-3 transition-all">
                    {item.children.map((child, idx) => (
                        <Link
                            key={idx}
                            href={child.link ?? "#"}
                            className="flex cursor-pointer items-center py-1 pl-6 pr-8 text-neutral-400 hover:text-black"
                        >
                            <span className="whitespace-nowrap pl-3">
                                {child.label}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </Link>
    )
}

function MobileSideMenu({ closeSideMenu }: { closeSideMenu: () => void}) {
    const [showLogin, setShowLogin] = useState(false);
    const [showSingUp, setshowSingUp] = useState(false);
    const { authUser, logout } = useAuth();

    function handleLogout() {
        logout();
        closeSideMenu();
    }
    
    return(
        <div className="flex fixed left-0 top-0 h-full min-h-screen w-full justify-end bg-black/60 md:hidden">
            <div className="h-full w-[65%] bg-white px-4 py-4">
                <section className="flex justify-end">
                    <AiOutlineClose
                        onClick={closeSideMenu}
                        className="cursor-pointer text-3xl" 
                    />
                </section>

                <div className="flex flex-col text-base gap-2 transition-all">
                    {navItems.map((item, index) => {
                        return(
                            <SingleNavItem
                                key={index}
                                label={item.label}
                                link={item.link}
                            >
                                {item.children}
                            </SingleNavItem>
                        )
                    })}
                </div>

                <section className="flex flex-col gap-8 mt-4 items-center gap-3">
                    {!authUser ? (
                        <>
                            <button onClick={() => setShowLogin(true)} className="h-fit text-neutral-400 transition-all hover:text-black/90">
                                Login
                            </button>
                            <button onClick={() => setshowSingUp(true)} className="h-fit text-neutral-400 transition-all hover:border-black hover:text-black/90 rounded-xl border-2 border-neutral-400 px-4 py-2">
                                SignUp
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 w-full">
                            <div className="text-center border-b pb-3">
                                <p className="font-medium text-gray-900">{authUser.email}</p>
                                <p className="text-sm text-gray-500 capitalize">{authUser.role}</p>
                            </div>
                            
                            <Link
                                href="/profile"
                                className="text-center py-2 text-neutral-400 hover:text-black/90"
                                onClick={closeSideMenu}
                            >
                                Profile
                            </Link>
                            
                            <button
                                onClick={handleLogout}
                                className="text-center py-2 text-neutral-400 hover:text-black/90"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </section>
            </div>

            <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
            <Signup isOpen={showSingUp} onClose={() => setshowSingUp(false)} />
        </div>
    )
}