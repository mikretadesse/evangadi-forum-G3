import React, { useState } from "react";
import styles from "./Login.module.css"; // <- updated
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/reset-password",
        {
          email,
          otp,
          password,
        }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className={styles.Login_Wrapper}>
      <div className={styles.centered_container}>
        <div className={styles.login_box}>
          <h5>Reset Password</h5>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <button type="submit" className={styles.loginButton}>
              Reset Password
            </button>
          </form>
          {message && (
            <p className={styles.errorMessage} style={{ color: "green" }}>
              {message}
            </p>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
