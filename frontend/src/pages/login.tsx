import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import api from "../api";

const Login: React.FC<{ setIsAuthenticated: (value: boolean) => void }> = ({
  setIsAuthenticated,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });

      // Save the token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Update authentication state
      setIsAuthenticated(true);

      // Navigate to the home page
      navigate("/");
    } catch (error) {
        setError("Login failed. Please check your credentials and try again.");
        console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  from-slate-900 to-indigo-950">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-indigo-950">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
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
          <Button
            variant="primary"
            size="md"
            text="Login"
            onClick={handleLogin}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
