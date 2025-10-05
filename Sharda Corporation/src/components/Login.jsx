import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! You can now login.");
        setIsSignup(false);
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (err) {
      setMessage("Signup failed. Try again.");
    }
  };

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
        navigate("/");
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Login failed. Try again.");
    }
  };

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

        {message && <p className="text-center text-red-500 mb-3">{message}</p>}

        <button
          onClick={isSignup ? handleSignup : handleLogin}
          className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await fetch(
                  "http://localhost:5000/api/users/google",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      credential: credentialResponse.credential,
                    }),
                  }
                );
                const data = await res.json();
                setUser(data);
                navigate("/");
              } catch (err) {
                setMessage("Google login failed.");
              }
            }}
            onError={() => setMessage("Google login failed.")}
          />
        </div>

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
    </div>
  );
};

export default Login;
