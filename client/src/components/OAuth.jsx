import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

// Define OAuth component as default export 

export default function OAuth() {
  // Hook to dispatch actions to Redux store  
  const dispatch = useDispatch();

  // Hook from react-router-dom to navigate programmatically after login  
  const navigate = useNavigate();

  // Function to handle Google sign-in button click

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          password: result.user.uid,
          photo: result.user.photoURL
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Google sign-in failed:", data.message || "Sign in failed");
        return;
      }

      dispatch(signInSuccess(data));

      localStorage.setItem("user", JSON.stringify(data));
      console.log("Google sign-in successful:", data);

      navigate("/"); // Redirect to home page after successful login



    } catch (error) {
      console.log("Could not sign in with google!", error)
    }
  }

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className="bg-red-500 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  )
}
