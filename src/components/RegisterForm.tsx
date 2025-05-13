
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBankStore } from "@/store/bankStore";
import { FormEvent, useState } from "react";

interface RegisterFormProps {
  onToggleForm: () => void;
}

export const RegisterForm = ({ onToggleForm }: RegisterFormProps) => {
  const [accountId, setAccountId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, doesAccountExist } = useBankStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!accountId.trim()) {
      setError("Account ID is required");
      return;
    }

    if (doesAccountExist(accountId)) {
      setError("This account ID already exists");
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    const success = register(accountId, name, password);
    if (!success) {
      setError("Failed to create account");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountId">Account ID</Label>
        <Input
          id="accountId"
          placeholder="Choose an account ID (e.g., 12345)"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full bg-bank-purple hover:bg-bank-light-purple">
        Register
      </Button>
      <p className="text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-bank-purple hover:underline"
        >
          Log in
        </button>
      </p>
    </form>
  );
};
