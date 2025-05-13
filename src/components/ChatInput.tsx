
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const ChatInput = ({ onSendMessage, disabled, placeholder = "Type your message..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={disabled || !message.trim()}
        className="bg-bank-purple hover:bg-bank-light-purple"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
