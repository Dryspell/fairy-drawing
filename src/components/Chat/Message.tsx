import { Text, Avatar, clsx } from "@mantine/core";
import { Box, IconButton, Paper } from "@mui/material";
import Reply from "@mui/icons-material/Reply";
import EmojiEmotions from "@mui/icons-material/EmojiEmotions";
import React from "react";

export const mockData = {
  postedAt: "10 minutes ago",
  body: "This Pokémon likes to lick its palms that are sweetened by being soaked in honey. Teddiursa concocts its own honey by blending fruits and pollen collected by Beedrill. Blastoise has water spouts that protrude from its shell. The water spouts are very accurate.",
  author: {
    name: "Jacob Warnhalter",
    image:
      "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
  },
};

export type MessageData = {
  postedAt: string;
  text: string;
  author: {
    username: string;
    name: string;
    image: string;
  };
};

export default function ChatMessage({ postedAt, text, author }: MessageData) {
  const [isHovering, setIsHovering] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className={clsx(
        "flex",
        "flex-col",
        "items-start",
        "p-4",
        "rounded-md",
        "transition-colors",
        "hover:bg-gray-200",
        "cursor-pointer",
        "relative",
        "sm:flex-row"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex-shrink-0">
        <Avatar
          src={author.image}
          alt={author.username}
          className="mr-2"
          radius="xl"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <Text size="sm" className="px-1">
              {author.username}
            </Text>
            <Text size="xs" color="dimmed">
              {postedAt}
            </Text>
          </div>
          <Paper
            className={clsx(
              "mt-2 sm:mt-0",
              "flex",
              "items-center",
              "opacity-0",
              "transition-opacity",
              "absolute",
              "right-0",
              "top-0",
              isHovering && "opacity-100"
            )}
            elevation={2}
          >
            <IconButton aria-label="reply" size="small">
              <Reply />
            </IconButton>
            <IconButton aria-label="emoji" size="small">
              <EmojiEmotions />
            </IconButton>
          </Paper>
        </div>
        <div className="mt-2">{text}</div>
      </div>
    </div>
  );
}
