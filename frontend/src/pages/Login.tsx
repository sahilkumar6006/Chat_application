import React from "react";
import { Link } from "react-router-dom";
import "./Login.css"; // Custom CSS

const Login: React.FC = () => {
  return (
    <div className="login-container">
      <div className="login-sheet">
        <h1 className="login-title">Sign in to Chat App</h1>

        <div className="login-alert">This is a static login form example.</div>

        <form className="login-form">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Sign In
          </button>
          <div className="login-link">
            <Link to="/register">Don't have an account? Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
