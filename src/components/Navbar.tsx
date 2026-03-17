"use client";
import Link from 'next/link';
import { useState } from 'react';

import { FiMenu } from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';

import Login from '../app/auth/login/page';
import Signup from '../app/auth/signup/page';
import { useAuth } from '@/src/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

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
        label: "Services",
        link: "#",
        children: [
            {
                label: "Hire Manager",
                link: "/services/hire-manager"
            },
            {
                label: "Candidates",
                link: "/services/candidates"
            },
        ]
    },
    {
        label: "Features",
        link: "#",
        children: [
            {
                label: "AI Assistance",
                link: "/features/ai-assistance"
            },
            {
                label: "Scheduled Interviews",
                link: "/features/meeting"
            }
        ]
    },
    {
        label: "About",
        link: "/about",
    },
    {
        label: "Contact",
        link: "/contact"
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
    }

    return(
        <nav>
            <div className="mx-auto flex w-full max-w-full items-center justify-between px-4 py-1 text-sm sm:px-6 lg:px-8">
                <Link href="/" className="group inline-flex items-center rounded-xl px-2 py-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#1d1b18] sm:text-4xl">
                        Easyhire<span className="text-gray-400">Desk</span>
                    </h1>
                </Link>
                
                <section ref={animationParent} className="flex items-center">
                    {isSideMenuOpen && <MobileSideMenu closeSideMenu={closeSideMenu} />}
                    <div className="hidden items-center gap-3 rounded-2xl border border-[#e7dfd3] bg-[#fcfaf7] px-2 md:flex">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.link ?? "#"}
                                className="group relative rounded-xl px-3 py-2.5 transition-all hover:bg-white"
                            >
                                <p className="flex cursor-pointer items-center gap-2 font-medium text-neutral-600 group-hover:text-black">
                                    <span>{item.label}</span>
                                    {item.children && (
                                        <IoIosArrowDown
                                           className="rotate-180 text-xs transition-all group-hover:rotate-0" 
                                        />
                                    )}
                                </p>

                                {item.children && (
                                    <div className="absolute right-0 top-12 hidden w-auto min-w-[180px] flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg transition-all group-hover:flex">
                                        {item.children.map((child, idx) => (
                                            <Link
                                                key={idx}
                                                href={child.link ?? "#"}
                                                className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-black"
                                            >
                                                <span className="whitespace-nowrap">
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

                <section className="hidden items-center gap-4 md:flex">
                    {!authUser ? (
                        <>
                            <button onClick={() => setShowLogin(true)} className="rounded-xl px-3 py-2 font-medium text-neutral-600 transition-all hover:bg-neutral-100 hover:text-black cursor-pointer">
                                Login
                            </button>
                            <button onClick={() => setshowSingUp(true)} className="rounded-xl bg-[#1f2321] px-4 py-2 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#2b312e] cursor-pointer">
                                SignUp
                            </button>
                        </>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 p-1.5 transition-all cursor-pointer hover:border-neutral-300"
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
                                <div className="absolute right-0 top-12 z-50 w-48 cursor-pointer rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">

                                        <Link
                                            href="/profile"
                                            className="block rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            <div className='flex text-sm items-center gap-5'>
                                                My Account <User className='w-4 h-4'/>
                                            </div>
                                        </Link>

                                        <Link
                                            href="/"
                                            className="block rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => {
                                                setShowProfileDropdown(false);
                                                handleLogout();
                                            }}
                                        >
                                            <div className='flex text-sm items-center gap-13'>
                                                Logout <LogOut className='w-4 h-4'/>
                                            </div>
                                        </Link>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <FiMenu
                   onClick={toggleSideMenu}
                         className="cursor-pointer rounded-xl p-1 text-4xl text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden" 
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
           className="relative rounded-xl px-3 py-2.5 transition-all hover:bg-neutral-100"
        >
            <p className="flex cursor-pointer items-center justify-between gap-2 font-medium text-neutral-700 group-hover:text-black">
                <span>{item.label}</span>
                {item.children && (
                    <IoIosArrowDown
                       className={`text-xs transition-all ${isItemOpen ? "rotate-0" : "rotate-180"}`} 
                    />
                )}
            </p>

            {isItemOpen && item.children && (
                <div className="mt-2 flex w-auto flex-col gap-1 rounded-lg border border-neutral-200 bg-white p-2 transition-all">
                    {item.children.map((child, idx) => (
                        <Link
                            key={idx}
                            href={child.link ?? "#"}
                            className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-black"
                        >
                            <span className="whitespace-nowrap">
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
        <div className="fixed left-0 top-0 z-[100] flex h-full min-h-screen w-full justify-end bg-black/60 md:hidden">
            <div className="h-full w-[82%] max-w-[340px] border-l border-neutral-200 bg-white px-4 py-4">
                <section className="flex justify-end">
                    <AiOutlineClose
                        onClick={closeSideMenu}
                        className="cursor-pointer rounded-xl p-1 text-3xl transition-colors hover:bg-neutral-100" 
                    />
                </section>

                <div className="mt-3 flex flex-col gap-2 text-base transition-all">
                    {navItems.map((item, index) => {
                        return(
                            <SingleNavItem
                                key={index}
                                label={item.label}
                                link={item.link}
                                children={item.children}
                            />
                        )
                    })}
                </div>

                <section className="mt-6 flex flex-col items-center gap-4 px-3">
                    {!authUser ? (
                        <>
                            <button onClick={() => setShowLogin(true)} className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 font-medium text-neutral-700 transition-colors hover:bg-neutral-100">
                                Login
                            </button>
                            <button onClick={() => setshowSingUp(true)} className="w-full rounded-xl bg-[#1f2321] px-4 py-2.5 font-medium text-white transition-all hover:bg-[#2b312e]">
                                SignUp
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 w-full">
                            
                            <Link
                                href="/profile"
                                className="rounded-xl border border-neutral-300 py-2.5 text-center text-neutral-700 hover:bg-neutral-100"
                                onClick={closeSideMenu}
                            >
                                Profile
                            </Link>
                            
                            <button
                                onClick={handleLogout}
                                className="rounded-xl bg-[#1f2321] py-2.5 text-center text-white hover:bg-[#2b312e]"
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