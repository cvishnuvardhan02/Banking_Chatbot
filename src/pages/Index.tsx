
import { useBankStore } from "@/store/bankStore";
import { Auth } from "@/components/Auth";
import Dashboard from "./Dashboard";
import { useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const { isAuthenticated } = useBankStore();

  // Welcome toast
  useEffect(() => {
    toast("Welcome to Banking Chatbot!", {
      description: "A secure and easy way to manage your finances",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-bank-purple text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Banking Chatbot</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 flex justify-center">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome to Banking Chatbot</h2>
              <p className="text-gray-600">
                Log in to manage your account or create a new one to get started
              </p>
            </div>
            <Auth />
          </div>
        )}
      </main>

      <footer className="bg-gray-100 p-4 border-t">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Banking Chatbot - Demo Application</p>
          <p className="mt-1">
            <span className="font-medium">Sample accounts:</span> 12345 / john123, 67890 / jane123
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
