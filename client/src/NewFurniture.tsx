import React, { useState, useEffect } from 'react';
import { addDoc, doc, setDoc, collection } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from './firebase';
// @ts-ignore
import { notify } from './utils/toast';
import { Furniture, initialFurniture } from './types/furniture';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
// @ts-ignore
import { resizeImageWithAspectRatio } from './utils/imageResizer';
import "../app/style.css"


const NewFurnitureForm = () => {
    const [newFurniture, setNewFurniture] = useState<Furniture>(initialFurniture);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    // Create a new furniture item
    const handleCreate = async () => {
        try {
            // Add the image to the new furniture item and pass a URL to the image
            const imageURL = await uploadImage();
            const furnitureWithImage = { ...newFurniture, image: imageURL };

            const ordersRef = doc(collection(db, "furniture"));
            furnitureWithImage.id = ordersRef.id;
            await setDoc(ordersRef, furnitureWithImage);

            // Notify that data was correctly uploaded and clean up the form
            console.log('New furniture item created successfully');
            notify('Furniture item created successfully', 'success');
            setNewFurniture({} as Furniture);
            navigate('/dashboard');

        } catch (error) {
            if ((error as Error).message === 'Image already exists') {
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
            const fileExists = items.items.some(item => item.name === imageFile!.name);
            if (fileExists) {
                const confirmDelete = window.confirm('The fileName already exists. Do you want to overwrite it?');
                if (!confirmDelete) {
                    throw new Error('Image already exists');
                }
            }

            // Resize the image
            const resizedImage = await resizeImageWithAspectRatio(imageFile!, 300, 300);

            // Upload the image to Firebase Storage
            const storageRef = ref(storage, `images/${imageFile!.name}`);
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

    // Update edited furniture state when input changes
    const handleInputChange = (key: keyof Furniture, value: string) => {
        console.log(key, value);
        setNewFurniture(prevState => ({
            ...prevState,
            [key]: value,
        } as Furniture)); // Explicitly specify prevState type as Furniture
    };


    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-3xl text-white font-bold mb-4">New Furniture Form</h1>
            <div className="flex flex-col gap-3">

                {/* Dynamically create input fields based on Furniture object */}
                {Object.keys(newFurniture)
                    .filter(key => key !== 'id')
                    .map((key, index) => (

                    <div key={index} className="mb-4 flex flex-col">
                        <label className="text-white">{key}</label>

                        {key === 'description' ? (
                            <textarea
                                value={newFurniture[key as keyof Furniture].toString()} // Convert the value to a string
                                onChange={(e) => handleInputChange(key as keyof Furniture, e.target.value)}
                            />
                        ) : key === 'image' ? (
                            <input
                                type="file"
                                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                            />
                        ) : (
                            <input
                                type="text"
                                value={newFurniture[key as keyof Furniture].toString()} // Convert the value to a string
                                onChange={(e) => handleInputChange(key as keyof Furniture, e.target.value)}
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
