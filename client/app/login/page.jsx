"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit() {
        setError("");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            credentials: 'include',
            body: JSON.stringify({ email, password})
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            return;
        }

        router.refresh();
        router.push("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-sm">
                <h1 className="text-black text-xl font-semibold mb-6">Sign in</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">{error}</div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="your@example.com" className="w-full bg-gray-100 rounded-xl p-3 text-sm focus:outline-none"></input>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Password</label>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-100 rounded-xl p-3 text-sm focus:outline-none"></input>
                    </div>

                    <button type="submit" className="w-full bg-gray-900 text-white rounded-xl py-3 font-medium text-sm cursor-pointer mt-2">Sign in</button>
                    <p className="text-xs text-center text-gray-500">Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
                </form>
            </div>
        </div>
    );
}