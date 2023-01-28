import React from "react";
import dynamic from "next/dynamic";

const StopwatchNoSSR = dynamic(() => import("../components/Stopwatch"), {
  ssr: false,
});

export default function TestsPage(props: any) {
  return <StopwatchNoSSR />;
}
