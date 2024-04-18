import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase.ts';
import { notify } from '../utils/toast';
import { Furniture } from '../types/furniture.js';
import { useNavigate } from 'react-router-dom';


// This page is to edit a single entry in the furniture collection
// A single entry is a piece of furniture
const FurnitureEditor = () => {
    const navigate = useNavigate();
    const { furnitureId } = useParams();
    const [furniture, setFurniture] = useState(null);
    const [editedFurniture, setEditedFurniture] = useState(null);
    const [user] = useAuthState(auth);

    // Fetch furniture data when the component mounts 
    useEffect(() => {
        fetchData();
    }, [user]); 

    // Fetch furniture data from Firestore
    const fetchData = async () => {
        try {
            const furnitureRef = doc(db, 'furniture', furnitureId); 
            const furnitureDoc = await getDoc(furnitureRef);
            if (furnitureDoc.exists()) {
                setFurniture({ id: furnitureDoc.id, ...furnitureDoc.data() });
                setEditedFurniture({ id: furnitureDoc.id, ...furnitureDoc.data() }); // Set edited furniture as well
            } else {
                console.error('Furniture not found');
            }
        } catch (error) {
            console.error('Error fetching furniture data:', error);
        }
    };

    // Update edited furniture state when input changes
    const handleInputChange = (key, value) => {
        setEditedFurniture(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    // Update furniture data
    const handleUpdate = async () => {
        try {
            await updateDoc(doc(db, 'furniture', furnitureId), editedFurniture);
            console.log('Furniture updated successfully');
            notify('Update Successful', 'success')
        } catch (error) {
            console.error('Error updating furniture data:', error);
            notify('Error updating furniture', 'error');
        }
    };

    // Delete furniture data
    const handleDelete = async () => {
        // warn user if they really want to delete the furniture
        const confirmDelete = window.confirm('Are you sure you want to delete this furniture?');
        if (!confirmDelete) return;
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
        <div className="max-w-4xl text-white mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Furniture Editor</h1>
            <div className="flex flex-row flex-wrap gap-x-10 bg-gray-800 rounded-md p-4 mb-4">
                <h2 className="w-full text-xl font-semibold mb-2">{furniture.name}</h2>
                {/* Dynamically create input fields based on Furniture object */}
                {Object.keys(Furniture).map((key, index) => (
                    <div key={index} className="mb-4 min-w-40 flex flex-col">
                        <label className="text-white mb-2">{key}</label>
                        <input
                            type="text"
                            value={editedFurniture[key]}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="bg-gray-700 rounded-md p-2 text-white"
                        />
                    </div>
                ))}
                <div className='w-full'>
                    <button onClick={handleUpdate} className="bg-blue-500 text-white px-8 py-4 rounded-md mr-5">Update</button>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-8 py-4 rounded-md">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default FurnitureEditor;
