
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBankStore } from "@/store/bankStore";
import { FormEvent, useState } from "react";

interface LoginFormProps {
  onToggleForm: () => void;
}

export const LoginForm = ({ onToggleForm }: LoginFormProps) => {
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useBankStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!accountId.trim()) {
      setError("Account ID is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    const success = login(accountId, password);
    if (!success) {
      setError("Invalid account ID or password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountId">Account ID</Label>
        <Input
          id="accountId"
          placeholder="Enter your account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full bg-bank-purple hover:bg-bank-light-purple">
        Log In
      </Button>
      <p className="text-center text-sm">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-bank-purple hover:underline"
        >
          Register now
        </button>
      </p>
    </form>
  );
};
