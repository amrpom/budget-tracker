"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({id}) {
    const router = useRouter();

    async function handleDelete() {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${id}`, { 
            method: "DELETE",
            credentials: 'include'
        });
        router.refresh(); // makes server component refresh so deleted transactions disappear
    }

    return(
        <button onClick={handleDelete} className="text-red-500 text-xs cursor-pointer">Delete</button>
    );
}