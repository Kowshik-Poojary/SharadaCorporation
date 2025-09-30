import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  // Hook for Google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { default: jwt_decode } = await import("jwt-decode");
      const decoded = jwt_decode(tokenResponse.credential || tokenResponse.access_token);
      console.log("Google user:", decoded);
      alert(`Welcome ${decoded.name}`);
    },
    onError: () => {
      console.log("Google Login Failed");
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        <button className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition">
          {isSignup ? "Sign Up" : "Login"}
        </button>

        {/* Dynamic Google Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => googleLogin()}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-5 h-5"
            />
            {isSignup ? "Sign up with Google" : "Sign in with Google"}
          </button>
        </div>

        <p className="text-sm text-center mt-4">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            onClick={() => setIsSignup(!isSignup)}
            className="text-yellow-600 font-semibold cursor-pointer"
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
