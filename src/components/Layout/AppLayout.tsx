import { Container, LoadingOverlay } from "@mantine/core";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { BsChatLeftText } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { GoGraph } from "react-icons/go";
import { useFrameTime } from "../../../lib/hooks/useFrameTime";
import Timer from "../Stopwatch/Stopwatch";
import MenuIcon from "@mui/icons-material/Menu";
import { BoidsOptionsModal } from "../Modals/BoidsOptionsModal";
import { ChatModal } from "../Modals/ChatModal";
import { MarketModal } from "../Modals/MarketModal";
import {
  BoidsMetaStateContext,
  defaultBoidsDisplayOptions,
  defaultBoidsTextOptions,
  MarketContext,
} from "./GameRoomContext";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import TemporaryDrawer from "./Drawer";
import ChatLayout from "./ChatLayout";

export default function AppLayout({
  children,
  props,
}: {
  children: React.ReactNode;
  props?: { signInOptional?: boolean };
}) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  if (sessionStatus === "unauthenticated" && !props?.signInOptional) {
    signIn().catch((err) => console.log(err));
  }

  const frameTime = useFrameTime();
  const [openOptionsModal, setOpenOptionsModal] = useState(false);
  const [openChatModal, setOpenChatModal] = useState(false);
  const [openMarketModal, setOpenMarketModal] = useState(false);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [boidsDisplayOptions, setBoidsDisplayOptions] = useState(
    defaultBoidsDisplayOptions
  );
  const [boidsTextOptions, setBoidsTextOptions] = useState(
    defaultBoidsTextOptions
  );

  return (
    <Container fluid className="p-10">
      {sessionStatus === "authenticated" || props?.signInOptional ? (
        <>
          <AppBar component="nav">
            <Toolbar className="justify-between">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {`${session?.user?.name || "Unknown User"}, Game Room: ${
                  router.query.id as string
                }`}
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
          <TemporaryDrawer
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
          />
          <ChatLayout>
            <MarketContext.Provider value={{ market: {} }}>
              <BoidsMetaStateContext.Provider
                value={{
                  frameTime,
                  boidsDisplayOptions,
                  setBoidsDisplayOptions,
                  boidsTextOptions,
                  setBoidsTextOptions,
                }}
              >
                <Box>
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
                    roomId={"test"}
                  />
                  <MarketModal
                    openMarketModal={openMarketModal}
                    setOpenMarketModal={setOpenMarketModal}
                    market={"market"}
                  />
                </Box>
                <Box component="main">{children}</Box>
              </BoidsMetaStateContext.Provider>
            </MarketContext.Provider>
          </ChatLayout>
        </>
      ) : (
        <LoadingOverlay visible />
      )}
    </Container>
  );
}
