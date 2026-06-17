"use client";

import { useState, useEffect } from "react"; 
import { useSearchParams } from "next/navigation";

const CATEGORIES = ["Housing", "Food", "Transport", "Entertainment", "Health", "Salary", "Other"];

export default function Form() {
    const [type, setType] = useState("expense");
    const [amount, setAmount] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const searchParams = useSearchParams();
    const editId = searchParams.get("id");

    useEffect(() => {
        if (!editId) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${editId}`)
            .then(res => res.json())
            .then(data => {
                setTitle(data.title);
                setAmount(data.amount);
                setType(data.type);
                setCategory(data.category);
                setDate(data.date.split("T")[0]); // to handle postgres result being a different format 
            })
    }, [editId]);

    async function handleSubmit() {
        const url = editId ?
            `${process.env.NEXT_PUBLIC_API_URL}/transactions/${editId}` :
            `${process.env.NEXT_PUBLIC_API_URL}/transactions`;

        const method = editId ? "PUT" : "POST";

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title, amount, type, category, date, created_at: new Date().toISOString()
            })
        });
    }   

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">{editId ? "Edit Transaction" : "New Transaction"}</h1>

            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                <div onClick={() => setType("expense")} className={`flex-1 text-center py-2 rounded-lg text-sm font-medium cursor-pointer ${type === "expense" ? "bg-orange-100 text-orange-700" : "text-gray-500"}`}>
                    Expense
                </div>
                <div onClick={() => setType("income")} className={`flex-1 text-center py-2 rounded-lg text-sm font-medium cursor-pointer ${type === "income" ? "bg-green-100 text-green-700" : "text-gray-500"}`}>
                    Income
                </div>
            </div>

            <div className="mt-4">
                <label className="text-xs font-medium text-gray-500 block mb-1">Amount</label>
                <div className="relative">
                    {/* top-1/2 shifts top of span to 1/2 div height, then -translate-y-1/2 shifts it up 1/2 of the span's height so it sits in center*/}
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-400">$</span>
                    <input className="w-full bg-gray-700 rounded-xl pl-8 pr-3 py-3 text-xl font-semibold focus:outline-none" type="number" value={amount} placeholder="0.00" onChange={(e) => setAmount(e.target.value)}></input>
                </div>
            </div>

            <div className="mt-4">
                <label className="text-xs font-medium text-gray-500 block mb-1">Title</label>
                <input className="w-full bg-gray-700 rounded-xl p-3 text-xl font-semibold focus:outline-none" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ex. groceries"></input>
            </div>

            <div className="mt-4">
                <label className="text-xs font-medium text-gray-500 block mb-1">Category</label>
                <div className="grid grid-cols-7 gap-2">
                    {CATEGORIES.map(cat => (
                        <div key={cat} onClick={() => setCategory(cat)} className={`text-center py-2 px-1 rounded-lg text-xs cursor-pointer border
                        ${cat === category ? "bg-blue-100 border-blue-100 text-blue-700" : "bg-gray-100 border-gray-100 text-gray-700"}`}>
                            {cat}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <label className="text-xs font-medium text-gray-500 block mb-1">Date</label>
                <div className="grid grid-cols-7 gap-2">
                    <input className="w-full bg-gray-700 rounded-xl p-3 text-xl font-semibold focus:outline-none" type="date" value={date} onChange={(e) => setDate(e.target.value)}></input>
                </div>
            </div>

            <button onClick={handleSubmit} className="w-full bg-gray-900 text-white rounded-xl py-3 mt-6 font-medium text-sm cursor-pointer">{editId ? "Update" : "Save"}</button>
        </div>
    );
}

