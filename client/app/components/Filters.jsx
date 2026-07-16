"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATEGORIES = ["Housing", "Food", "Transport", "Entertainment", "Health", "Salary", "Other"];

export default function Filters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [from, setFrom] = useState(searchParams.get("from") || "");
    const [to, setTo] = useState(searchParams.get("to") || "");

    function applyFilters() {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        router.push(`/transactions?${params.toString()}`);
    }

    function clearFilters() {
        setCategory("");
        setFrom("");
        setTo("");
        router.push("/transactions");
    }

    return (
        <div className="bg-gray-100 rounded-xl p-4 mb-4 flex flex-col gap-3">
            <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <div key={cat} onClick={() => setCategory(cat === category ? "" : cat)} className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${category === cat ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-600"}`}>{cat}</div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1">From</p>
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1">To</p>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
                </div>
            </div>

            <div className="flex gap-2">
                <button onClick={applyFilters} className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm font-medium cursor-pointer">Apply</button>
                <button onClick={clearFilters} className="flex-1 bg-white border border-gray-200 text-gray-600 rounded-lg py-2 text-sm font-medium cursor-pointer">Clear</button>
            </div>
        </div>
    );
}