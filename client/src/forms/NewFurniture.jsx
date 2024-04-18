import React, { useState, useEffect } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase.ts';
import { notify } from '../utils/toast';
import { Furniture } from '../types/furniture.js';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { resizeImageWithAspectRatio } from '../utils/imageResizer.jsx';


const NewFurnitureForm = () => {
    const [newFurniture, setNewFurniture] = useState(Furniture);
    const [imageFile, setImageFile] = useState(null);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    // Create a new furniture item
    const handleCreate = async () => {
        try {
            // Add the image to the new furniture item and pass a URL to the image
            const imageURL = await uploadImage();
            const furnitureWithImage = { ...newFurniture, image: imageURL };

            await addDoc(collection(db, 'furniture'), furnitureWithImage);
            console.log('New furniture item created successfully');
            notify('Furniture item created successfully', 'success');
            // Optionally, clear the input fields
            setNewFurniture(Furniture);
            navigate('/dashboard');

        } catch (error) {
            if (error.message === 'Image already exists') {
                notify('Image already exists', 'error');
            } else {
                console.error('Error creating new furniture item:', error);
                notify('Error creating furniture item', 'error');
            }
        }
    };

    // Update new furniture state when input changes
    const uploadImage = async () => {
        try {
            const storage = getStorage();

            // check if the image already exists
            const items = await listAll(ref(storage, 'images'));
            const fileExists = items.items.some(item => item.name === imageFile.name);
            if (fileExists) {
                const confirmDelete = window.confirm('The fileName already exists. Do you want to overwrite it?');
                if (!confirmDelete) {
                    throw new Error('Image already exists');
                }
            }

            // Resize the image
            const resizedImage = await resizeImageWithAspectRatio(imageFile, 300, 300);

            // Upload the image to Firebase Storage
            const storageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(storageRef, resizedImage);
            const imageUrl = await getDownloadURL(storageRef);
            console.log('Image download URL:', imageUrl);
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            notify('Error uploading image', 'error');
            throw error;
        }
    };

    // Update new furniture state when input changes
    const handleInputChange = (key, value) => {
        setNewFurniture(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };


    return (
        <div className="max-w-4xl text-white mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">New Furniture Form</h1>
            <div className="flex flex-row flex-wrap gap-x-10 bg-gray-800 rounded-md p-4 mb-4">
                {/* Dynamically create input fields based on Furniture object */}
                {Object.keys(Furniture).map((key, index) => (
                    <div key={index} className="mb-4 min-w-40 flex flex-col">
                        <label className="text-white mb-2">{key}</label>
                        {key === 'image' ? (
                            <input
                                type="file"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="bg-gray-700 rounded-md p-2 text-white"
                            />
                        ) : (
                            <input
                                type="text"
                                value={newFurniture[key] || ''}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                className="bg-gray-700 rounded-md p-2 text-white"
                            />
                        )}
                    </div>
                ))}
                <div className='w-full'>
                    <button onClick={handleCreate} className="bg-green-500 text-white px-8 py-4 rounded-md mr-5">Create</button>
                </div>
            </div>
        </div>
    );
};

export default NewFurnitureForm;
