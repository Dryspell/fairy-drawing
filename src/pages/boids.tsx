import React from "react";
import dynamic from "next/dynamic";

const BoidsNoSSR = dynamic(() => import("../components/BoidsStage"), {
  ssr: false,
});

export default function TestsPage(props: any) {
  return <BoidsNoSSR />;
}
