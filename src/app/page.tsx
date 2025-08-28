import React from 'react';
import Balancer from 'react-wrap-balancer';
import Image from 'next/image';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import hremoImageDesktop from "../../public/images/image-hero-desktop.png"
import hremoImageMobile from "../../public/images/image-hero-mobile.png"

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      < Navbar />

      <section className="mx-auto flex max-w-6xl flex-col-reverse gap-24 px-4 pb-12 transition-all md:flex-row md:gap-4">
        <div className="flex flex-col items-center gap-6 pt-8 text-center md:w-1/2 md:items-start md:gap-10 md:pt-48 md:text-left">
          <Balancer>
            <h1 className="text-4xl font-semibold md:text-6xl">
              Hire the best talent in tech, fast.
            </h1>
          </Balancer>
          <Balancer>
            <p className=" text-neutral-400 md:max-w-[400px]">
              Get your team in sync, no matter your location. Streamline
              processes, create team rituals, and watch productivity soar.
            </p>
          </Balancer>
          <button className="border-balck  w-fit rounded-xl border-2 bg-black px-4 py-2  text-white transition-all hover:border-black hover:bg-black hover:bg-transparent  hover:text-black/90">
            Hire Next Candidates
          </button>
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

      < Footer />
    </div>
  )
}
