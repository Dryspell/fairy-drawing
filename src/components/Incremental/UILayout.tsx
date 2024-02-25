import type { SnackbarMessage } from "../Material/ConsecutiveSnackbars";
import React from "react";
import ConsecutiveSnackbars from "../Material/ConsecutiveSnackbars";
import Box from "@mui/material/Box";
import Footer from "./Footer";

export const UIContext = React.createContext<{
  notify: (message: SnackbarMessage) => void;
}>({
  notify: (message: SnackbarMessage) => {
    console.log("Notific", message.message);
    return;
  },
});

const notifier = (
  setSnackbar: React.Dispatch<React.SetStateAction<readonly SnackbarMessage[]>>
) => {
  return (message: SnackbarMessage) => {
    console.log(
      `[${message.severity?.toUpperCase() || "INFO"}] ${message.message}`
    );
    setSnackbar((prev) => [
      ...prev,
      {
        key: new Date().getTime(),
        ...message,
      },
    ]);
  };
};

export const UILayout = (props: { children: React.ReactNode }) => {
  const [snackbar, setSnackbar] = React.useState(
    [] as readonly SnackbarMessage[]
  );

  const notify = React.useMemo(() => notifier(setSnackbar), [setSnackbar]);

  return (
    <Box>
      <UIContext.Provider value={{ notify }}>
        {props.children}
        <ConsecutiveSnackbars snackbar={snackbar} setSnackbar={setSnackbar} />
      </UIContext.Provider>
      <Footer />
    </Box>
  );
};
