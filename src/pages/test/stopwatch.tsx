import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useFrameTime } from "../../../lib/hooks/useFrameTime";
import styles from "../../components/Stopwatch/Stopwatch.module.css";

const StopwatchNoSSR = dynamic(
  () => import("../../components/Stopwatch/Stopwatch"),
  {
    ssr: false,
  }
);
// https://medium.com/projector-hq/writing-a-run-loop-in-javascript-react-9605f74174b

export default function StopwatchPage() {
  const frameTime = useFrameTime();

  return (
    <>
      <Head>
        <title>Stopwatch</title>
        <meta name="description" content="Stopwatch" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StopwatchNoSSR
        frameTime={frameTime}
        showButton={true}
        showFrameCount={false}
        styles={{ body: styles.body, timer: styles.timer }}
      />
    </>
  );
}
