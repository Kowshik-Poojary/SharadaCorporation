import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser, loggedOut }) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Show logout success message if redirected after logout
  useEffect(() => {
    if (loggedOut) {
      setSuccessMessage("Successfully logged out!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [loggedOut]);

  // ---------- SIGNUP ----------
  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Signup successful! You can now login.");
        setIsSignup(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch {
      setMessage("Signup failed. Try again.");
    }
  };

  // ---------- LOGIN ----------
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setSuccessMessage("Successfully logged in!");
        setTimeout(() => {setSuccessMessage("");navigate("/");}, 1200);
        
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch {
      setMessage("Login failed. Try again.");
    }
  };

  // ---------- GOOGLE LOGIN ----------
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setSuccessMessage("Successfully logged in with Google!");
        setTimeout(() => {setSuccessMessage("");navigate("/");}, 1200);
        
      } else {
        setMessage(data.message || "Google login failed.");
      }
    } catch {
      setMessage("Google login failed.");
    }
  };

  // ---------- GOOGLE SIGNUP ----------
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/google-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setSuccessMessage("Successfully signed up with Google!");
        setTimeout(() => {setSuccessMessage("");navigate("/");}, 1200);
        
      } else {
        setMessage(data.message || "Google signup failed.");
      }
    } catch {
      setMessage("Google signup failed.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {/* Input Fields */}
        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        {/* Error message */}
        {message && <p className="text-center text-red-500 mb-3">{message}</p>}

        <button
          onClick={isSignup ? handleSignup : handleLogin}
          className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        {/* Google buttons */}
        <div className="mt-6 flex flex-col items-center space-y-3">
          {isSignup ? (
            <>
              <p className="text-sm font-semibold text-gray-500">
                Or Sign Up with
              </p>
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => setMessage("Google signup failed.")}
              />
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-500">
                Or Login with
              </p>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setMessage("Google login failed.")}
              />
            </>
          )}
        </div>

        {/* Toggle login/signup */}
        <p className="text-sm text-center mt-4">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
            className="text-yellow-600 font-semibold cursor-pointer"
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>

      {/* Footer Success Message */}
      {successMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Login;
