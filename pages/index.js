import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  // Check if already logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  // Register user
  async function register(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        alert(data.error || 'Register failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      alert('Something went wrong');
    }
  }

  // Login user
  async function login(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong');
    }
  }

  // Logout
  async function logout() {
    await fetch('/api/auth/logout');
    setUser(null);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>OnlyFans-style Platform — KYC Starter</h1>

      {user ? (
        <div>
          <p>
            Signed in as <strong>{user.email}</strong> — verification:{' '}
            <em>{user.verificationStatus}</em>
          </p>
          <button onClick={logout}>Logout</button>{' '}
          <Link href="/verify">
            <button>Start verification</button>
          </Link>
        </div>
      ) : (
        <div>
          <h3>Register / Login</h3>
          <form onSubmit={register}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <div>
              <button type="submit">Register</button>
              <button type="button" onClick={login}>
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
