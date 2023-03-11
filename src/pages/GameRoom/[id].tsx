import Head from "next/head";
import React from "react";
import GameRoom from "../../components/GameRoom/GameRoom";
import GameRoomLayout from "../../components/Layout/GameRoomLayout";

export default function GameRoomPage() {
  return (
    <>
      <Head>
        <title>GameRoom</title>
        <meta name="description" content="GameRoom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameRoomLayout>
        <GameRoom />
      </GameRoomLayout>
    </>
  );
}
