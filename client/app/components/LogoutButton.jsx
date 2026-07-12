"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        router.push("/login");
    }

    return (
        <button
            onClick={handleLogout} className="text-sm font-medium text-gray-500 cursor-pointer">
            Sign out
        </button>
    );
}