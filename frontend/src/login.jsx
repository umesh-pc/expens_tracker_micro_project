import { useState } from "react";
import { API } from "./api";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // 1. New State for Green messages

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.reload();
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password");
      setSuccessMsg(""); // Clear any old success messages
    }
  };

  const handleRegister = async () => {
    try {
      await API.post("/register", { name, email, password });
      setIsRegister(false);
      
      // 2. Set the Success Message (Green)
      setSuccessMsg("Registration successful! Please login.");
      setError(""); // Clear any old errors
    } catch {
      setError("User already exists");
      setSuccessMsg("");
    }
  };

  // Style helper
  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  };

  return (
    <div className="login-container">
      
      {/* HEADER */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", margin: "0", color: "#333", whiteSpace: "nowrap" }}>
          Expense Tracker 💰
        </h1>
        <p style={{ margin: "5px 0 0", color: "#666", fontSize: "0.9rem" }}>
          Manage your money smart & easy
        </p>
      </div>

      <h2 style={{ marginBottom: "15px" }}>{isRegister ? "Register" : "Login"}</h2>

      {isRegister && (
        <input
          placeholder="Name"
          onChange={e => setName(e.target.value)}
          style={inputStyle}
        />
      )}

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        style={inputStyle}
      />

      <button 
        onClick={isRegister ? handleRegister : handleLogin}
        style={{ width: "100%", padding: "10px", marginTop: "5px", cursor: "pointer" }}
      >
        {isRegister ? "Register" : "Login"}
      </button>

      <p
        className="toggle"
        onClick={() => {
          setIsRegister(!isRegister);
          setError("");
          setSuccessMsg("");
        }}
        style={{ marginTop: "15px", cursor: "pointer", color: "blue", textDecoration: "underline" }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "New user? Register here"}
      </p>

      {/* 3. Success Message (GREEN) */}
      {successMsg && (
        <p style={{ color: "#2ecc71", marginTop: "10px", fontWeight: "bold" }}>
          ✅ {successMsg}
        </p>
      )}

      {/* Error Message (RED) */}
      {error && (
        <p className="error" style={{ color: "red", marginTop: "10px" }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

export default Login;