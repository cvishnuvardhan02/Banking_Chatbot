
import { create } from 'zustand';
import { toast } from "sonner";
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer-in' | 'transfer-out';
  amount: number;
  description: string;
  date: string;
  fromAccount?: string;
  toAccount?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  password: string;
  transactions: Transaction[];
}

interface BankState {
  accounts: Record<string, Account>;
  currentAccount: string | null;
  isAuthenticated: boolean;
  
  // Auth methods
  login: (accountId: string, password: string) => boolean;
  logout: () => void;
  register: (accountId: string, name: string, password: string) => boolean;
  
  // Banking operations
  deposit: (amount: number) => boolean;
  withdraw: (amount: number) => boolean;
  transfer: (toAccountId: string, amount: number) => boolean;
  
  // Helper methods
  doesAccountExist: (accountId: string) => boolean;
  getCurrentAccount: () => Account | null;
  getAllAccounts: () => Record<string, Account>;
}

// Sample seed data
const sampleAccounts: Record<string, Account> = {
  "12345": {
    id: "12345",
    name: "John Doe",
    balance: 1000,
    password: "john123",
    transactions: [
      {
        id: "t1",
        type: "deposit",
        amount: 500,
        description: "Initial deposit",
        date: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
      },
      {
        id: "t2",
        type: "deposit",
        amount: 500,
        description: "Salary deposit",
        date: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
      }
    ]
  },
  "67890": {
    id: "67890",
    name: "Jane Smith",
    balance: 5000,
    password: "jane123",
    transactions: [
      {
        id: "t3",
        type: "deposit",
        amount: 5000,
        description: "Initial deposit",
        date: new Date(Date.now() - 86400000 * 7).toISOString() // 7 days ago
      }
    ]
  }
};

export const useBankStore = create<BankState>()(
  persist(
    (set, get) => ({
      accounts: { ...sampleAccounts },
      currentAccount: null,
      isAuthenticated: false,

      login: (accountId: string, password: string) => {
        const account = get().accounts[accountId];
        if (account && account.password === password) {
          set({ currentAccount: accountId, isAuthenticated: true });
          toast.success(`Welcome, ${account.name}!`);
          return true;
        }
        toast.error("Invalid account number or password");
        return false;
      },

      logout: () => {
        set({ currentAccount: null, isAuthenticated: false });
        toast.info("You have been logged out");
      },

      register: (accountId: string, name: string, password: string) => {
        if (get().accounts[accountId]) {
          toast.error("Account number already exists");
          return false;
        }

        const newAccount: Account = {
          id: accountId,
          name,
          balance: 0,
          password,
          transactions: []
        };

        set(state => ({
          accounts: { ...state.accounts, [accountId]: newAccount },
          currentAccount: accountId,
          isAuthenticated: true
        }));

        toast.success(`Account for ${name} created successfully!`);
        return true;
      },

      deposit: (amount: number) => {
        const { currentAccount, accounts } = get();
        
        if (!currentAccount || amount <= 0) {
          toast.error(amount <= 0 ? "Amount must be greater than zero" : "No account selected");
          return false;
        }

        const account = accounts[currentAccount];
        const transaction: Transaction = {
          id: `t${Date.now()}`,
          type: "deposit",
          amount,
          description: `Deposited $${amount}`,
          date: new Date().toISOString()
        };

        set(state => ({
          accounts: {
            ...state.accounts,
            [currentAccount]: {
              ...account,
              balance: account.balance + amount,
              transactions: [transaction, ...account.transactions]
            }
          }
        }));

        toast.success(`Successfully deposited $${amount}`);
        return true;
      },

      withdraw: (amount: number) => {
        const { currentAccount, accounts } = get();

        if (!currentAccount || amount <= 0) {
          toast.error(amount <= 0 ? "Amount must be greater than zero" : "No account selected");
          return false;
        }

        const account = accounts[currentAccount];
        if (account.balance < amount) {
          toast.error("Insufficient funds");
          return false;
        }

        const transaction: Transaction = {
          id: `t${Date.now()}`,
          type: "withdrawal",
          amount,
          description: `Withdrew $${amount}`,
          date: new Date().toISOString()
        };

        set(state => ({
          accounts: {
            ...state.accounts,
            [currentAccount]: {
              ...account,
              balance: account.balance - amount,
              transactions: [transaction, ...account.transactions]
            }
          }
        }));

        toast.success(`Successfully withdrew $${amount}`);
        return true;
      },

      transfer: (toAccountId: string, amount: number) => {
        const { currentAccount, accounts } = get();

        if (!currentAccount || amount <= 0) {
          toast.error(amount <= 0 ? "Amount must be greater than zero" : "No account selected");
          return false;
        }

        if (currentAccount === toAccountId) {
          toast.error("Cannot transfer to the same account");
          return false;
        }

        const fromAccount = accounts[currentAccount];
        const toAccount = accounts[toAccountId];

        if (!toAccount) {
          toast.error("Recipient account not found");
          return false;
        }

        if (fromAccount.balance < amount) {
          toast.error("Insufficient funds");
          return false;
        }

        const sendTransaction: Transaction = {
          id: `t${Date.now()}-send`,
          type: "transfer-out",
          amount,
          description: `Transferred $${amount} to ${toAccount.name} (${toAccountId})`,
          date: new Date().toISOString(),
          toAccount: toAccountId
        };

        const receiveTransaction: Transaction = {
          id: `t${Date.now()}-receive`,
          type: "transfer-in",
          amount,
          description: `Received $${amount} from ${fromAccount.name} (${currentAccount})`,
          date: new Date().toISOString(),
          fromAccount: currentAccount
        };

        set(state => ({
          accounts: {
            ...state.accounts,
            [currentAccount]: {
              ...fromAccount,
              balance: fromAccount.balance - amount,
              transactions: [sendTransaction, ...fromAccount.transactions]
            },
            [toAccountId]: {
              ...toAccount,
              balance: toAccount.balance + amount,
              transactions: [receiveTransaction, ...toAccount.transactions]
            }
          }
        }));

        toast.success(`Successfully transferred $${amount} to ${toAccount.name}`);
        return true;
      },

      doesAccountExist: (accountId: string) => {
        return !!get().accounts[accountId];
      },

      getCurrentAccount: () => {
        const { currentAccount, accounts } = get();
        return currentAccount ? accounts[currentAccount] : null;
      },

      getAllAccounts: () => {
        return get().accounts;
      }
    }),
    {
      name: 'banking-chatbot-storage',
    }
  )
);
