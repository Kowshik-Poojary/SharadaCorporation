import React, { useState } from "react";


const Login = () => {

  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {/* Input fields */}
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

        {/* Toggle Login / Signup */}
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
