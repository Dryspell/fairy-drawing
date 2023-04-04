import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";

import React from "react";
import { Remark } from "react-remark";
import { api } from "../../utils/api";

export default function Page() {
  const [chatText, setChatText] = React.useState("");
  const [chatQuery, setChatQuery] = React.useState("");

  const { data: responses, isLoading } = api.gpt.completion.useQuery(
    { text: chatQuery },
    { enabled: !!chatQuery, refetchOnWindowFocus: false }
  );

  const handleChatSubmit = () => {
    setChatQuery(chatText);
    setChatText("");
  };

  return (
    <Container className="p-10">
      <Container>
        {responses?.choices?.length &&
          responses.choices.map((choice, index) => (
            <Remark key={index}>{choice.text || ""}</Remark>
          ))}
        {isLoading && <LinearProgress />}
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
    </Container>
  );
}
