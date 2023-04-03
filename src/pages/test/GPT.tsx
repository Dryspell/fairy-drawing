import { TextField } from "@mui/material";
import Container from "@mui/material/Container";
import { Remark } from "react-remark";
import React from "react";
import { api } from "../../utils/api";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../../server/api/root";

export default function GPT_Test() {
  const [chatText, setChatText] = React.useState("");
  const [responses, setResponses] = React.useState<
    inferRouterOutputs<AppRouter>["gpt"]["completion"][]
  >([]);

  const sendChat = api.gpt.completion.useMutation({
    onSuccess: (data) => {
      setResponses((pre) => [...pre, data]);
    },
  });

  const handleChatSubmit = () => {
    sendChat.mutate({ text: chatText });
    setChatText("");
  };

  return (
    <Container>
      {responses.length &&
        responses.map((response, index) => (
          <Remark key={index}>{response.choices?.[0]?.text || ""}</Remark>
        ))}
      <TextField
        label={`Chat...`}
        fullWidth
        multiline
        maxRows={4}
        placeholder={`Chat...`}
        onChange={(e) => setChatText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChatSubmit();
          }
        }}
      />
    </Container>
  );
}
