import ChatBox from "../../components/Chat/ChatBox";
import GameRoomLayout from "../../components/Layout/GameRoomLayout";

export default function ChatPage() {
  return (
    <GameRoomLayout>
      <ChatBox roomId="test" />
    </GameRoomLayout>
  );
}
