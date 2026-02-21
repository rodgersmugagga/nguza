import React from 'react';

export default function OAuth() {
  const handleGoogleClick = () => {
    // Redirect to backend Google auth route
    // The backend handles the OAuth flow and redirects back to /auth-success
    window.location.href = "/api/auth/google";
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="flex items-center justify-center w-full py-4 border border-gray-100 bg-white rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm group"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
      />
      <span className="text-sm font-black text-gray-700 uppercase tracking-widest">Sign in with Google</span>
    </button>
  );
}
