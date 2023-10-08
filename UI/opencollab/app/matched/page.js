'use client'

import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

const MatchedProjectsPage = () => {
    const [matchedProjects, setMatchedProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function getMatchedAsync() {
        let res = await fetch('http://localhost:5005/matched', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: JSON.parse(parseInt(localStorage.getItem('token'))),
            }),
        });

        if (res.status === 200) {
            let json = await res.json();
            console.log(json);
            setMatchedProjects(json);
            setIsLoading(false);
        }
        else {
            toast.error("Failed to fetch matched projects");
            toast.error(res.status);
        }
    }

    useEffect(() => {
        // Fetch matched projects from your API
        console.log('Fetching matched projects...');
        getMatchedAsync();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 mt-20">
            <Toaster />

            <h1 className="text-3xl font-bold mb-8">Matched Projects</h1>

            {isLoading ? (
                <div className="animate-pulse flex flex-col items-center justify-center min-h-screen bg-gray-100">
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {matchedProjects.map((project) => (
                        <div key={project.id} className="bg-white rounded-lg p-6 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">{project.name}</h2>
                            <img
                                src={`http://localhost:5005/${project.imagePath}`}
                                alt="Project Image"
                                className="inline-block h-[2.375rem] w-[2.375rem] rounded-md ring-2 ring-white dark:ring-gray-800"
                            />
                            <p>{project.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchedProjectsPage;
