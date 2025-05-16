import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

// Add a welcome message about the cookie usage
if (!localStorage.getItem('cookie_notice_seen')) {
  setTimeout(() => {
    alert('Welcome to AP CSA FRQ Practice! This application uses browser local storage to save your code and preferences. No data is sent to any server. Your work is stored only on your device.');
    localStorage.setItem('cookie_notice_seen', 'true');
  }, 1000);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
