import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = isSignup ? signup(email, password) : login(email, password);
    
    if (success) {
      setError('');
    } else {
      setError(isSignup ? 'Email already exists or invalid data' : 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isSignup ? 'Sign Up' : 'Login'} to Startup Data Generator</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>
        <p className="toggle-auth">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
