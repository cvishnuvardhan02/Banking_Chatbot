
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChangeEvent, useState } from "react";

interface MoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const MoneyInput = ({
  value,
  onChange,
  placeholder = "0.00",
  className,
  error
}: MoneyInputProps) => {
  // Format as user types to ensure it's a valid money format
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    const regex = /^[0-9]*\.?[0-9]{0,2}$/;
    if (value === "" || regex.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-gray-500">$</span>
      </div>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("pl-7", className)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
