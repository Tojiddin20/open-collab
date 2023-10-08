'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from your API
    fetch('http://localhost:5005/projects', {
        method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => toast.error('Error fetching projects:', error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-blue-800">All Projects</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
            <Link href={`${project.id}`}>
            <div key={project.id} className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">{project.name}</h2>
            <div className="flex items-center mb-4">
            <img src={`http://localhost:5005/${project.imagePath}`} alt="Project Image" className="h-12 w-12 rounded-md mr-4" />
            <p className="text-gray-700 text-sm">{project.description}</p>
            </div>
            </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
