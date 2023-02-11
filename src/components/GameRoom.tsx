import { Button, Container, Grid, Skeleton, Tabs } from "@mantine/core";
import dynamic from "next/dynamic";
import { useState } from "react";
import { BsChatLeftText } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import type { BoidsStageProps } from "../components/Boids/BoidsStage";
import ChatBox from "./Chat/ChatBox";

export const BoidsNoSSR = dynamic<BoidsStageProps>(
  import("../components/Boids/BoidsStage"),
  {
    loading: () => (
      <>
        <div className="flex h-full w-full items-center justify-center">
          <h1 className="text-center text-2xl font-semibold text-blue-500">
            Loading Boids ....
          </h1>
        </div>
      </>
    ),
    ssr: false,
  }
);

const PRIMARY_COL_HEIGHT = 500;

export default function GameRoom() {
  const [loading, setloading] = useState(false);
  const [valid, setvalid] = useState(true);

  function handleLoading(value: boolean) {
    setloading(value);
  }

  function handleValid(value: boolean) {
    setvalid(value);
  }

  return (
    <div>
      {loading && (
        <>
          <div className="flex h-full w-full items-center justify-center align-middle">
            <h1 className="text-center text-2xl font-semibold text-blue-500">
              Loading Game Room ....
            </h1>
          </div>
        </>
      )}

      {!loading && !valid && (
        <>
          <div className="flex h-full w-full items-center justify-center">
            <h1 className="text-center text-2xl font-semibold text-blue-500">
              Ooooops, room is full
            </h1>
            <p className="text-center text-xl text-blue-500">
              Please wait for a while and refresh
            </p>
          </div>
        </>
      )}

      {!loading && valid && (
        <>
          <Container fluid className={"p-10"}>
            <h1>VoteExchange</h1>
            <Grid className={"p-6"}>
              <Grid.Col span={6}>
                <BoidsNoSSR
                  width={PRIMARY_COL_HEIGHT}
                  height={PRIMARY_COL_HEIGHT}
                  flock={{ count: 10, delta: 1, behavior: "seekTarget" }}
                />
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
      )}
    </div>
  );
}
