import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className="bg-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
    <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md py-2">
      Easyhire<span className="text-gray-800">Desk</span>
    </h1>

    <p className="text-gray-600 mt-3 text-sm">
      Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 
      Velit officia consequat duis enim velit mollit.
    </p>

    <Link href="#" className="text-blue-600 mt-3 inline-block text-sm">
      Learn more
    </Link>
  </div>

        <div className="md:px-36">
          <h3 className="font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="#">About</Link></li>
            <li><Link href="#">Features</Link></li>
            <li><Link href="#">Works</Link></li>
            <li><Link href="#">Career</Link></li>
          </ul>
        </div>

        <div className="md:px-20">
          <h3 className="font-semibold mb-3">About</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="#">Customer Support</Link></li>
            <li><Link href="#" className="text-blue-600">Delivery Details</Link></li>
            <li><Link href="#">Terms & Conditions</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="md:px-16">
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="#">Free eBooks</Link></li>
            <li><Link href="#">Development Tutorial</Link></li>
            <li><Link href="#">How to - Blog</Link></li>
            <li><Link href="#">Youtube Playlist</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t py-6 px-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
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
