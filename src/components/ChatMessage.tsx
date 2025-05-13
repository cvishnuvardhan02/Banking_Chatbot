
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ChatMessageProps = {
  isBot: boolean;
  children: ReactNode;
};

export const ChatMessage = ({ isBot, children }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "chat-bubble",
        isBot ? "bot-message" : "user-message"
      )}
    >
      {children}
    </div>
  );
};
