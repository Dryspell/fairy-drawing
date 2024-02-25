import Head from "next/head";
import Container from "@mui/material/Container";
import { UILayout } from "../../components/Incremental/UILayout";
import Game from "../../components/Incremental/GamePage";

export default function IncrementalGamePage() {
  return (
    <>
      <Head>
        <title>Incremental</title>
        <meta name="description" content="Incremental" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <UILayout>
          <Game />
        </UILayout>
      </Container>
    </>
  );
}
