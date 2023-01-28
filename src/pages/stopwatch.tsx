import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const StopwatchNoSSR = dynamic(() => import("../components/Stopwatch"), {
  ssr: false,
});

export default function StopwatchPage() {
  return (
    <>
      <Head>
        <title>Stopwatch</title>
        <meta name="description" content="Stopwatch" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StopwatchNoSSR />
    </>
  );
}
