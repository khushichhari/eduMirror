import React, { useState } from 'react';
import '../Styles/career.css';

const CareerSimulator = () => {
  const [name, setName] = useState('');
  const [careerPath, setCareerPath] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const simulate = async () => {
    if (!name.trim() || !careerPath.trim()) {
      setError('Please enter both name and career path.');
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/simulate'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            careerPath,
            model: process.env.REACT_APP_OPENAI_MODEL || 'gpt-3.5-turbo',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to simulate career.');
      }

      const data = await response.json();
      setResult(data.result || JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Career Path Simulator</h1>
      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <input
        placeholder="Career path (e.g., Data Scientist)"
        value={careerPath}
        onChange={(e) => setCareerPath(e.target.value)}
        disabled={loading}
      />
      <button onClick={simulate} disabled={loading}>
        {loading ? 'Simulating...' : 'Simulate Career'}
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
      )}

      {result && (
        <div
          style={{
            textAlign: 'left',
            background: '#f7f7f7',
            padding: '1em',
            marginTop: '1em',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
        </div>
      )}
    </div>
  );
};

export default CareerSimulator;
