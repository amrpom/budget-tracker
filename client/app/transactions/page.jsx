import DeleteButton from "../components/DeleteButton";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function Transactions() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.API_URL}/transactions`, { 
    cache: "no-store",
    headers: {
        Cookie: `token=${token}`
    }
    });
    const transactions = await res.json();

    return(
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Transactions</h1>
            <div className="bg-gray-100 rounded-xl p-4 text-black">
                <div className="flex flex-col">
                    {transactions.map((transaction, index) => (
                        <div key={transaction.id} className={`flex justify-between items-center py-2 ${index !== transactions.length - 1 ? "border-b border-gray-200" : ""}`}>
                            <div>
                                <p className="text-sm font-medium">{transaction.title}</p>
                                <p className="text-xs text-gray-500">{transaction.category} | {transaction.date.split("T")[0]}</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <p className={`text-sm font-semibold ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>{transaction.type === "income" ? "+" : "-"}${Number(transaction.amount).toFixed(2)}</p>
                                <div className="flex gap-2">
                                    <Link href={`/form?id=${transaction.id}`} className="text-xs text-blue-500">Edit</Link>
                                    <DeleteButton id={transaction.id}/>
                                </div>
                            </div>
                        </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}