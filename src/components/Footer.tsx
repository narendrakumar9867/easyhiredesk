import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const serviceLinks = [
    { label: "Hire Manager", href: "/services/hire-manager" },
    { label: "Candidates", href: "/services/candidates" },
  ];

  const featureLinks = [
    { label: "AI Assistance", href: "/features/ai-assistance" },
    { label: "Scheduled Interviews", href: "/features/meeting" },
  ];

  return (
    <footer className="mt-10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-10">
        <div className="max-w-sm">
          <h1 className="py-2 text-4xl font-extrabold tracking-wide text-black">
            Easyhire<span className="text-gray-400">Desk</span>
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            EasyhireDesk helps hiring managers and candidates navigate recruitment with clearer workflows, round tracking, and stronger communication.
          </p>
          <Link
            href="/about"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-black underline underline-offset-2 transition-colors hover:text-neutral-600"
          >
            Learn more
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-black">Services</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {serviceLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-black">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-black">Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {featureLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-black">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-black">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-black underline underline-offset-2 transition-colors hover:text-neutral-600"
            >
              Contact us
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </h3>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row lg:px-10">
          <p className="text-sm text-gray-600">© {year} EasyhireDesk. All rights reserved.</p>
          <div className="flex gap-4">
            <Link
              href="https://www.linkedin.com/in/narendrakumar-kumawat-474647257/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EasyhireDesk on LinkedIn"
            >
              <FaLinkedin className="cursor-pointer text-lg text-gray-700 transition-colors hover:text-blue-500" />
            </Link>
            <Link
              href="https://github.com/narendrakumar9867/easyhiredesk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EasyhireDesk on GitHub"
            >
              <FaGithub className="cursor-pointer text-lg text-gray-700 transition-colors hover:text-black" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="EasyhireDesk on Instagram"
            >
              <FaInstagram className="cursor-pointer text-lg text-gray-700 transition-colors hover:text-pink-500" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}