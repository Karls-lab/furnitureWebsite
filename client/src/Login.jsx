import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import googleImage from './assets/google.png';
import facebook from './assets/facebook.png';
import { notify } from './utils/toast';
import { auth } from './firebase.ts';
import { useNavigate } from 'react-router-dom';

const provider = new GoogleAuthProvider();

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);


  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      console.log('User signed in with Google:', userCredential.user);
      notify('Logged in Successfully', 'success');
      setError(null);
      navigate('/');
    } catch (error) {
      notify(error.message, 'error');
      console.error('Error signing in with Google:', error);
    }
  };


  const handleFacebookSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, new FacebookAuthProvider());
      console.log('User signed in with Facebook:', userCredential.user);
      notify('Logged in Successfully', 'success');
      setError(null);
      navigate('/');
    } catch (error) {
      notify(error.message, 'error');
      console.error('Error signing in with Facebook:', error);
    }
  }

  return (
    <div className="mt-10 flex items-center justify-center flex-col">
      <h2 className="text-3xl font-bold mb-8 text-white">Login/SignUp with:</h2>

      <form className="pt-6">
        <button onClick={handleGoogleSignIn}
          className='m-5'>
          <img src={googleImage} alt="Google logo" className="w-12 h-12" />
        </button>
{/* 
        <button onClick={handleFacebookSignIn}
          className='m-5'>
          <img src={facebook} alt="Facebook logo" className="w-12 h-12" />
        </button> 
 */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

      </form>
    </div>
  );
}


export default Login;
