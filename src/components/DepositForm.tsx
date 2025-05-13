
import { Button } from "@/components/ui/button";
import { useBankStore } from "@/store/bankStore";
import { FormEvent, useState } from "react";
import { MoneyInput } from "./MoneyInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DepositForm = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { deposit } = useBankStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    const success = deposit(parsedAmount);
    if (success) {
      setAmount("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-bank-purple">Deposit Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <MoneyInput 
            value={amount} 
            onChange={setAmount}
            error={error}
            placeholder="Enter amount to deposit"
          />
          <Button 
            type="submit" 
            className="w-full bg-bank-purple hover:bg-bank-light-purple"
          >
            Deposit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
