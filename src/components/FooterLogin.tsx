import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";


export default function FooterLogin() {
  return (
    <footer className="bg-white">
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
