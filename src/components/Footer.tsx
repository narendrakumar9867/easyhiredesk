import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white mt-10">
      <div className="max-w-full mx-auto px-28 py-18 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r bg-clip-text drop-shadow-md py-2 text-black">
            Easyhire<span className="text-gray-400">Desk</span>
          </h1>
          <p className="text-gray-600 mt-3 text-sm">
            This project helped to the freshers and hire coordinator with easy manage & processed efficient time to complete selection process.
          </p>
          <Link href="/about" className="flex font-semibold items-center text-black mt-3 text-sm gap-1 hover:text-blue-600 transition-colors underline">
            Learn more<ArrowUpRight className="w-4 h-4"/>
          </Link>
        </div>

        <div className="md:px-24">
          <h3 className="font-semibold mb-3 text-black">Services</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/services/hire-manager" className="hover:text-black transition-colors">Hire Manager</Link></li>
            <li><Link href="/services/candidates" className="hover:text-black transition-colors">Candidates</Link></li>
          </ul>
        </div>

        <div className="md:px-12">
          <h3 className="font-semibold mb-3 text-black">Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/features/ai-assistance" className="hover:text-black transition-colors">AI Assistance</Link></li>
            <li><Link href="/features/meeting" className="hover:text-black transition-colors">Scheduled Interviews</Link></li>
          </ul>
        </div>

        <div>
          <Link href="/contact" className="flex font-semibold text-sm items-center gap-2 hover:text-blue-600 transition-colors underline">
            Contact Us <ArrowUpRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>

      <div className="border-t py-6 px-28 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-gray-600">© Copyright 2025, All Rights Reserved</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="https://www.linkedin.com/in/narendrakumar-kumawat-474647257/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-gray-700 hover:text-blue-500 text-lg transition-colors cursor-pointer" />
          </Link>
          <Link href="https://github.com/narendrakumar9867/easyhiredesk" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-gray-700 hover:text-black text-lg transition-colors cursor-pointer" />
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-gray-700 hover:text-pink-500 text-lg transition-colors cursor-pointer" />
          </Link>
        </div>
      </div>
    </footer>
  );
}