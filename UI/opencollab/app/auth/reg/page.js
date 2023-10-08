'use client'
'use client'

import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const router = useRouter();

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleAvatarChange = (event) => {
        setAvatar(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('avatar', avatar);

        // send api request
        fetch('http://localhost:5005/auth/register', {
            method: 'POST',
            body: formData
        }).then((result) => {
            console.log(result);
            if (result.status === 200) {
                toast('Registered successfully!');

                // go to main page
                router.push('/')
            }
        }, (error) => {
            console.log(error);
            toast.error('Registration failed!');
        });
    };

    return (
        <div className="max-w-md m-32 mx-auto p-6 bg-white rounded-md shadow-lg">
        <Toaster richColors={true} />
            <h2 className="text-2xl mb-4 text-center">Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
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
                <div className="mb-4">
                    <label htmlFor="avatar" className="block mb-1">Avatar:</label>
                    <input
                        type="file"
                        id="avatar"
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
