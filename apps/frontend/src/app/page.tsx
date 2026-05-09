import Image from "next/image";

export default function Home() {
  return (
    <main className="h-screen flex flex-col justify-center items-center bg-linear-to-t from-green-950/50 to-[#d56716]/10">
      <h1 className="font-[Spectral] font-bold text-5xl mb-4 border-b border-orange-950">Lafka</h1>

      <h2 className="font-[Prata] font-bold text-2xl">Hello from Lazy And Focused team and FarySD (Fairy)</h2>
      <p>
        All docs about structure avaible on <a className="italic hover:opacity-80" href="https://docs.laf-team.ru/architectures/fail" target="_blank" rel="noopener noreferrer">Lazy And Focused Documentation</a>.
      </p>
    </main>
  );
}
