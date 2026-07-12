import Link from "next/link";
import { cookies } from "next/headers";

const CATEGORY_COLORS = {
  housing: "bg-red-400",
  food: "bg-orange-400",
  transport: "bg-blue-400",
  entertainment: "bg-purple-400",
  health: "bg-pink-400",
  salary: "bg-green-400",
  other: "bg-gray-400",
};

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${process.env.API_URL}/transactions`, { 
    cache: "no-store",
    headers: {
      Cookie: `token=${token}`
    }
  }); // no-store stops it from showing the same data between reloads
  
  const transactions = await res.json();

  const totalIncome = transactions.filter(transaction => transaction.type == "income").reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const totalExpenses = transactions.filter(transaction => transaction.type == "expense").reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const balance = totalIncome - totalExpenses;

  const categoryTotals = transactions.filter(transaction => transaction.type == "expense").reduce((sum, transaction) => {
    sum[transaction.category] = (sum[transaction.category] || 0) + Number(transaction.amount);
    return sum;
  }, {});

  const categories = Object.entries(categoryTotals).map(([name, amount]) => ({ // Object.entries converts object into array of key value pairs. builds new object for each pair
    name,
    amount,
    color: CATEGORY_COLORS[name] || "bg-gray-400",
  }));

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  const maxAmount = categories.length > 0 ? Math.max(...categories.map(c => c.amount)) : 1;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Overview</h1>

      <div className="bg-gray-100 rounded-xl p-6 text-center mb-4">
        <p className="text-sm text-gray-500 font-semibold mb-1">Running Balance</p>
        <p className={`text-4xl font-semibold ${balance >= 0 ? "text-green-600" : "text-red-600"} `}>${balance.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-semibold mb-1">Income</p>
          <p className="text-xl font-semibold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-semibold mb-1">Expenses</p>
          <p className="text-xl font-semibold text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>
        
      </div>

      <div className="bg-gray-100 rounded-xl p-4">
        <p className="text-xs text-gray-500 font-semibold mb-3">Spending by category</p>
        <div className="flex flex-col gap-2">
          {
            categories.map(category => (
              <div key={category.name} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-20">{category.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className={`${category.color} h-2 rounded-full`}
                    style={{ width: `${(category.amount / maxAmount) * 100}%` }}></div>
                </div>
                <span className="text-xs text-gray-600 w-16 text-right shrink-0">${category.amount.toFixed(2)}</span>
              </div>
            ))
          }
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-4 mt-4">
        <p className="text-xs text-gray-500 font-semibold mb-3">Recent Transactions</p>
        <Link href="/transactions" className="text-xs text-blue-500">See all</Link>
        <div className="flex flex-col text-gray-500">
          {
            recentTransactions.map((transaction, index) => (
              // flex, spaces description from amount, pads top and bottom, puts border line if it's not the last transaction on the list
              <div key={transaction.id} className={`flex justify-between items-center py-2 ${index !== recentTransactions.length - 1 ? "border-b border-gray-200" : ""}`}>
                <div>
                  <p className="text-sm">{transaction.title}</p>
                  <p className="text-xs text-gray-400">{transaction.category} | {new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>{transaction.type === "income" ? "+" : "-"}${Number(transaction.amount).toFixed(2)}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>


  );
}