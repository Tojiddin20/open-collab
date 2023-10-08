'use client'

import React, { useState } from 'react';
import { useRouter } from "next/navigation"
import Select from 'react-select';
import { Toaster, toast } from 'sonner';

const tagOptions = [
    { value: 'tag1', label: 'Tag 1' },
    { value: 'tag2', label: 'Tag 2' },
    { value: 'tag3', label: 'Tag 3' },
];

const NewProjectForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [tags, setTags] = useState([]);
    const router = useRouter();

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleTagsChange = (selectedTags) => {
        setTags(selectedTags);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('tags', JSON.stringify(tags));
        formData.append('userId', JSON.stringify(parseInt(localStorage.getItem('token'))));

        // send api request
        toast.loading('Creating new project...');

        let result = await fetch('http://localhost:5005/project/create', {
            method: 'POST',
            body: formData
        });

        if (result.status === 200) {
            let json = await result.json();
            console.log(json);
            toast.success('Project created successfully!');

            router.push(json.id);
        } else {
            toast.error('Failed to create project.');
        }
    };

    return (
        <div className="max-w-md mt-32 mx-auto p-6 bg-white rounded-md shadow-lg">
            <Toaster />
            <h2 className="text-2xl mb-4 text-center">Create a New Project</h2>
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
                    <label htmlFor="description" className="block mb-1">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="image" className="block mb-1">Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="border border-gray-300 rounded px-3 py-2"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 rounded-lg max-w-full"
                            style={{ maxHeight: '200px' }}
                        />
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="tags" className="block mb-1">Tags:</label>
                    <Select
                        isMulti
                        options={tagOptions}
                        value={tags}
                        onChange={handleTagsChange}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default NewProjectForm;
