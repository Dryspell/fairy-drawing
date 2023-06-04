import Head from "next/head";
import React from "react";
import Board from "../../components/Automata/Board";
import AutomataLayout from "../../components/Layout/AutomataLayout";

export default function GameRoomPage() {
  return (
    <>
      <Head>
        <title>Game of Life</title>
        <meta name="description" content="GameOfLife" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AutomataLayout>
        <Board />
      </AutomataLayout>
    </>
  );
}
