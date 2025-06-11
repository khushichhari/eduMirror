// import React, { useState } from 'react';
// import '../Styles/career.css';

// const CareerSimulator = () => {
//   const [name, setName] = useState('');
//   const [careerPath, setCareerPath] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const simulate = async () => {
//     if (!name || !careerPath) {
//       setError('Please enter both name and career path.');
//       return;
//     }

//     setError(null);
//     setLoading(true);

//     try {
//       const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/simulate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, careerPath }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Simulation failed');
//       }

//       setResult(data);
//     } catch (err) {
//       setError(err.message);
//       setResult(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <h1>Career Path Simulator</h1>
//       <input
//         placeholder="Your name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         disabled={loading}
//       />
//       <input
//         placeholder="Career path (e.g., Full Stack Developer)"
//         value={careerPath}
//         onChange={(e) => setCareerPath(e.target.value)}
//         disabled={loading}
//       />
//       <button onClick={simulate} disabled={loading}>
//         {loading ? 'Simulating...' : 'Simulate Career'}
//       </button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {result && (
//         <pre style={{ textAlign: 'left', background: '#f4f4f4', padding: '1em', marginTop: '1em', borderRadius: '8px' }}>
//           {JSON.stringify(result, null, 2)}
//         </pre>
//       )}
//     </div>
//   );
// };

// export default CareerSimulator;


// New


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
          body: JSON.stringify({ name, careerPath }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to simulate career.');
      }

      const data = await response.json();
      setResult(data.result || JSON.stringify(data, null, 2)); // fallback if structure changes
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
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
          {result}
        </div>
      )}
    </div>
  );
};

export default CareerSimulator;
