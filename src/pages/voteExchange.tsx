import Head from "next/head";
import { Button, Container, Grid, Skeleton, Tabs } from "@mantine/core";
import ChatBox from "../components/Chat/ChatBox";
import { BsChatLeftText } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { GoGraph } from "react-icons/go";

const PRIMARY_COL_HEIGHT = 500;

export default function VoteExchange() {
  return (
    <>
      <Head>
        <title>VoteExchange</title>
        <meta name="description" content="VoteExchange" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container fluid className={"p-10"}>
        <h1>VoteExchange</h1>
        <Grid className={"p-6"}>
          <Grid.Col span={6}>
            <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />
            <Button fullWidth variant="outline" className={"mt-4"}>
              Vote
            </Button>
          </Grid.Col>
          <Grid.Col span={6}>
            <Container>
              <Tabs orientation="horizontal">
                <Tabs.List>
                  <Tabs.Tab value="Chat" icon={<BsChatLeftText />}>
                    Chat
                  </Tabs.Tab>
                  <Tabs.Tab value="Market" icon={<GoGraph />}>
                    Market
                  </Tabs.Tab>
                  <Tabs.Tab value="Settings" icon={<FiSettings />}>
                    Settings
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="Chat">
                  <ChatBox />
                </Tabs.Panel>
                <Tabs.Panel value="Market">
                  <p>Market</p>
                  <Skeleton height={"400px"} />
                </Tabs.Panel>
                <Tabs.Panel value="Settings">
                  <h2>Settings</h2>
                  <Skeleton height={"400px"} />
                </Tabs.Panel>
              </Tabs>
            </Container>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
