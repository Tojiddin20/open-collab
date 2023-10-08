'use client'

import React, { useEffect } from 'react';

const FlashCard = ({ project }) => {
    const { image, projectName, creatorName, description } = project;

    return (
        <div className="bg-white shadow-lg rounded-lg">
            <img className="w-48 object-cover" src={image} alt="Project Banner" />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{projectName}</div>
                <p className="text-gray-700 text-base">{description}</p>
            </div>
            <div className="px-6 py-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                    {creatorName}
                </span>
            </div>
        </div>
    );
};

const FlashCardContainer = () => {
    const projects = [
        {
            image: 'example.png',
            projectName: 'Project 1',
            creatorName: 'John Doe',
            description: "When you look up into the night sky, do you wonder what's out there beyond our solar system? So do we! Come join us in learning more about exoplanets, the worlds that orbit distant stars.",
        },
        // Add more projects as needed
    ];

    return (
        <div className="flex flex-wrap justify-center m-12">
            {projects.map((project, index) => (
                <FlashCard key={index} project={project} />
            ))}
        </div>
    );
};

export default FlashCardContainer;

