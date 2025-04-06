import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import api from "../api";

const Signup: React.FC<{ setIsAuthenticated: (value: boolean) => void }> = ({
  setIsAuthenticated,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRequestOTP = async () => {
    try {
      console.log("Making request to:", ); // Debugging
      const response = await api.post("/auth/request-otp", { email });
      console.log("OTP Response:", response.data); // Debugging
      setOtpSent(true);
      setError("");
    } catch (error) {
      console.error("Failed to send OTP:", error); // Debugging
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await api.post("/auth/signup", {
        username,
        email,
        password,
        otp,
      });

      // Save the token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update authentication state
      setIsAuthenticated(true);

      // Navigate to the home page
      navigate("/");
    } catch (error) {
        setError("Signup failed. Please check your details and try again.");
        console.error("Signup failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-indigo-950">Signup</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          )}
          <div className="flex gap-2">
            {!otpSent ? (
              <Button
                variant="primary"
                size="md"
                text="Request OTP"
                onClick={handleRequestOTP}
              />
            ) : (
              <Button
                variant="primary"
                size="md"
                text="Signup"
                onClick={handleSignup}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
