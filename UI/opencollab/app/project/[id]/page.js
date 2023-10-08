'use client'
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-1/2 h-12 bg-gray-300 rounded mb-4"></div>
      <div className="w-3/4 h-32 bg-gray-300 rounded mb-4"></div>
      <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
    </div>
  );
};

const ProjectDetails = ({ params }) => {
  const id = parseInt(params.id);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch project data based on projectId from your API
      fetch(`http://localhost:5005/projects/${id}`)
        .then((response) => response.json())
        .then((data) => setProject(data))
        .catch((error) => toast.error(error));
    }
  }, [id]);

  if (!project) {
    return <LoadingSkeleton />
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <Toaster />
      <div className="max-w-5xl bg-white p-8 rounded-lg shadow-lg flex">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
          <img src={`http://localhost:5005/${project.imagePath}`} alt="Project Image" className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="w-1/2 p-6">
          <h2 className="text-xl font-bold mb-4">Project Description</h2>
          <p className="text-gray-800 text-lg">{project.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
