import React from "react";
import Head from "next/head";
import { useFrameTime } from "../../../lib/hooks/useFrameTime";
import Timer from "../../components/Stopwatch/Stopwatch";
import Button from "@mui/material/Button";

import Container from "@mui/material/Container";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { LuSword } from "react-icons/lu";
import Grid from "@mui/material/Unstable_Grid2";
import type { Item, ItemType } from "../../components/Incremental/constants";
import { jobs } from "../../components/Incremental/constants";
import { TaskBox } from "../../components/Incremental/TaskBox";

export default function IncrementalGamePage() {
  const frameTime = useFrameTime();
  const [inventory, setInventory] = React.useState<Item[]>([
    // {
    //   type: "wood",
    //   amount: 1,
    // },
  ]);
  const [work, setWork] = React.useState<{
    action: keyof typeof jobs;
    type: ItemType;
  }>({
    action: "none",
    type: "none",
  } as const);

  return (
    <>
      <Head>
        <title>Incremental</title>
        <meta name="description" content="Incremental" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Timer
            frameTime={frameTime}
            // showButton={true}
            showFrameCount={false}
            styles={{ body: undefined, timer: undefined }}
          />
          <Grid container spacing={3}>
            <Grid>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Jobs
                  </Typography>
                  {Object.entries(jobs).map(([job, value]) => {
                    if (!value.production.length) return null;
                    return (
                      <Box key={job}>
                        <Typography variant="h6" component="div">
                          {job}
                        </Typography>
                        {value.production.map((production) => {
                          return (
                            <TaskBox
                              key={production}
                              work={work}
                              setWork={setWork}
                              frameTime={frameTime}
                              task={{
                                action: job as keyof typeof jobs,
                                type: production,
                              }}
                              inventory={inventory}
                              setInventory={setInventory}
                            />
                          );
                        })}
                      </Box>
                    );
                  })}
                </CardContent>
                <CardActions>
                  {/* <Button size="small">Learn More</Button> */}
                </CardActions>
              </Card>
            </Grid>

            <Grid>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Inventory
                  </Typography>
                  {inventory.map((item) => {
                    return (
                      <Typography key={item.type} variant="h6" component="div">
                        {`${item.type}: ${item.amount}`}
                      </Typography>
                    );
                  })}
                </CardContent>
                <CardActions>
                  {/* <Button size="small">Learn More</Button> */}
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
