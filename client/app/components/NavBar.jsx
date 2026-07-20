"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { useEffect, useState } from "react";

export default function NavBar() {
  const pathname = usePathname() || "";
  const [email, setEmail] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) setEmail(data.email);
      })
      .catch(() => {});
  }, []);

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <nav className="flex gap-4 items-center px-4 py-3 border-b border-gray-200 bg-white">
      <Link href="/dashboard" className="text-sm font-medium text-gray-700">Overview</Link>
      <Link href="/transactions" className="text-sm font-medium text-gray-700">Transactions</Link>
      <Link href="/form" className="text-sm font-medium text-gray-700">Add</Link>
      <div className="ml-auto flex items-center gap-4">
        {email && <span className="text-sm font-medium text-gray-700">{email}</span>}
        <LogoutButton />
      </div>
    </nav>
  );
}
