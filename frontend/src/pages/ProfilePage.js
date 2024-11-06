import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProfilePage.css';
import backgroundImage from '../assets/images/blurred-background.jpg';

const ProfilePage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const formatDateUTC = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/payment');
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('User not authenticated'));
        return;
      }
  
      const response = await fetch('http://localhost:3000/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          setError(t('Unauthorized'));
          localStorage.removeItem('token');
          navigate('/auth/login'); 
        } else {
          const errorData = await response.json();
          setError(errorData.message || t('Error fetching profile'));
        }
        return;
      }
  
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      setError(t('Error fetching profile'));
    }
  }, [navigate, t]);  

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);  

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); 
    setNewAvatar(URL.createObjectURL(event.target.files[0]));
  };

  const handleConfirmChange = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError(t('User not authenticated'));
        return;
      }

      const formData = new FormData();
      formData.append('avatar', selectedFile); 

      const response = await fetch('http://localhost:3000/users/profile/avatar', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t('Error updating avatar'));
        return;
      }

      setShowModal(false);
      setNewAvatar(null);
      setSelectedFile(null); 
      setShowConfirmDialog(false);
      await fetchUserProfile();
    } catch (error) {
      setError(t('Error updating avatar'));
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirmDialog(true); 
  };

  const handleCancelConfirm = () => {
    setNewAvatar(null);
    setSelectedFile(null); 
    setShowModal(false);
    setShowCancelConfirmDialog(false);
  };

  const handleCancelCancel = () => {
    setShowCancelConfirmDialog(false); 
  };

  const handleManageWarehouse = () => {
    navigate('/warehouse-management');
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!userProfile) {
    return <div>{t('Loading...')}</div>;
  }

  return (
    <div className="profile-page"
      style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}>
      <div className="profile-container">
         <div className="avatar-section">
            <div className="avatar-container">
            {userProfile.avatar ? (
          <img
            src={`http://localhost:3000${userProfile.avatar}`}
            alt={t('User Avatar')}
            className="user-avatar"
          />
        ) : (
            <div className="avatar-placeholder">{t('No Avatar')}</div>
          )}
            <button className="change-avatar-button" onClick={() => setShowModal(true)}>{t('Change Avatar')}</button>
      </div>
    </div>
  
  <div className="profile-info">
    <div><strong>{t('Username')}:</strong> {userProfile.user_name}</div>
    <div><strong>{t('Email')}:</strong> {userProfile.email}</div>
    <div><strong>{t('Created At')}:</strong> {formatDateUTC(userProfile.created_at)}</div>
    <div><strong>{t('Role')}:</strong> {userProfile.role.role_name}</div>

    {userProfile.role.role_name === 'Warehouse Manager' && (
  <div className="promo-block">
    <div className="promo-text">
      <h3>{t('Manage Your Warehouse!')}</h3>
      <p>{t('Access tools to organize and optimize your warehouse operations.')}</p>
    </div>
    <button className="upgrade-button" onClick={handleManageWarehouse}>
      {t('Manage Warehouse')}
    </button>
  </div>
)}

    {userProfile.role.role_name === 'User' && (
  <div className="promo-block">
    <div className="promo-text">
      <h3>{t('Upgrade Your Plan!')}</h3>
      <p>{t('Connect your business (warehouse) to our system and automate your processes.')}</p>
    </div>
    <button className="upgrade-button" onClick={handleUpgrade}>{t('Upgrade Now')}</button>
  </div>
)}

    </div>
  </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{t('Change Avatar')}</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {newAvatar && <img src={newAvatar} alt={t('New Avatar Preview')} className="avatar-preview" />}
            <div className="modal-buttons">
              <button onClick={handleConfirmChange}>{t('Confirm')}</button>
              <button onClick={handleConfirmCancel}>{t('Cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="confirm-update">
          <div className="confirm-update-content">
            <h2>{t('Confirm Update')}</h2>
            <p>{t('Are you sure you want to update your avatar?')}</p>
            <button onClick={handleConfirmUpdate}>{t('Yes')}</button>
            <button onClick={() => setShowConfirmDialog(false)}>{t('No')}</button>
          </div>
        </div>
      )}

      {showCancelConfirmDialog && (
        <div className="confirm-cancel">
          <div className="confirm-cancel-content">
            <h2>{t('Cancel Changes')}</h2>
            <p>{t('Are you sure you want to cancel the changes?')}</p>
            <button onClick={handleCancelConfirm}>{t('Yes')}</button>
            <button onClick={handleCancelCancel}>{t('No')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;