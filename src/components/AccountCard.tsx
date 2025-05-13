
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/store/bankStore";
import { formatCurrency } from "@/lib/formatters";

interface AccountCardProps {
  account: Account;
}

export const AccountCard = ({ account }: AccountCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Account Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{account.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account ID:</span>
            <span className="font-medium">{account.id}</span>
          </div>
          <div className="flex justify-between items-end mt-4">
            <span className="text-muted-foreground">Balance:</span>
            <span className="text-2xl font-bold text-bank-purple">
              {formatCurrency(account.balance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
