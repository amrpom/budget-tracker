import DeleteButton from "../components/DeleteButton";
import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Filters from "../components/Filters";

export default async function Transactions({ searchParams }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const { category, to, from } = await searchParams;
    const query = new URLSearchParams();

    if (category) query.set("category", category);
    if (from) query.set("from", from);
    if (to) query.set("to", to);

    const res = await fetch(`${process.env.API_URL}/transactions?${query.toString()}`, { 
    cache: "no-store",
    headers: {
        Cookie: `token=${token}`
    }
    });
    const transactions = await res.json();

    return(
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Transactions</h1>

            {// Suspense cuz useSearchParams grabs url, which is not available during build time which is where useSearchParams lives 
            }
            <Suspense fallback={<div>Loading Filters...</div>}>
                <Filters />
            </Suspense>


            <div className="bg-gray-100 rounded-xl p-4 text-black">
                {transactions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No transactions found.</p>
                ) : (
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
                )}
                
            </div>
        </div>
    );
}