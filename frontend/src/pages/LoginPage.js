// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useTranslation } from 'react-i18next'; // Import the translation hook
import './LoginPage.css';

const LoginPage = () => {
  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const { t } = useTranslation(); // Initialize translation
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userName,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || t('Network response was not ok');
        setMessage({ text: errorMessage, type: 'error' });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setMessage({ text: t('Login successful!'), type: 'success' });
      console.log(t('Login successful:'), data);

      login(data.token);

      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error(t('Error logging in:'), error);
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <h1>{t('Log In')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="user_name"
              className="form__input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="user_name" className="form__label">{t('User Name')}</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              className="form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="password" className="form__label">{t('Password')}</label>
          </div>
          <button type="submit">{t('Log In')}</button>
        </form>
        {message.text && (
          <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
            {message.text}
          </div>
        )}
        <div className="register-prompt">
          <span>{t("Don't have an account yet?")}</span>
          <Link to="/auth/registerUser" className="register-link">{t('Register here')}</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;