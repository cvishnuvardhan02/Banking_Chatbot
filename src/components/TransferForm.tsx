
import { Button } from "@/components/ui/button";
import { useBankStore } from "@/store/bankStore";
import { FormEvent, useState } from "react";
import { MoneyInput } from "./MoneyInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TransferForm = () => {
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [error, setError] = useState("");
  const { transfer, getCurrentAccount, doesAccountExist } = useBankStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);
    const currentAccount = getCurrentAccount();
    const currentBalance = currentAccount?.balance || 0;
    const currentAccountId = currentAccount?.id;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    if (parsedAmount > currentBalance) {
      setError("Insufficient funds for this transfer.");
      return;
    }

    if (!recipientId.trim()) {
      setError("Please enter a recipient account ID.");
      return;
    }

    if (!doesAccountExist(recipientId)) {
      setError("Recipient account does not exist.");
      return;
    }

    if (recipientId === currentAccountId) {
      setError("Cannot transfer to your own account.");
      return;
    }

    const success = transfer(recipientId, parsedAmount);
    if (success) {
      setAmount("");
      setRecipientId("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-bank-purple">Transfer Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Account ID</Label>
            <Input
              id="recipient"
              placeholder="Enter recipient account ID"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <MoneyInput 
              value={amount} 
              onChange={setAmount}
              placeholder="Enter amount to transfer"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button 
            type="submit" 
            className="w-full bg-bank-purple hover:bg-bank-light-purple"
          >
            Transfer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
