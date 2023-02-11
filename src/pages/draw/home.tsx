import { useRouter } from "next/router";
import React from "react";

export default function Index() {
  const route = useRouter();

  return (
    <div className="background relative  mx-auto max-w-screen-2xl overflow-hidden">
      <div className="absolute top-[20%] left-1/3 flex h-72 w-72 rounded-full bg-emerald-500/30"></div>
      <div className="absolute top-[20%] right-1/3 flex h-72 w-72 rounded-full bg-blue-500/30"></div>
      <div className="relative z-20 flex  h-screen w-full flex-col  items-center border pt-56 text-center backdrop-blur-3xl">
        <h1 className="z-30 bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-7xl font-bold text-transparent lg:text-8xl">
          Canvas Next
        </h1>
        <p className="z-30 mt-2 text-xl font-semibold">
          Simple Canvas app with NextJS
        </p>
        <button
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={() => route.push("/draw/sasa")}
          className="mt-7 w-fit rounded-md bg-blue-600 px-3 py-1 text-lg font-semibold text-white transition-shadow hover:shadow-lg"
        >
          Create Canvas
        </button>
      </div>
    </div>
  );
}
