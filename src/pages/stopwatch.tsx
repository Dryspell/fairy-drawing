import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const StopwatchNoSSR = dynamic(() => import("../components/Stopwatch"), {
  ssr: false,
});
// https://medium.com/projector-hq/writing-a-run-loop-in-javascript-react-9605f74174b

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
