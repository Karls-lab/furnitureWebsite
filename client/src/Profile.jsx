import React, { useState, useEffect } from 'react';
import { collection, getDocs, where, query } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from './firebase.ts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [customClaims, setCustomClaims] = useState({});
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            user.getIdTokenResult()
            .then((idTokenResult) => {
                console.log("User's custom claims:", idTokenResult.claims);
                setCustomClaims(idTokenResult.claims);
            })
            .catch((error) => {
                console.error("Error getting custom claims:", error);
            });
        }
    }, [user]);


    if (!user) {
        return (
            <div className="max-w-4xl text-white mx-auto py-8">
                <h1 className="text-3xl font-bold mb-4">Firebase Database Dashboard</h1>
                <p>Please log in to view this page</p>
            </div>
        )
    } else {
        
        return ( 

            <div className='flex flex-col justify-center items-center
                h-screen text-white text-3xl gap-3'>
                <h1>{user.displayName}</h1>
                <h3>{user.email}</h3>
                {customClaims.role && <h3>Role: {customClaims.role}</h3>} {/* Render role if it exists */}

            </div>
        )
    }
}

export default Dashboard;

