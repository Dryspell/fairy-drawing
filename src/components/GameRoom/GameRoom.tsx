import { Container } from "@mantine/core";
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
import Timer from "../Stopwatch/Stopwatch";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { BoidsOptionsModal } from "../Modals/BoidsOptionsModal";
import { ChatModal } from "../Modals/ChatModal";
import { MarketModal } from "../Modals/MarketModal";

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

const INITIAL_STAGE_DIM = 1000;

export default function GameRoom() {
  // console.log("GameRoom Rendered");

  const frameTime = useFrameTime();
  const [stageBoundaries, setStageBoundaries] = React.useState({
    x0: 0,
    x1: INITIAL_STAGE_DIM,
    y0: 0,
    y1: INITIAL_STAGE_DIM / 2,
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
  const [openChatModal, setOpenChatModal] = useState(false);
  const [openMarketModal, setOpenMarketModal] = useState(false);

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
          <Container fluid className="p-10">
            <AppBar component="nav">
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
                    onClick={() => {
                      console.log("Chat");
                      setOpenChatModal(!openChatModal);
                    }}
                    variant="text"
                    sx={{ color: "#fff" }}
                    startIcon={<BsChatLeftText className="h-5 w-5" />}
                  >
                    Chat
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Market");
                      setOpenMarketModal(!openMarketModal);
                    }}
                    variant="text"
                    sx={{ color: "#fff" }}
                    startIcon={<GoGraph className="h-5 w-5" />}
                  >
                    Market
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Settings");
                      setOpenOptionsModal(!openOptionsModal);
                    }}
                    variant="text"
                    sx={{ color: "#fff" }}
                    startIcon={<FiSettings className="h-5 w-5" />}
                  >
                    Settings
                  </Button>
                </Box>
              </Toolbar>
            </AppBar>
            <Box component="main">
              <Toolbar />
              <BoidsOptionsModal
                openOptionsModal={openOptionsModal}
                setOpenOptionsModal={setOpenOptionsModal}
                boidsDisplayOptions={boidsDisplayOptions}
                setBoidsDisplayOptions={setBoidsDisplayOptions}
                boidsTextOptions={boidsTextOptions}
                setBoidsTextOptions={setBoidsTextOptions}
              />
              <ChatModal
                openChatModal={openChatModal}
                setOpenChatModal={setOpenChatModal}
                chat={"chat"}
              />
              <MarketModal
                openMarketModal={openMarketModal}
                setOpenMarketModal={setOpenMarketModal}
                market={"market"}
              />
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
            </Box>
          </Container>
        </>
      )}
    </div>
  );
}
