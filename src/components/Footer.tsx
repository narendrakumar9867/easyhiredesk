import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className="bg-white mt-10">
      <div className="max-w mx-auto px-18 py-12 grid grid-cols-1 md:grid-cols-4 gap-20">
        <div>
          <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r bg-clip-text drop-shadow-md py-2 text-black">
            Easyhire<span className="text-gray-400">Desk</span>
          </h1>

          <p className="text-gray-600 mt-3 text-sm">
            This project helped to the freshers and hire coordinator with easy manage & processed eficient time to complete selection process.
          </p>

          <Link href="about/" className="text-blue-600 mt-3 inline-block text-sm">
            Learn more
          </Link>
        </div>

        <div className="md:px-40">
          <h3 className="font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="services/hire-manager">Hire Manager</Link></li>
            <li><Link href="services/candidates">Candidates</Link></li>
          </ul>
        </div>

        <div className="md:px-24">
          <h3 className="font-semibold mb-3">Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="features/ai-assistance">AI Assistance</Link></li>
          </ul>
        </div>

        <div className="md:px-">
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="contact/">Contact Number</Link></li>
            <li><Link href="contact/">Mail</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t py-6 px-6 flex flex-col md:flex-row items-center justify-between max-w mx-auto">
        <p className="text-sm text-gray-600">© Copyright 2025, All Rights Reserved</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="https://www.linkedin.com/in/narendrakumar-kumawat-474647257/"><FaLinkedin className="text-gray-700 hover:text-blue-500 text-lg" /></Link>
          <Link href="https://github.com/narendrakumar9867/easyhiredesk"><FaGithub className="text-gray-700 hover:text-black text-lg" /></Link>
          <Link href=""><FaInstagram className="text-gray-700 hover:text-pink-500 text-lg" /></Link>
        </div>
      </div>
    </footer>
  );
}
