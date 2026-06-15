
const categories = [
  { name: "Housing", amount: 1200, color: "bg-red-400" },
  { name: "Food", amount: 460, color: "bg-orange-400" },
  { name: "Transport", amount: 200, color: "bg-blue-400" },
  { name: "Other", amount: 99.50, color: "bg-gray-400" },
];

const recentTransactions = [
  { id: 1, title: "rent", category: "Housing", amount: 1200, date: "2026-15-06", type: "expense" },
  { id: 2, title: "groceries", category: "Food", amount: 150, date: "2026-14-06", type: "expense" },
  { id: 3, title: "salary", category: "Income", amount: 5200, date: "2026-01-06", type: "income" },
];

export default function Dashboard() {
  const balance = 3240.50;
  const totalIncome = 5200.00;
  const totalExpenses = 1959.50;
  const maxAmount = Math.max(...categories.map(c => c.amount));

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Overview</h1>

      <div className="bg-gray-100 rounded-xl p-6 text-center mb-4">
        <p className="text-sm text-gray-500 font-semibold mb-1">Running Balance</p>
        <p className="text-4xl font-semibold text-green-600">${balance.toFixed(2)}</p>
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
        <div className="flex flex-col text-gray-500">
          {
            recentTransactions.map((transaction, index) => (
              // flex, spaces description from amount, pads top and bottom, puts border line if it's not the last transaction on the list
              <div key={transaction.id} className={`flex justify-between items-center py-2 ${index !== recentTransactions.length - 1 ? "border-b border-gray-200" : ""}`}>
                <div>
                  <p className="text-sm">{transaction.title}</p>
                  <p className="text-xs text-gray-400">{transaction.category} | {transaction.date}</p>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>{transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>


  );
}