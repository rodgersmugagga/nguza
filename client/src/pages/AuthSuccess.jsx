import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userString = params.get('user');

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        const authData = { token, user };

        // Dispatch success to Redux
        dispatch(signInSuccess(authData));

        // Persist to localStorage
        localStorage.setItem('user', JSON.stringify(authData));

        // Redirect to home or intended page
        navigate('/');
      } catch (error) {
        console.error('Error parsing OAuth user data:', error);
        navigate('/sign-in?error=data_parse_error');
      }
    } else {
      navigate('/sign-in?error=missing_auth_data');
    }
  }, [location, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800">Completing Sign In...</h2>
        <p className="text-gray-500">Please wait while we finalize your account.</p>
      </div>
    </div>
  );
}
