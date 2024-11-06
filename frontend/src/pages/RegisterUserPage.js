// src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Імпортуйте хук перекладу
import './RegisterUserPage.css';

const RegisterUserPage = () => {
  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);
  
  const { t } = useTranslation(); // Ініціалізуйте переклад
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('Passwords do not match'));
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/auth/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userName,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.statusCode === 409) {
          setError(t('Username or email already exists'));
        } else {
          setError(t('Registration failed'));
        }
        return;
      }

      const data = await response.json();
      console.log(t('Registration successful:'), data);
      navigate('/auth/login');
    } catch (error) {
      console.error(t('Error registering:'), error);
      setError(t('Registration failed'));
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <h1>{t('Register')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form">
              <input
                type="text"
                className="form__input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder=" "
              />
              <label className="form__label">{t('User Name')}</label>
            </div>
          </div>
          <div className="form-group">
            <div className="form">
              <input
                type="email"
                className="form__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
              />
              <label className="form__label">{t('Email')}</label>
            </div>
          </div>
          <div className="form-group">
            <div className="form">
              <input
                type="password"
                className="form__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
              />
              <label className="form__label">{t('Password')}</label>
            </div>
          </div>
          <div className="form-group">
            <div className="form">
              <input
                type="password"
                className="form__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
              />
              <label className="form__label">{t('Confirm Password')}</label>
            </div>
          </div>
          <div className="role-info">
            <p>{t('You will be registered with the')} <strong>{t('User')}</strong> {t('role.')}</p>
          </div>

          <button type="submit">{t('Register')}</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <div className="login-link">
          {t('Already have an account?')} <Link to="/auth/login" className="custom-underline">{t('Log in here')}</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterUserPage;