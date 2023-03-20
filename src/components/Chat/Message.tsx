import { Text, Avatar, clsx } from "@mantine/core";
import { IconButton, Input, Paper, TextField, Typography } from "@mui/material";
import Reply from "@mui/icons-material/Reply";
import React from "react";
import { Transition } from "@headlessui/react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { Remark } from "react-remark";

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
  replies: MessageData[];
};

export default function ChatMessage({
  postedAt,
  text,
  author,
  replies,
}: MessageData) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [showReplies, setShowReplies] = React.useState(false);
  const [showReplyInputField, setShowReplyInputField] = React.useState(false);

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
              "right-4",
              "top-2",
              isHovering && "opacity-100"
            )}
            elevation={2}
          >
            <IconButton
              aria-label="reply"
              size="small"
              onClick={() => setShowReplyInputField(true)}
            >
              <Reply />
            </IconButton>
            <IconButton aria-label="emoji" size="small">
              <AddReactionIcon />
            </IconButton>
            <IconButton aria-label="more" size="small">
              <MoreHorizIcon />
            </IconButton>
          </Paper>
        </div>
        <div>
          <div className="mt-2 pb-2">
            <Remark>{text}</Remark>
          </div>
          {showReplyInputField && (
            <TextField
              className="mt-2"
              id="reply-input"
              label={`Reply to ${author.name}`}
              fullWidth
              multiline
              maxRows={4}
              placeholder={`Reply to ${author.name}...`}
            />
          )}
          {replies && (
            <Transition
              show={
                isHovering // showReplies
              }
              enter="transition-all duration-150 ease-out"
              enterFrom="opacity-0 max-h-0"
              enterTo="opacity-100 max-h-96"
              leave="transition-all duration-150 ease-in"
              leaveFrom="opacity-100 max-h-96"
              leaveTo="opacity-0 max-h-0"
            >
              <ul className="pl-8">
                {replies.map((reply, index) => (
                  <ChatMessage key={index} {...reply} />
                ))}
              </ul>
            </Transition>
          )}
        </div>
      </div>
    </div>
  );
}
