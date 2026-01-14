import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();
// Custom hook to use the context
export const useAuth = () => useContext(AuthContext);
// Provider component
export const AuthProvider = ({ children }) => {
  // Store token and user in state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // CORRECT PLACEMENT: Define isLoggedIn inside the component
  const isLoggedIn = !!token;
  // On mount, load from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function — save token & user in state + localStorage
  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // UPDATED: Logout function with redirect
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "/"; // or "/" if your login is on home page
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
