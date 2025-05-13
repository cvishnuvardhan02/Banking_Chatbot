
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankingChatbot } from "@/components/BankingChatbot";
import { TransactionHistory } from "@/components/TransactionHistory";
import { AccountCard } from "@/components/AccountCard";
import { useBankStore } from "@/store/bankStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { DepositForm } from "@/components/DepositForm";
import { WithdrawForm } from "@/components/WithdrawForm";
import { TransferForm } from "@/components/TransferForm";

const Dashboard = () => {
  const { getCurrentAccount, logout } = useBankStore();
  const account = getCurrentAccount();

  if (!account) return null;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-bank-purple">Welcome, {account.name}</h1>
        <Button 
          onClick={logout} 
          variant="outline" 
          className="flex items-center gap-2 border-bank-purple text-bank-purple hover:bg-bank-purple hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AccountCard account={account} />
          <div className="mt-6 space-y-6">
            <DepositForm />
            <WithdrawForm />
            <TransferForm />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="h-[600px]">
              <BankingChatbot />
            </TabsContent>
            <TabsContent value="transactions">
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
