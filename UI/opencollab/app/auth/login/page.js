'use client'

import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation'

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here

        console.log('Form submitted:', { email, password });

        // send api request
        fetch('http://localhost:5005/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        }).then((result) => {
            console.log(result);
            if (result.status === 200) {
                toast.success('Login successful!');

                router.push('/');
                window.location.href = "/"

                // get the returning int from the request
                result.json().then((data) => {
                    console.log(data);
                    localStorage.setItem("token", data);
                    localStorage.setItem("user", JSON.stringify(data.user));
                });
                window.location.reload();
                router.push('/');
            } else {
                toast.error('Login failed!');
            }
        }, (error) => {
            console.log(error);
            toast.error('Login failed!');
        });
    };

    return (
        <div className="max-w-md m-32 mx-auto p-6 bg-white rounded-md shadow-lg">
            <Toaster />
            <h2 className="text-2xl mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
