import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import type { BoidsStageProps } from "../components/Boids/BoidsStage";

export const BoidsNoSSR = dynamic<BoidsStageProps>(
  import("../components/Boids/BoidsStage"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default function BoidsPage() {
  return (
    <>
      <Head>
        <title>Boids</title>
        <meta name="description" content="Boids" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BoidsNoSSR flock={{ count: 10, delta: 1, behavior: "seekTarget" }} />;
    </>
  );
}
