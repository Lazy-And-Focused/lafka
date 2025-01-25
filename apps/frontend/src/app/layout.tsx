import type { Metadata } from "next";

import "@/utils/fontsLoader";
import "./globals.css";

import Image from "next/image";
import FilePencil from "./icons/FilePencil";

export const metadata: Metadata = {
  title: "Lafka",
  description: "The best forum of the World.",
  applicationName: "Lafka",
  authors: [
    { name: "Valentin Bird", url: "https://lanvalird.netlify.app/" },
    { name: "FOCKUSTY", url: "https://fockusty.netlify.app/" },
  ],
  category: "forum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <header>
          <h1>
            <Image
              className="w-auto h-10"
              src={"/logotype.png"}
              alt={"Logotype"}
              width="256"
              height="70"
            />
          </h1>

          <div className="flex flex-row justify-end items-center gap-5">
            <button className="text-[#EFDBB3] border  border-[#EFDBB3] rounded-lg w-6 h-6 flex items-center justify-center">
              <FilePencil width={16} height={16} />
            </button>
            <Image
              className="w-8 h-8 aspect-square rounded-full"
              src={"https://laf-info.netlify.app/images/avatars/default.png"}
              alt={"Logotype"}
              width="32"
              height="32"
            />
          </div>
        </header>

        <main>{children}</main>

        <footer>
          <a href="https://laf-info.netlify.app/" target="_blank">
            <Image
              className="w-auto h-6"
              src="/made-laf.png"
              alt="Made with LAF"
              width="128"
              height="25"
            />
          </a>
        </footer>
      </body>
    </html>
  );
}
