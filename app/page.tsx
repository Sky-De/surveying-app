"use client";
import ConvertGeoFile from "@/components/ConvertGeoFile";

export default function Home() {
  
  return (
    <div className="border-2 h-screen w-screen flex p-4 items-center justify-center">
      <main className="flex flex-col items-center">
       <ConvertGeoFile/>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
