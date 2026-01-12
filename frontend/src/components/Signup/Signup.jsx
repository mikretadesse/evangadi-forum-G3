import { useRef, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import api from "../../Api/axios";
import styles from "./Signup.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Signup = ({ switchToLogin }) => {
  const userNameRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = userNameRef.current.value.trim();
    const first_name = firstNameRef.current.value.trim();
    const last_name = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    if (!username || !first_name || !last_name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await api.post("/user/register", {
        username,
        first_name,
        last_name,
        email,
        password,
      });

      localStorage.getItem("token", data.token);
      // console.log(data);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupCard}>
        <h2 className={styles.title}>Join the network</h2>

        <p className={styles.subtitle}>
          Already have an account?
          <span className={styles.inlineLink} onClick={switchToLogin}>
            Sign in
          </span>
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          {/* Email Field */}
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            className={styles.input}
          />

          {/* Name Fields */}
          <div className={styles.nameRow}>
            <input
              ref={firstNameRef}
              type="text"
              placeholder="First Name"
              className={styles.input}
            />
            <input
              ref={lastNameRef}
              type="text"
              placeholder="Last Name"
              className={styles.input}
            />
          </div>

          <input
            ref={userNameRef}
            type="text"
            placeholder="User Name"
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
          <button type="submit" className={styles.submitBtn} >
            Agree and Join
          </button>
        </form>

        <p className={styles.terms}>
          I agree to the
          <a href="#"> privacy policy</a> and
          <a href="#"> terms of service</a>.
        </p>

        <p className={styles.bottomLink} onClick={switchToLogin}>
          Already have an account?{" "}
        </p>
      </div>
    </div>
  );
};

export default Signup;
