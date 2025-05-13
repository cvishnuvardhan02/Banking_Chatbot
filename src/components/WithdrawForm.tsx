
import { Button } from "@/components/ui/button";
import { useBankStore } from "@/store/bankStore";
import { FormEvent, useState } from "react";
import { MoneyInput } from "./MoneyInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const WithdrawForm = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { withdraw, getCurrentAccount } = useBankStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);
    const currentBalance = getCurrentAccount()?.balance || 0;

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    if (parsedAmount > currentBalance) {
      setError("Insufficient funds for this withdrawal.");
      return;
    }

    const success = withdraw(parsedAmount);
    if (success) {
      setAmount("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-bank-purple">Withdraw Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <MoneyInput 
            value={amount} 
            onChange={setAmount}
            error={error}
            placeholder="Enter amount to withdraw"
          />
          <Button 
            type="submit" 
            className="w-full bg-bank-purple hover:bg-bank-light-purple"
          >
            Withdraw
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
