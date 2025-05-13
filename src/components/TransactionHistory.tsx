
import { useBankStore, Transaction as TransactionType } from "@/store/bankStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface TransactionProps {
  transaction: TransactionType;
}

const Transaction = ({ transaction }: TransactionProps) => {
  const { type, amount, description, date } = transaction;

  const getIcon = () => {
    switch (type) {
      case "deposit":
      case "transfer-in":
        return <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />;
      case "withdrawal":
      case "transfer-out":
        return <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />;
      default:
        return null;
    }
  };

  const getAmountColor = () => {
    switch (type) {
      case "deposit":
      case "transfer-in":
        return "text-green-500";
      case "withdrawal":
      case "transfer-out":
        return "text-red-500";
      default:
        return "";
    }
  };

  const getAmountPrefix = () => {
    switch (type) {
      case "deposit":
      case "transfer-in":
        return "+ ";
      case "withdrawal":
      case "transfer-out":
        return "- ";
      default:
        return "";
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          {getIcon()}
          <span>
            {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
          </span>
        </div>
      </TableCell>
      <TableCell className={getAmountColor()}>
        {getAmountPrefix()}
        {formatCurrency(amount)}
      </TableCell>
      <TableCell className="hidden md:table-cell">{description}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(date)}
      </TableCell>
    </TableRow>
  );
};

export const TransactionHistory = () => {
  const { getCurrentAccount } = useBankStore();
  const account = getCurrentAccount();
  const transactions = account?.transactions || [];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-bank-purple">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <Transaction
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};
