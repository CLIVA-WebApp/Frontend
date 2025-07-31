import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1D567C] text-white px-8 py-6 flex flex-col lg:flex-row justify-between items-center gap-4">
      {/* Left section: logo + links + copyright */}
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex items-center gap-6">
          <Image src="/images/cliva.png" alt="Cliva logo" width={64} height={36} />
          <div className="hidden lg:block w-px h-16 bg-white/50" />
        </div>
        <div className="text-center lg:text-left space-y-1">
          <div className="flex gap-6 justify-center lg:justify-start text-white text-base font-medium">
            <Link href="/about">About</Link>
            {/* TODO */}
            <Link href="#">Benefits</Link>
            {/* TODO */}
            <Link href="#">Support</Link>
          </div>
          <p className="text-sm max-w-xl leading-snug">
            ©2025 I Woke Up as a Stuck Merge Conflict, but I’m Determined to Resolve Myself and Claim HEAD in the Git History Tree
          </p>
        </div>
      </div>

      {/* Right section: social icons + email */}
      <div className="flex flex-col lg:items-end items-center gap-3">
        <div className="flex gap-4">
          {/* TODO */}
          <a href="https://instagram.com/yosevelyn_"><svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2.2c3.18 0 3.56.012 4.81.07 1.17.056 1.96.24 2.41.41a4.82 4.82 0 011.69 1.1 4.82 4.82 0 011.1 1.69c.17.45.35 1.24.4 2.41.06 1.25.07 1.63.07 4.81s-.01 3.56-.07 4.81c-.06 1.17-.23 1.96-.4 2.41a4.82 4.82 0 01-1.1 1.69 4.82 4.82 0 01-1.69 1.1c-.45.17-1.24.35-2.41.4-1.25.06-1.63.07-4.81.07s-3.56-.01-4.81-.07c-1.17-.06-1.96-.23-2.41-.4a4.82 4.82 0 01-1.69-1.1 4.82 4.82 0 01-1.1-1.69c-.17-.45-.35-1.24-.4-2.41C2.21 15.56 2.2 15.18 2.2 12s.01-3.56.07-4.81c.05-1.17.23-1.96.4-2.41A4.82 4.82 0 013.77 3.1 4.82 4.82 0 015.46 2c.45-.17 1.24-.35 2.41-.4C8.44 2.2 8.82 2.2 12 2.2zm0 1.8c-3.14 0-3.5.012-4.73.068-.97.044-1.5.204-1.85.34-.47.18-.8.39-1.16.75a3.3 3.3 0 00-.75 1.16c-.14.35-.3.88-.34 1.85C3.22 9.5 3.2 9.86 3.2 13s.012 3.5.068 4.73c.044.97.204 1.5.34 1.85.18.47.39.8.75 1.16.36.36.69.57 1.16.75.35.14.88.3 1.85.34 1.23.06 1.59.068 4.73.068s3.5-.012 4.73-.068c.97-.044 1.5-.204 1.85-.34.47-.18.8-.39 1.16-.75.36-.36.57-.69.75-1.16.14-.35.3-.88.34-1.85.06-1.23.068-1.59.068-4.73s-.012-3.5-.068-4.73c-.044-.97-.204-1.5-.34-1.85a3.3 3.3 0 00-.75-1.16 3.3 3.3 0 00-1.16-.75c-.35-.14-.88-.3-1.85-.34-1.23-.06-1.59-.068-4.73-.068zm0 3.6a5.2 5.2 0 110 10.4 5.2 5.2 0 010-10.4zm0 1.8a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8zm6.2-.9a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg></a>
          
          {/* TODO */}
          <a href="https://linkedin.com/in/evelynyosiana" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M16.5 3a5.5 5.5 0 004.5 2.2v3.1a8.6 8.6 0 01-4.5-1.2v7.9a6.5 6.5 0 11-6.5-6.5h.5v3.1a3.4 3.4 0 100 6.8 3.4 3.4 0 003.4-3.4V3h2.6z"/>
            </svg>
          </a>

          {/* TODO */}
          <a href="#" target="_blank" rel="noopener noreferrer">
            <svg
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.244 2H21.5l-7.5 8.571L22 22h-6.244l-5.004-6.146L5.5 22H2.244l8.13-9.286L2 2h6.244l4.496 5.785L18.244 2z" />
            </svg>
          </a>

        </div>
        <div className="text-sm">Support: 13522083@std.stei.itb.ac.id</div>
      </div>
    </footer>
  );
};

export default Footer;
