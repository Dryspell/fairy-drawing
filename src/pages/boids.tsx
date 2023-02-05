import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const BoidsNoSSR = dynamic(() => import("../components/Boids/BoidsStage"), {
  ssr: false,
});

export default function BoidsPage() {
  return (
    <>
      <Head>
        <title>Boids</title>
        <meta name="description" content="Boids" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BoidsNoSSR />;
    </>
  );
}
