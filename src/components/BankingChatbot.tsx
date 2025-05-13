
import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankStore } from "@/store/bankStore";
import { formatCurrency } from "@/lib/formatters";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const BankingChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! Welcome to the Banking Chatbot. How can I help you today?", isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    getCurrentAccount, 
    deposit, 
    withdraw,
    transfer,
    doesAccountExist
  } = useBankStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessageId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMessageId, text, isBot: false }]);
    
    // Set typing indicator
    setIsTyping(true);
    
    // Process the message
    await sleep(1000); // Simulate processing time
    const response = await processMessage(text);
    
    // Remove typing indicator and add bot response
    setIsTyping(false);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: response, isBot: true }]);
  };

  const processMessage = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    const currentAccount = getCurrentAccount();

    if (!currentAccount) {
      return "Please log in first to access banking services.";
    }

    // Check balance
    if (lowerMessage.includes("balance") || lowerMessage.includes("how much") || lowerMessage.includes("check balance")) {
      return `Your current balance is ${formatCurrency(currentAccount.balance)}.`;
    }
    
    // Deposit money
    if (lowerMessage.includes("deposit")) {
      const amountMatch = message.match(/\$?(\d+(\.\d{1,2})?)/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1]);
        if (deposit(amount)) {
          return `Successfully deposited ${formatCurrency(amount)}. Your new balance is ${formatCurrency(getCurrentAccount()?.balance || 0)}.`;
        } else {
          return "I couldn't process your deposit. Please make sure the amount is valid.";
        }
      } else {
        return "How much would you like to deposit? Please specify an amount (e.g., deposit $100).";
      }
    }
    
    // Withdraw money
    if (lowerMessage.includes("withdraw") || lowerMessage.includes("take out")) {
      const amountMatch = message.match(/\$?(\d+(\.\d{1,2})?)/);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1]);
        if (withdraw(amount)) {
          return `Successfully withdrew ${formatCurrency(amount)}. Your new balance is ${formatCurrency(getCurrentAccount()?.balance || 0)}.`;
        } else {
          return "I couldn't process your withdrawal. Please make sure the amount is valid and you have sufficient funds.";
        }
      } else {
        return "How much would you like to withdraw? Please specify an amount (e.g., withdraw $50).";
      }
    }
    
    // Transfer money
    if (lowerMessage.includes("transfer") || lowerMessage.includes("send money")) {
      const amountMatch = message.match(/\$?(\d+(\.\d{1,2})?)/);
      const accountMatch = message.match(/(?:to|account|acc)\s+(\d+)/i);
      
      if (amountMatch && accountMatch) {
        const amount = parseFloat(amountMatch[1]);
        const toAccount = accountMatch[1];
        
        if (!doesAccountExist(toAccount)) {
          return `Account ${toAccount} does not exist. Please check the account number.`;
        }
        
        if (transfer(toAccount, amount)) {
          return `Successfully transferred ${formatCurrency(amount)} to account ${toAccount}. Your new balance is ${formatCurrency(getCurrentAccount()?.balance || 0)}.`;
        } else {
          return "I couldn't process your transfer. Please check that you have sufficient funds.";
        }
      } else if (amountMatch) {
        return "To which account would you like to transfer money? Please specify the account number (e.g., transfer $100 to account 67890).";
      } else if (accountMatch) {
        return "How much would you like to transfer? Please specify an amount (e.g., transfer $100 to account 67890).";
      } else {
        return "Please specify both an amount and an account number for the transfer (e.g., transfer $100 to account 67890).";
      }
    }
    
    // Help message
    if (lowerMessage.includes("help") || lowerMessage === "?") {
      return `
        I can help you with the following banking operations:
        
        • Check your balance ("What's my balance?")
        • Deposit money ("Deposit $100")
        • Withdraw money ("Withdraw $50")
        • Transfer money ("Transfer $75 to account 67890")
        • View your transaction history (use the Transactions tab)
        
        How can I assist you today?
      `;
    }

    // Default response
    return "I'm not sure how to help with that. You can ask me about your balance, make deposits or withdrawals, or transfer money to another account. Type 'help' for more information.";
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-bank-purple">Banking Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto chat-scrollbar">
        <div className="flex flex-col space-y-2">
          {messages.map((message) => (
            <ChatMessage key={message.id} isBot={message.isBot}>
              {message.text}
            </ChatMessage>
          ))}
          {isTyping && 
            <ChatMessage isBot={true}>
              <TypingIndicator />
            </ChatMessage>
          }
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isTyping || !getCurrentAccount()}
          placeholder={getCurrentAccount() ? "Type your message..." : "Please log in first..."}
        />
      </CardFooter>
    </Card>
  );
};
