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
  const { authUser, checkAuth } = useAuth();
  const role = authUser?.role;

  useEffect(() => {
    checkAuth();

    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .catch((err) => console.log(err));
  }, [checkAuth]);

  useEffect(() => {
    console.log("authUser:", authUser);
    console.log("role:", role);
  }, [authUser, role]);

  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar />

      {/* Visitor Page */}
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
            <>
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
            </>
          }
          text="As a hiring manager, streamline hiring and manage your candidates."
        />
      )}

      {/* Candidate Page */}
      {role === "candidate" && (
        <Hero
          button={
            <Link href="/joblists">
              <button className="border-balck w-fit rounded-xl border-2 bg-black px-4 py-2 text-white transition-all hover:bg-transparent hover:text-black/90">
                See Our Job Lists
              </button>
            </Link>
          }
          text="As a candidate, explore jobs tailored for you and apply instantly."
        />
      )}

      <Footer />
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
      <div className="flex flex-col items-center gap-6 pt-8 text-center md:w-1/2 md:items-start md:gap-10 md:pt-48 md:text-left">
        <h1 className="text-4xl font-semibold md:text-6xl">
          <Balancer>Hire the best talent in tech, fast.</Balancer>
        </h1>

        <p className="text-neutral-400 md:max-w-[400px]">
          <Balancer>{text}</Balancer>
        </p>

        {button}

        <div className="flex gap-2 md:gap-6">
          <h4>Add the sponsors names</h4>
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