'use client'

import Link from 'next/link';
import './globals.css'

const Header = () => {
    return (
        <div className="fixed top-0 w-full h-16 bg-opacity-50 bg-blur-md bg-black backdrop-blur-md backdrop-opacity-70 flex justify-between items-center p-4">
            <h1 className="text-white text-2xl font-bold">Your Web App Name</h1>
            <div className="flex space-x-4">
                <Link href="/project/create" className="text-white">create new project</Link>
        {localStorage.getItem("token") === null ? (
            <div className="flex space-x-4">
                <Link href="/auth/login" className="text-white">Login</Link>
                <Link href="/auth/reg" className="text-white">Register</Link>
            </div>
        ) : (
            <div className="flex space-x-4">
            <button onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.reload();
            }}>Logout</button>
            </div>
        )
        }
                <Link href="/discover" className="text-white">Discover</Link>
            </div>
        </div>
    );
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <Header />
            <body>{children}</body>
        </html>
    )
}
