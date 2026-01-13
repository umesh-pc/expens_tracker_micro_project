const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- DATABASE CONNECTION ----------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123", // ← Ensure this matches your Workbench password
  database: "expense_tracker"
});

db.connect(err => {
  if (err) {
    console.error("MySQL connection failed");
    throw err;
  }
  console.log("MySQL Connected");
});

// ---------------- AUTHENTICATION ----------------

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).send("Server error");

      if (result.length === 0) {
        return res.status(401).send("Invalid credentials");
      }

      res.json(result[0]);
    }
  );
});

// REGISTER
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log("➡️ Received Register Request:", { name, email, password });

  // 1. Check if user already exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("❌ SQL Error (Select):", err.message);
        return res.status(500).send("Server error: " + err.message);
      }

      if (result.length > 0) {
        console.log("⚠️ User already exists");
        return res.status(400).send("User already exists");
      }

      // 2. Insert new user
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        (err) => {
          if (err) {
            console.error("❌ SQL Error (Insert):", err.message);
            return res.status(500).send("Server error: " + err.message);
          }
          console.log("✅ User registered successfully!");
          res.json({ success: true });
        }
      );
    }
  );
});

// ---------------- TRANSACTIONS ----------------

// GET all transactions for a user
app.get("/transactions/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT * FROM transactions WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).send("Server error");
      res.json(result);
    }
  );
});

// ADD transaction
app.post("/transactions", (req, res) => {
  const { user_id, title, amount, type, category, date } = req.body;

  db.query(
    "INSERT INTO transactions (user_id, title, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)",
    [user_id, title, amount, type, category, date],
    err => {
      if (err) return res.status(500).send("Server error");
      res.json({ success: true });
    }
  );
});

// UPDATE transaction (New!)
app.put("/transactions/:id", (req, res) => {
  const id = req.params.id;
  const { title, amount, type, category, date } = req.body;

  db.query(
    "UPDATE transactions SET title = ?, amount = ?, type = ?, category = ?, date = ? WHERE id = ?",
    [title, amount, type, category, date, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }
      res.json({ success: true });
    }
  );
});

// DELETE transaction
app.delete("/transactions/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM transactions WHERE id = ?",
    [id],
    err => {
      if (err) return res.status(500).send("Server error");
      res.json({ success: true });
    }
  );
});

// ---------------- SERVER START ----------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});