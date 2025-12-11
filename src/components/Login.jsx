import React, { useRef, useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const Login = ({ setUser, loggedOut }) => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const loaderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Email + Password Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const ADMIN_EMAIL = "shardaadmin@gmail.com";

  // ✅ Show logout success message
  useEffect(() => {
    if (loggedOut) {
      setSuccessMessage("Successfully logged out!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [loggedOut]);

  // ---------- FORGOT PASSWORD ----------
  const handleForgotPassword = async () => {
    if (!email) return setMessage("Please enter your email first.");
    if (!emailRegex.test(email))
      return setMessage("Please enter a valid email address.");

    setIsLoading(true);
    loaderRef.current?.continuousStart();

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message);
        setForgotPassword(true); // Show reset code input
      } else {
        setMessage(data.message || "Error sending code");
      }
    } catch {
      setMessage("Error sending code");
    } finally {
      setIsLoading(false);
      loaderRef.current?.complete();
    }
  };

  // ---------- RESET PASSWORD ----------
  const handleResetPassword = async () => {
    if (!emailRegex.test(email))
      return setMessage("Please enter a valid email address.");
    if (!passwordRegex.test(newPassword))
      return setMessage(
        "Password must contain 1 uppercase, 1 number, 1 special character, and be at least 8 characters long."
      );

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: resetCode, newPassword }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message);
        setForgotPassword(false);
        setResetCode("");
        setNewPassword("");
      } else {
        setMessage(data.message || "Reset failed");
      }
    } catch {
      setMessage("Reset failed");
    }
  };

  // ---------- SIGNUP ----------
  const handleSignup = async () => {
    if (!name.trim()) return setMessage("Full name is required.");
    if (!emailRegex.test(email))
      return setMessage("Please enter a valid email address.");
    if (!passwordRegex.test(password))
      return setMessage(
        "Password must contain 1 uppercase, 1 number, 1 special character, and be at least 8 characters long."
      );

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
    if (!emailRegex.test(email))
      return setMessage("Please enter a valid email address.");
    if (!password) return setMessage("Password is required.");

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
  const isAdmin = email === ADMIN_EMAIL;

  const userData = { ...data, isAdmin, token: data.token };

  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));

  setSuccessMessage("Successfully logged in!");

  setTimeout(() => {
    setSuccessMessage("");
    navigate(isAdmin ? "/admin" : "/");
  }, 1200);
}
 else {
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
        const userData = { ...data.user, token: data.token };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setSuccessMessage("Successfully logged in with Google!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/");
        }, 1200);
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
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/");
        }, 1200);
      } else {
        setMessage(data.message || "Google signup failed.");
      }
    } catch {
      setMessage("Google signup failed.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 relative">
      <LoadingBar color="#facc15" ref={loaderRef} height={4} />

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Sign Up" : forgotPassword ? "Reset Password" : "Login"}
        </h2>

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage("");
            }}
            className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
          className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        {!forgotPassword && (
          <div className="relative w-full mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage(""); // ✅ clear error when user types again
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10"
              required
              pattern="^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
              title="Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 8 characters long."
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? "🔓" : "🔒"}
            </button>
          </div>
        )}

        {!isSignup && !forgotPassword && (
          <p
            className="text-sm text-right text-yellow-600 cursor-pointer mb-3"
            onClick={handleForgotPassword}
          >
            {isLoading ? "Sending reset mail..." : "Forgot Password?"}
          </p>
        )}

        {forgotPassword && (
          <>
            <input
              type="text"
              placeholder="Enter verification code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition mb-3"
            >
              Reset Password
            </button>
          </>
        )}

        {message && <p className="text-center text-red-500 mb-3">{message}</p>}

        {!forgotPassword && (
          <button
            onClick={isSignup ? handleSignup : handleLogin}
            className="w-full bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        )}

        {!forgotPassword && (
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
        )}

        {!forgotPassword && (
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
        )}
      </div>

      {successMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Login;
