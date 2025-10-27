"use client";
import React, { useEffect } from "react";
import Balancer from "react-wrap-balancer";
import Image from "next/image";
import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "@/src/hooks/useAuth";

import hremoImageDesktop from "../../public/images/image-hero-desktop.png";
import hremoImageMobile from "../../public/images/image-hero-mobile.png";

export default function Home() {
  const { authUser, checkAuth, isCheckingAuth, initializeAuth } = useAuth();
  const role = authUser?.role;

  useEffect(() => {
    initializeAuth();

    const token = localStorage.getItem("token");
    if(token && !authUser) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch("http://localhost:5000/", {
          method: "GET",
        });
        
        if(response.ok) {
          console.log("Server connection successfully.");
        }
      } catch (error) {
        console.log("server connection failed.", error);
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    console.log("authUser:", authUser);
    console.log("role:", role);
    console.log("isCheckingAuth:", isCheckingAuth);
  }, [authUser, role, isCheckingAuth]);

  if(isCheckingAuth) {
    return(
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-white">

      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </div>
        {/* Visitor Page */}
        <div className="pt-20">
          {!role && (
          <Hero
            button={null}
            text="Get your team in sync, no matter your location. Streamline processes, create team rituals, and watch productivity soar."
          />
        )}

        {/* Hire Manager Page */}
        {role === "hire_manager" && (
          <Hero
            button={
              <div className="flex gap-4">
                <Link href="/hireprocess">
                  <button className="border-black w-fit rounded-xl border-2 bg-black px-4 py-2 text-white transition-all hover:bg-transparent hover:text-black/90 mr-3">
                    Hire Next Candidates
                  </button>
                </Link>
                <Link href="/joblists">
                  <button className="border-black w-fit rounded-xl border-2 bg-black px-4 py-2 text-white transition-all hover:bg-transparent hover:text-black/90">
                    See Our Job Lists
                  </button>
                </Link>
              </div>
            }
            text="As a hiring manager, streamline hiring and manage your candidates."
          />
        )}

        {/* Candidate Page */}
        {role === "candidate" && (
          <Hero
            button={
              <div className="flex gap-4">
                  <Link href="/joblists">
                    <button className="border-balck w-fit rounded-xl border-2 bg-black px-4 py-2 text-white transition-all hover:bg-transparent hover:text-black/90">
                      See Our Job Lists
                    </button>
                  </Link>
                  <Link href="/profile">
                    <button className="border-black w-fit rounded-xl border-2 bg-black px-4 py-2 text-white transition-all hover:bg-transparent hover:text-black/90">
                      Update Profile
                    </button>
                  </Link>
              </div>
            
            }
            text="As a candidate, explore jobs tailored for you and apply instantly."
          />
        )}

        <Footer />
      </div> 
    </div>
  );
}

function Hero({
  button,
  text,
}: {
  button: React.ReactNode | null;
  text: string;
}) {
  return (
    <section className="mx-auto flex max-w-6xl flex-col-reverse gap-24 px-4 pb-12 transition-all md:flex-row md:gap-4">
      <div className="flex flex-col items-center gap-6 pt-8 text-center md:w-1/2 md:items-start md:gap-10 md:pt-36 md:text-left">
        <h1 className="text-4xl font-semibold md:text-6xl">
          <Balancer>Hire the best talent in tech, fast.</Balancer>
        </h1>

        <p className="text-neutral-400 md:max-w-[400px]">
          <Balancer>{text}</Balancer>
        </p>

        {button}

        <div className="flex flex-col text-center items-center gap-2 md:gap-3">
          <h4 className="text-gray-700 text-sm md:text-base font-medium">
            <span className="font-semibold text-gray-900">Sponsors:</span> Sunrise Innovations, SilverOak Solutions, Northgate Ventures, etc.
          </h4>
          <p className="text-xs md:text-sm text-gray-500 max-w-2xl">
            Sponsor names shown in this project are fictional and used for demonstration purposes only. They do not represent real organizations or endorsements.
          </p>
        </div>
      </div>

      <section className="md:w-1/2">
        <div className="hidden md:block px-28 py-20">
          <Image
            src={hremoImageDesktop}
            alt="hero-image"
            className="h-auto max-w-[400px]"
          />
        </div>
        <div className="md:hidden">
          <Image
            src={hremoImageMobile}
            alt="hero-image"
            className="h-auto max-w-[350px] max-h-[350px] mx-auto pt-16"
          />
        </div>
      </section>
    </section>
  );
}