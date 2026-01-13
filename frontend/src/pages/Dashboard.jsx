import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [transactions, setTransactions] = useState([]);
  
  // Default to current month (Format: "YYYY-MM")
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7) 
  );
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      API.get(`/transactions/${user.id}`).then(res =>
        setTransactions(res.data)
      );
    }
  }, [user]);

  // Filter transactions based on the selected month
  const monthlyTransactions = transactions.filter(t => 
    t.date.startsWith(currentMonth)
  );

  // Calculate stats using ONLY the filtered list
  const income = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = monthlyTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  const expensePercent =
    income === 0 ? 0 : Math.min((expense / income) * 100, 100);

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2>Dashboard</h2>
          <p style={{ color: "#888", marginTop: "-10px" }}>
            Welcome back, <strong>{user ? user.name : "User"}</strong> 👋
          </p>
        </div>

        {/* 4. The Month Selector Input - UPDATED STYLE */}
        <input 
          type="month" 
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          style={{ 
            padding: "10px 15px", 
            borderRadius: "10px", 
            border: "none", 
            background: "#2bd6e1",  /* Bright Cyan Color */
            color: "black",         /* Black text for readability */
            fontWeight: "bold",
            cursor: "pointer",
            outline: "none"
          }}
        />
      </div>

      {/* STATS (Now shows only selected month's data) */}
      <div className="stats">
        <div className="stat clickable" onClick={() => navigate("/transactions")}>
          <p>Income ({currentMonth})</p>
          <h3 className="income">₹{income.toLocaleString("en-IN")}</h3>
        </div>

        <div className="stat clickable" onClick={() => navigate("/transactions")}>
          <p>Expense ({currentMonth})</p>
          <h3 className="expense">₹{expense.toLocaleString("en-IN")}</h3>
        </div>

        <div className="stat">
          <p>Balance</p>
          <h3>₹{balance.toLocaleString("en-IN")}</h3>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="card progress-card">
        <p>Expense Usage ({new Date(currentMonth).toLocaleString('default', { month: 'long' })})</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${expensePercent}%`, backgroundColor: expensePercent > 80 ? "#ff4d4d" : "#4caf50" }}
          ></div>
        </div>
        <p className="muted">
          {expensePercent.toFixed(0)}% of income spent
        </p>
      </div>
    </div>
  );
}

export default Dashboard;