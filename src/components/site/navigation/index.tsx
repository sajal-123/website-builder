import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/global/mode-toggle";
type NavigationProps = {
    user: User | null;
};

function Navigation({ user }: NavigationProps) {
    console.log("Navigation user", user);
    return (
        <nav
            className="flex items-center  justify-between px-6 py-4 w-full shadow-sm bg-white dark:bg-black sticky top-0 z-50"
            role="navigation"
            aria-label="Main Navigation"
        >
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
                <Image
                    src={
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=3&w=200&h=200&q=80"
                    }
                    alt="Logo or Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <span className="text-lg font-bold text-gray-800 dark:text-white">Plura One</span>
            </div>

            {/* Center: Nav Links */}
            <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-700 dark:text-gray-300">
                <li><Link href="/pricing" className="hover:text-blue-600">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
                <li><Link href="/docs" className="hover:text-blue-600">Documentation</Link></li>
                <li><Link href="/features" className="hover:text-blue-600">Features</Link></li>
            </ul>

            {/* Right: Theme Toggle + Login/User */}
            <div className="flex items-center gap-4">
                {user ? (
                    <UserButton afterSignOutUrl="/" />
                ) : (
                    <SignInButton>
                        <Button variant="outline">Login</Button>
                    </SignInButton>
                )}
                <ModeToggle />
            </div>
        </nav>
    );
}

export default Navigation;
