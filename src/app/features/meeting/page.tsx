"use client";
import React from 'react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { useAuth } from '@/src/hooks/useAuth';
import Balancer from 'react-wrap-balancer';


const meetingPage = () => {
  const { authUser } = useAuth();
  const role = authUser?.role;

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <div className='fixed top-0 left-0 w-full z-50 shadow-md bg-white'>
        <Navbar />
      </div>

      <div className='pt-20'>
        {!role && (
          <Hero
            button={null}
            text="Get your team in sync, no matter your location. Streamline processes, create team rituals, and watch productivity soar."
          />
        )}
      </div>

      <div className='flex-1 max-w-6xl mx-auto py-10 px-6 pt-28'>

      </div>

      <Footer />
    </div>
  );
};

function Hero({
  button,
  text,
}: {
  button: React.ReactNode | null;
  text: string;
}) {
  return (
    <section className='mx-auto flex max-w-6xl flex-col-reverse gap-24 px-4 pb-12 transition-all md:flex-row md:gap-4'>
      <div className='flex flex-col items-center gap-6 pt-8 text-center md:w-1/2 md:items-start md:gap-10 md:pt-32 md:text-left'>
      <h1 className='text-4xl font-semibold md:text-6xl'>
        <Balancer>{text}</Balancer>
      </h1>
      </div>
    </section>
  )
}

export default meetingPage;