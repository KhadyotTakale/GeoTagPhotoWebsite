import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    username: "", // added for signup
    email: "", // added for signup
    password: "",
    confirmPassword: "", // added for signup
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure password match for signup
    if (isSignup && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    const url = isSignup ? "/signup" : "/login";
    const requestBody = isSignup
      ? {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      : {
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
        };

    try {
      const response = await fetch(`http://localhost:4000${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong!");
      } else {
        alert(data.message);
        if (!isSignup) {
          localStorage.setItem("token", data.token);
          navigate("/sidebar");
        }
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="container1">
      <div className="form-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{isSignup ? "Create an Account" : "Login to Your Account"}</h2>

          {!isSignup && (
            <div className="input-container">
              <label htmlFor="usernameOrEmail">Username or Email</label>
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="Enter Username or Email"
                required
              />
            </div>
          )}

          {isSignup && (
            <>
              <div className="input-container">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter Username"
                  required
                />
              </div>

              <div className="input-container">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                />
              </div>
            </>
          )}

          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
          </div>

          {isSignup && (
            <div className="input-container">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Processing..." : isSignup ? "Signup" : "Login"}
          </button>

          <div className="toggle-link">
            <p onClick={() => setIsSignup(!isSignup)}>
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Signup"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
