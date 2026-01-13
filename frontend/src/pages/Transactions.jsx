import { useEffect, useState } from "react";
import { API } from "../api";

function Transactions() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  
  // 1. New State to track which item we are editing
  const [editId, setEditId] = useState(null);

  const fetchTransactions = async () => {
    if (user && user.id) {
      const res = await API.get(`/transactions/${user.id}`);
      setTransactions(res.data);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 2. New Function: Pre-fill the form when "Edit" is clicked
  const handleEdit = (t) => {
    setEditId(t.id);
    setTitle(t.title);
    setAmount(t.amount);
    setType(t.type);
    setCategory(t.category);
  };

  // 3. Updated Logic: Handles both ADD and UPDATE
  const handleSave = async () => {
    if (!title || !amount || !category) return;

    const today = new Date().toISOString().split("T")[0];

    if (editId) {
      // --- UPDATE EXISTING TRANSACTION ---
      await API.put(`/transactions/${editId}`, {
        title,
        amount: Number(amount),
        type,
        category,
        date: today
      });
      setEditId(null); // Stop editing mode
    } else {
      // --- ADD NEW TRANSACTION ---
      await API.post("/transactions", {
        user_id: user.id,
        title,
        amount: Number(amount),
        type,
        category,
        date: today
      });
    }

    // Reset Form
    setTitle("");
    setAmount("");
    setCategory("");
    setType("expense");

    fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="page">
      <h2>Transactions</h2>

      {/* FORM */}
      <div className="card form">
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          placeholder="Description"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        {/* 4. Button Text Changes Dynamically */}
        <button 
          onClick={handleSave} 
          style={{ backgroundColor: editId ? "#ffc107" : "" }} // Optional: Yellow for update
        >
          {editId ? "Update Transaction" : "Add Transaction"}
        </button>
        
        {/* Cancel Button (Only shows when editing) */}
        {editId && (
          <button 
            onClick={() => {
              setEditId(null);
              setTitle("");
              setAmount("");
              setCategory("");
            }}
            style={{ marginLeft: "10px", backgroundColor: "#666" }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="list">
        {transactions.map(t => (
          <div key={t.id} className="item">
            <div>
              <strong>{t.title}</strong>
              <div className="muted">{t.category}</div>
              
              {/* ------------ UPDATED DATE FORMAT HERE ------------ */}
              <div className="muted" style={{ fontSize: "0.85rem" }}>
                {new Date(t.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </div>
              {/* -------------------------------------------------- */}
            </div>

            <div className={`amount ${t.type}`}>
              ₹{Number(t.amount).toLocaleString("en-IN")}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              {/* 5. New Edit Button */}
              <button 
                className="edit" 
                onClick={() => handleEdit(t)}
                style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
              >
                ✏️
              </button>

              <button className="delete" onClick={() => deleteTransaction(t.id)}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;