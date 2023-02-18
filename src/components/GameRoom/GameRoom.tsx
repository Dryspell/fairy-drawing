import { Container, Grid, Skeleton, Switch, Tabs } from "@mantine/core";
import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { BsChatLeftText } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { GoGraph } from "react-icons/go";
import { useBoidFlock } from "../../../lib/hooks/useBoidFlock";
import { useFrameTime } from "../../../lib/hooks/useFrameTime";
import type { BoidsStageProps } from "../Boids/BoidsStage";
import ChatBox from "../Chat/ChatBox";
import DraggableModal from "../DraggableModal";
import Timer from "../Stopwatch/Stopwatch";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const BoidsNoSSR = dynamic<BoidsStageProps>(import("../Boids/BoidsStage"), {
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
});

const INITIAL_STAGE_DIM = 500;

export function ToggleButton(props: {
  toggled: boolean;
  setToggled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Button
      onClick={() => props.setToggled(!props.toggled)}
      variant={props.toggled ? "outlined" : "contained"}
      startIcon={<FiSettings className="h-5 w-5" />}
    >
      Hello
    </Button>
  );
}

export function BoidsOptionsModal(props: {
  openOptionsModal: boolean;
  setOpenOptionsModal: React.Dispatch<React.SetStateAction<boolean>>;
  boidsDisplayOptions: string[];
  setBoidsDisplayOptions: React.Dispatch<React.SetStateAction<string[]>>;
  boidsTextOptions: string[];
  setBoidsTextOptions: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <DraggableModal
      open={props.openOptionsModal}
      setOpen={props.setOpenOptionsModal}
      title="Boids Options"
    >
      <Switch.Group
        label="Display Controls"
        value={props.boidsDisplayOptions}
        onChange={props.setBoidsDisplayOptions}
      >
        <Switch
          value="showShortestDistanceLines"
          label="ShortestDistanceLines"
        />
        <Switch value="showTarget" label="Target" />
      </Switch.Group>
      <Switch.Group
        label="Text Controls"
        value={props.boidsTextOptions}
        onChange={props.setBoidsTextOptions}
      >
        <Switch value="showText" label="Text" />
        <Switch value="showAngles" label="Angles" />
        <Switch value="showNames" label="Names" />
        <Switch value="showScores" label="Scores" />
      </Switch.Group>
    </DraggableModal>
  );
}

export default function GameRoom() {
  // console.log("GameRoom Rendered");

  const frameTime = useFrameTime();
  const [stageBoundaries, setStageBoundaries] = React.useState({
    x0: 0,
    x1: INITIAL_STAGE_DIM,
    y0: 0,
    y1: INITIAL_STAGE_DIM,
  });

  const flockState = useBoidFlock(
    {
      count: 10,
      behavior: "seekTarget",
    },
    frameTime,
    stageBoundaries
  );

  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);

  const [boidsDisplayOptions, setBoidsDisplayOptions] = useState([
    "showShortestDistanceLines",
    "showTarget",
  ]);
  const [boidsTextOptions, setBoidsTextOptions] = useState([
    "showText",
    "showNames",
    "showScores",
  ]);

  const [openOptionsModal, setOpenOptionsModal] = useState(false);

  function handleLoading(value: boolean) {
    setLoading(value);
  }

  function handleValid(value: boolean) {
    setValid(value);
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
              Oops, room is full
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
            <AppBar component={"nav"}>
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  Game Room
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  onClick={() => frameTime.togglePause()}
                  sx={{ color: "#fff" }}
                  startIcon={frameTime.paused ? <CiPlay1 /> : <CiPause1 />}
                >
                  <Timer frameTime={frameTime} />
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Button
                    onClick={() => setOpenOptionsModal(!openOptionsModal)}
                    variant="text"
                    // variant={openOptionsModal ? "outlined" : "contained"}
                    sx={{ color: "#fff" }}
                    startIcon={<FiSettings className="h-5 w-5" />}
                  >
                    Hello
                  </Button>
                </Box>
              </Toolbar>
            </AppBar>
            <BoidsOptionsModal
              openOptionsModal={openOptionsModal}
              setOpenOptionsModal={setOpenOptionsModal}
              boidsDisplayOptions={boidsDisplayOptions}
              setBoidsDisplayOptions={setBoidsDisplayOptions}
              boidsTextOptions={boidsTextOptions}
              setBoidsTextOptions={setBoidsTextOptions}
            />
            <Grid className={"p-6"}>
              <Grid.Col span={6}>
                <BoidsNoSSR
                  stageBoundaries={stageBoundaries}
                  setStageBoundaries={setStageBoundaries}
                  flockState={flockState}
                  helperOptions={{
                    showShortestDistanceLines: boidsDisplayOptions.includes(
                      "showShortestDistanceLines"
                    ),
                    showTarget: boidsDisplayOptions.includes("showTarget"),
                  }}
                  textOptions={{
                    show: boidsTextOptions.includes("showText"),
                    showAngles: boidsTextOptions.includes("showAngles"),
                    showNames: boidsTextOptions.includes("showNames"),
                    showScores: boidsTextOptions.includes("showScores"),
                  }}
                />
                {/* <Button fullWidth variant="outline" className={"mt-4"}>
                  Vote
                </Button> */}
              </Grid.Col>
              <Grid.Col span={6}>
                <Container>
                  <Tabs defaultValue={"Chat"} orientation="horizontal">
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
