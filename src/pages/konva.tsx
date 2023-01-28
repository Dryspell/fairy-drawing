import React from "react";
import dynamic from "next/dynamic";

const KonvaNoSSR = dynamic(() => import("../components/KonvaTest"), {
  ssr: false,
});

export default function TestsPage() {
  return <KonvaNoSSR />;
}
