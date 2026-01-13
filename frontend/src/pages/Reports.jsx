import { useEffect, useState } from "react";
import { API } from "../api";

function Reports() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      API.get(`/transactions/${user.id}`).then((res) => {
        const transactions = res.data;

        // 1. Group by Month and Sum ONLY Expenses
        const stats = {};

        transactions.forEach((t) => {
          // Only include expenses (money spent)
          if (t.type === "expense") {
            const date = new Date(t.date);
            const month = date.toLocaleString("default", { month: "long", year: "numeric" });

            if (!stats[month]) {
              stats[month] = 0;
            }
            stats[month] += Number(t.amount);
          }
        });

        // 2. Convert object to array for the chart
        const formattedData = Object.keys(stats).map((key) => ({
          month: key,
          total: stats[key],
        }));

        setReportData(formattedData);
      });
    }
  }, [user]);

  // Find the highest expense to calculate bar height (Scaling)
  const maxExpense = Math.max(...reportData.map((d) => d.total), 0);

  return (
    <div className="page">
      <h2>Monthly Expense Report</h2>

      {/* CHART CONTAINER */}
      <div className="card" style={{ height: "400px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "40px 20px" }}>
        
        {reportData.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>No expenses to show</p>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", height: "100%" }}>
            
            {/* Y-AXIS LABEL (Rotated) */}
            <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: "#666", fontSize: "12px", textAlign: "center" }}>
              Amount Spent (₹)
            </div>

            {/* BARS */}
            {reportData.map((data) => (
              <div key={data.month} style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
                
                {/* The Bar */}
                <div
                  style={{
                    height: `${(data.total / maxExpense) * 250}px`, // Scale bar height relative to max
                    width: "50%",
                    minWidth: "40px",
                    background: "linear-gradient(to top, #ff4d4d, #ff9966)", // Red/Orange Gradient for Expenses
                    borderRadius: "8px 8px 0 0",
                    position: "relative",
                    transition: "height 0.5s ease-in-out"
                  }}
                >
                  {/* Amount Label on Top of Bar */}
                  <span style={{ 
                    position: "absolute", 
                    top: "-25px", 
                    left: "50%", 
                    transform: "translateX(-50%)", 
                    color: "#fff", 
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}>
                    ₹{data.total.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* X-Axis Label (Month) */}
                <p style={{ marginTop: "15px", fontSize: "14px", color: "#aaa" }}>
                  {data.month}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUMMARY LIST BELOW CHART */}
      <div style={{ marginTop: "20px" }}>
        {reportData.map((data) => (
          <div key={data.month} className="card item" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", padding: "15px" }}>
            <span>{data.month}</span>
            <span style={{ color: "#ff4d4d", fontWeight: "bold" }}>
              ₹{data.total.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;