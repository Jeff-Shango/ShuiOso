import React, { useState } from 'react';
import { Studio } from 'sanity'; // Now correct for v3
import config from '../studio/sanity.config'
// import config from '../../studio/sanity.config'; // Adjust if needed

const Admin = () => {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  const checkAuth = () => {
    if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
      setAuthorized(true);
    }
  };

  if (!authorized) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: '0.5rem', padding: '0.5rem' }}
        />
        <button onClick={checkAuth}>Enter</button>
      </div>
    );
  }

  return <Studio config={config} />;
};

export default Admin;
