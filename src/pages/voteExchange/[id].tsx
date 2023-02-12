import Head from "next/head";

import React from "react";
import GameRoom from "../../components/GameRoom/GameRoom";

export default function VoteExchange() {
  return (
    <>
      <Head>
        <title>VoteExchange</title>
        <meta name="description" content="VoteExchange" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameRoom />
    </>
  );
}
