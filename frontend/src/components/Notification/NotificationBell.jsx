import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./NotificationBell.module.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return; // Don't fetch if user not logged in

    axios
      .get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Ensure we always set an array
        setNotifications(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      });
  }, [token]);

  const unread = Array.isArray(notifications)
    ? notifications.filter((n) => !n.is_read).length
    : 0;

  return (
    <div className={styles.bellContainer}>
      <div className={styles.bellIcon} onClick={() => setOpen(!open)}>
        🔔 {unread > 0 && <span className={styles.unreadBadge}>{unread}</span>}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {notifications.length === 0 && (
            <div className={styles.notificationItem}>No notifications</div>
          )}
          {notifications.map((n) => (
            <div
              key={n.notification_id}
              className={`${styles.notificationItem} ${
                !n.is_read ? styles.unread : ""
              }`}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
