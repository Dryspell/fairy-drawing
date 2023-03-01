export {};
// import React from "react";
// import dynamic from "next/dynamic";
// import Head from "next/head";
// import type { BoidsStageProps } from "../../components/Boids/BoidsStage";
// import { useBoidFlock } from "../../../lib/hooks/useBoidFlock";
// import { useFrameTime } from "../../../lib/hooks/useFrameTime";

// const BoidsNoSSR = dynamic<BoidsStageProps>(
//   import("../../components/Boids/BoidsStage"),
//   {
//     loading: () => (
//       <>
//         <div className="flex h-full w-full items-center justify-center">
//           <h1 className="text-center text-2xl font-semibold text-blue-500">
//             Loading Boids ....
//           </h1>
//         </div>
//       </>
//     ),
//     ssr: false,
//   }
// );

// export default function BoidsPage() {
//   const frameTime = useFrameTime();
//   const [stageBoundaries, setStageBoundaries] = React.useState({
//     x0: 0,
//     x1: window.innerWidth || 1000,
//     y0: 0,
//     y1: window.innerHeight || 500,
//   });

//   const flockState = useBoidFlock(
//     {
//       count: 10,
//       behavior: "seekTarget",
//     },
//     frameTime,
//     stageBoundaries
//   );

//   return (
//     <>
//       <Head>
//         <title>Boids</title>
//         <meta name="description" content="Boids" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <BoidsNoSSR
//         stageBoundaries={stageBoundaries}
//         setStageBoundaries={setStageBoundaries}
//         flockState={flockState}
//         helperOptions={{
//           showShortestDistanceLines: true,
//           showTarget: true,
//         }}
//         textOptions={{
//           show: true,
//           showAngles: true,
//           showNames: true,
//           showScores: true,
//         }}
//       />
//       ;
//     </>
//   );
// }
