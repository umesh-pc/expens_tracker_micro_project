import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Get the user from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  // Helper to check active link for styling
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      {/* Left Side: Links */}
      <div style={styles.menu}>
        <Link to="/dashboard" style={isActive("/dashboard") ? styles.activeLink : styles.link}>
          Dashboard
        </Link>
        <Link to="/transactions" style={isActive("/transactions") ? styles.activeLink : styles.link}>
          Transactions
        </Link>
        <Link to="/reports" style={isActive("/reports") ? styles.activeLink : styles.link}>
          Reports
        </Link>
      </div>

      {/* Right Side: Name & Logout */}
      <div style={styles.rightSection}>
        
        {/* --- NEW CODE: Display User Name --- */}
        {user && (
          <span style={styles.username}>
            👤 {user.name}
          </span>
        )}
        {/* ----------------------------------- */}

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}

// Styles to match your Gradient Theme
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "linear-gradient(90deg, #2bd6e1 0%, #a366ff 100%)", // Matches your screenshot
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },
  menu: {
    display: "flex",
    gap: "20px"
  },
  link: {
    textDecoration: "none",
    color: "white", // Dark text for unselected
    fontWeight: "bold",
    padding: "8px 20px",
    borderRadius: "20px",
    transition: "0.3s"
  },
  activeLink: {
    textDecoration: "none",
    color: "black",
    background: "white", // White pill for active tab
    fontWeight: "bold",
    padding: "8px 20px",
    borderRadius: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  username: {
    fontWeight: "bold",
    fontSize: "1rem",
    color: "white", // White text to sit on gradient
    textShadow: "0 1px 2px rgba(0,0,0,0.2)"
  },
  logoutBtn: {
    background: "#ff4757", // Orange/Red color from your screenshot
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
  }
};

export default Navbar;