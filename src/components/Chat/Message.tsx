import React from "react";
import { Text, Avatar, clsx } from "@mantine/core";
import { IconButton, Paper, TextField, Typography } from "@mui/material";
import Reply from "@mui/icons-material/Reply";
import { Transition } from "@headlessui/react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import { Remark } from "react-remark";
import { faker } from "@faker-js/faker";
import { useSession } from "next-auth/react";
import { type Message, type User } from "@prisma/client";

const DEFAULT_REPLIES_TO_SHOW = 1;

export default function ChatMessage(props: {
  message: Message & { replies?: Message[]; user?: User };
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const { data: session } = useSession({
    required: false,
    onUnauthenticated: () => {
      console.log(`You're not logged in!`);
    },
  });

  const { text, messageId, roomId } = props.message;

  const [isHovering, setIsHovering] = React.useState(false);
  const [showReplyInputField, setShowReplyInputField] = React.useState(false);

  const [reply, setReply] = React.useState("");

  const handleReplySubmit = () => {
    const messagesUpdate = props.messages.map((message) => {
      if (message.messageId === messageId) {
        return {
          ...message,
          replies: [
            ...(props.message.replies || []),
            {
              messageId: faker.datatype.uuid(),
              roomId: roomId,
              text: reply,
              user: {
                username:
                  session?.user?.name || session?.user?.email || "Anonymous",
                name:
                  session?.user?.name || session?.user?.email || "Anonymous",
                image: session?.user?.image || "",
              },
              postedAt: new Date(Date.now()).toLocaleDateString(),
              replies: [] as Message[],
            },
          ],
        };
      }
      return message;
    });

    props.setMessages(messagesUpdate);

    setShowReplyInputField(false);
    setReply("");
  };

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
          src={props.message.user?.image}
          alt={
            props.message.user?.name ||
            props.message.user?.username ||
            props.message.user?.id
          }
          className="mr-2"
          radius="xl"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            <Text size="sm" className="px-1">
              {props.message.user?.username || props.message.user?.name}
            </Text>
            <Text size="xs" color="dimmed">
              {props.message.updatedAt &&
              props.message.updatedAt.toString() !==
                props.message.createdAt.toString()
                ? `updated: ${props.message.updatedAt?.toString()}`
                : props.message.createdAt.toString()}
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
              label={`Reply to ${props.message.user?.name || "UNKNOWN"}`}
              fullWidth
              multiline
              maxRows={4}
              placeholder={`Reply to ${
                props.message.user?.name || "UNKNOWN"
              }...`}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleReplySubmit();
                }
              }}
            />
          )}
          {(props.message.replies?.length && (
            <ul className="pl-8">
              {props.message.replies
                .slice(0, DEFAULT_REPLIES_TO_SHOW)
                .map((reply, index) => (
                  <ChatMessage
                    key={index}
                    message={reply}
                    messages={props.messages}
                    setMessages={props.setMessages}
                  />
                ))}
            </ul>
          )) ||
            null}
          {(props.message.replies?.length || 0) > DEFAULT_REPLIES_TO_SHOW && (
            <>
              {!isHovering && (
                <Typography className="absolute right-10 items-center justify-center">{`${
                  (props.message.replies?.length || 0) - DEFAULT_REPLIES_TO_SHOW
                } more replies...`}</Typography>
              )}
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
                  {(props.message.replies || [])
                    .slice(DEFAULT_REPLIES_TO_SHOW)
                    .map((reply, index) => (
                      <ChatMessage
                        key={index}
                        message={reply}
                        messages={props.messages}
                        setMessages={props.setMessages}
                      />
                    ))}
                </ul>
              </Transition>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
