import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom"; // for redirect

const Login = ({ setUser }) => {
  const navigate = useNavigate(); // navigation hook
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // inline message

  // Google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { default: jwt_decode } = await import("jwt-decode");
      const decoded = jwt_decode(tokenResponse.credential || tokenResponse.access_token);

      try {
        const res = await fetch("http://localhost:5000/api/users/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
          }),
        });
        const data = await res.json();

        setUser(data); // update app state with logged-in user
        setMessage(""); // clear messages
        navigate("/"); // redirect to home
      } catch (err) {
        setMessage("Google login failed.");
      }
    },
    onError: () => setMessage("Google login failed."),
  });

  // Manual signup
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

  // Manual login
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data); // set logged-in user in app state
        setMessage("");
        navigate("/"); // go to home page
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

        {/* Inline message */}
        {message && (
          <p className="text-center text-red-500 mb-3">{message}</p>
        )}

        {/* Button to trigger login/signup */}
        <button
          onClick={isSignup ? handleSignup : handleLogin}
          className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        {/* Google Auth Button */}
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
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage(""); // clear previous messages
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
