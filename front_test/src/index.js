import React from 'react';
import ReactDOM from 'react-dom/client';  // This is correct for React 18+
import './index.css';
import App from './App';  // Your main App component
import reportWebVitals from './reportWebVitals';

// This part is fine and matches React 18+ usage
const root = ReactDOM.createRoot(document.getElementById('root'));  // Make sure this element exists in index.html
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Measure performance if you want
reportWebVitals();
