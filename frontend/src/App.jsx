import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Components
import Login from "./Login";
import Navbar from "./Navbar"; // 1. Import your new Navbar
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";

function App() {
  // ✅ Persist login
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

  // 🔒 If not logged in → show Login
  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <BrowserRouter>
      
      {/* 2. Add the Navbar here (inside BrowserRouter) */}
      <Navbar />

      {/* ROUTES */}
      <div className="container" style={{ padding: "20px" }}>
        <Routes>
          {/* Redirect empty path "/" to "/dashboard" */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Catch-all: Redirect unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;