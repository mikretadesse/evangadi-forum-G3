import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../Notification/NotificationBell.jsx";
import logo from "../../assets/images/evangadi-logo-home.png";
import styles from "./Header.module.css";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Evangadi Logo" />
        </Link>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link to="/home" className={styles.navLink}>
            Home
          </Link>

          <Link to="/how-it-works" className={styles.navLink}>
            How it Works
          </Link>

          {/* Show Notification Bell only if logged in */}
          {isLoggedIn && <NotificationBell />}

          {/* Login / Logout */}
          {isLoggedIn ? (
            <button onClick={logout} className={styles.logoutBtn}>
              LOG OUT
            </button>
          ) : (
            <Link to="/" className={styles.signInBtn}>
              SIGN IN
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
