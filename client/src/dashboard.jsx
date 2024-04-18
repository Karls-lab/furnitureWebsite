import React, { useState, useEffect } from 'react';
import { collection, getDocs, where, query } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from './firebase.ts';
import { useNavigate } from 'react-router-dom';
import '../app/style.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [user] = useAuthState(auth);

    // Get data from local storage if available
    useEffect(() => {
        console.log(`user: ${user}`);
        const cachedData = localStorage.getItem('cachedData');
        if (cachedData) {
            setData(JSON.parse(cachedData));
        } else {
            getData();
        }
    }, [user]);


    // Fetch table data from Firestore
    const getData = async () => {
        try {
            const snapShot = await getDocs(collection(db, 'furniture'));
            const data = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(data);
            localStorage.setItem('cachedData', JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

        
    return (
        <div className="max-w-4xl text-white mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Firebase Database Dashboard</h1>
            <button
                className="bg-blue-500 m-2 text-white px-4 py-2 rounded-md"
                onClick={() => getData()}
                >Refresh
            </button>
            <div className="overflow-x-auto boxBorder">
                <table className="bg-tableBackground w-full min-w-fit 
                    border-collapse rounded-lg">
                    <thead className="">
                        <tr>
                            <th className="py-2 px-4 border border-gray-300">Name</th>
                            <th className="py-2 px-4 border border-gray-300">Price</th>
                            <th className="py-2 px-4 border border-gray-300">Stock</th>
                            <th className="py-2 px-4 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td className="py-2 px-4 border border-gray-300">{item.name}</td>
                                <td className="py-2 px-4 border border-gray-300">{item.price}</td>
                                <td className="py-2 px-4 border border-gray-300">{item.stock}</td>
                                <td className="py-2 px-4 border border-gray-300">

                                    <div className="flex gap-2">
                                        <button
                                            className="bg-blue-800 text-white px-4 py-2 rounded-md"
                                            onClick={() => navigate(`/dashboard/FurnitureEditor/${item.id}`)}
                                            >Edit Entry 
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-5">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                    onClick={() => navigate('/dashboard/NewFurniture')}
                    >Add New Furniture Item
                </button>
            </div>

        </div>

    );
};

export default Dashboard;
