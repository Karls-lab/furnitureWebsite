import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from './firebase';
// @ts-ignore
import { notify } from './utils/toast';
import { Furniture, initialFurniture } from './types/furniture';
// import '../app/style.css';

// This page is to edit a single entry in the furniture collection
// A single entry is a piece of furniture
const FurnitureEditor = () => {
    const navigate = useNavigate();
    const { furnitureId } = useParams();
    const [furniture, setFurniture] = useState<Furniture | null>(null);
    const [editedFurniture, setEditedFurniture] = useState<Furniture | null>(null);
    // the field order is the order in which the fields are displayed
    const fieldOrder: (keyof Furniture)[] = Object.keys(initialFurniture);
    const [user] = useAuthState(auth);

    // Fetch furniture data when the component mounts 
    useEffect(() => {
        fetchData();
    }, [user]);

    // Fetch furniture data from Firestore
    const fetchData = async () => {
        try {
            if (furnitureId) { // Check if furnitureId is defined
                const furnitureRef = doc(db, 'furniture', furnitureId);
                const furnitureDoc = await getDoc(furnitureRef);
                if (furnitureDoc.exists()) {
                    const data = furnitureDoc.data() as Furniture; // Cast to Furniture type
                    setFurniture({ ...data });
                    setEditedFurniture({ ...data });
                } else {
                    console.error('Furniture not found');
                }
            } else {
                console.error('Invalid furnitureId:', furnitureId);
            }
        } catch (error) {
            console.error('Error fetching furniture data:', error);
        }
    };

    // Update edited furniture state when input changes
    const handleInputChange = (key: keyof Furniture, value: string) => {
        console.log(key, value);
        setEditedFurniture(prevState => ({
            ...prevState,
            [key]: value,
        } as Furniture)); // Explicitly specify prevState type as Furniture
    };

    // Update furniture data
    const handleUpdate = async () => {
        if (!editedFurniture) return;
        if (!furnitureId) return;
        try {
            await updateDoc(doc(db, 'furniture', furnitureId), editedFurniture);
            console.log('Furniture updated successfully');
            notify('Update Successful', 'success');
        } catch (error) {
            console.error('Error updating furniture data:', error);
            notify('Error updating furniture', 'error');
        }
    };

    // Delete furniture data
    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this furniture?');
        if (!confirmDelete) return;
        if (!furnitureId) return;
        try {
            await deleteDoc(doc(db, 'furniture', furnitureId));
            console.log('Furniture deleted successfully');
            notify('Delete Successful', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting furniture data:', error);
            notify('Error deleting furniture', 'error');
        }
    };

    if (!furniture) {
        return (
            <div className='flex justify-center mt-20 text-white'>
                <h1 className='text-2xl'>Loading...</h1>
            </div>
        );
    }


    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-3xl text-white font-bold mb-4">New Furniture Form</h1>
            <div className="flex flex-col gap-3">

                {/* Dynamically create input fields based on Furniture object */}
                {Object.keys(initialFurniture)
                    .filter(key => key !== 'id' && key !== 'image') 
                    .map((key, index) => (

                    <div key={index} className="mb-4 min-w-40 flex flex-col">
                        <label className="text-white">{key}</label>

                        {key === 'description' ? (
                            <textarea
                                value={editedFurniture && editedFurniture[key as keyof Furniture] ? editedFurniture[key as keyof Furniture].toString() : ''} 
                                onChange={(e) => handleInputChange(key as keyof Furniture, e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                value={editedFurniture && editedFurniture[key as keyof Furniture] ? editedFurniture[key as keyof Furniture].toString() : ''} 
                                onChange={(e) => handleInputChange(key as keyof Furniture, e.target.value)}
                            />
                        )}
                    </div>
                ))}


                <div className='w-full'>
                    <button onClick={handleUpdate} className="bg-blue-500 text-white px-8 py-4 rounded-md">Update</button>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-8 py-4 rounded-md m-5">Delete</button>
                </div>


            </div>
        </div>
    );
}

export default FurnitureEditor;
