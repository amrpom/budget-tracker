"use client";

import { useSearchParams } from "next/navigation";

export default function ExportButton() {
    const searchParams = useSearchParams();

    function handleExport() {
        const params = new URLSearchParams();
        const category = searchParams.get("category");
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        if (category) params.set("category", category);
        if (from) params.set("from", from);
        if (to) params.set("to", to);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/transactions/export?${params.toString()}`;
        window.open(url, '_blank');
    }

    return (
        <button onClick={handleExport} className="text-sm font-medium teext-gray-700 bg-gray-100 rounded-lg px-3 py-1.5 cursor-pointer">Export CSV</button>
    );
}