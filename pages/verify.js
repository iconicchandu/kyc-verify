// pages/verify.js
import { useEffect, useState } from 'react';

export default function Verify() {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function startVerification() {
    setLoading(true);
    try {
      const res = await fetch('/api/verify/start', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        // Redirect user to Stripe-hosted verification
        window.location.href = data.url;
      } else {
        alert('Failed to start verification');
      }
    } catch (err) {
      console.error(err);
      alert('Error starting verification');
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Identity Verification</h1>
      <p>We use Stripe Identity to verify your account.</p>
      <button onClick={startVerification} disabled={loading}>
        {loading ? 'Redirecting...' : 'Start Verification'}
      </button>
    </div>
  );
}
