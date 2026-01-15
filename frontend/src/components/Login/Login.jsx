import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import { useAuth } from "../../context/AuthContext";
import styles from "../Login/Login.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = ({ switchToSignup }) => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    try {
      const { data } = await api.post(
        "/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Save token and user globally
      login(data.token, data.user);

      // Clear inputs
      emailRef.current.value = "";
      passwordRef.current.value = "";

      // Redirect after successful login
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Login to your account</h2>

        <p className={styles.subtitle}>
          Don&apos;t have an account?
          <span className={styles.inlineLink} onClick={switchToSignup}>
            Create a new account
          </span>
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Email Field */}
          <input
            ref={emailRef}
            type="email"
            placeholder="Your Email"
            className={styles.input}
          />

          {/* Pasword Field */}
          <div className={styles.passwordWrapper}>
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              className={styles.input}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Forgot password */}
          <div className={styles.forgotWrapper}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>
          <button type="submit" className={styles.submitBtn}>
            submit
          </button>
        </form>

        <p className={styles.bottomLink} onClick={switchToSignup}>
          Create an account?
        </p>
      </div>
    </div>
  );
};
export default Login;
