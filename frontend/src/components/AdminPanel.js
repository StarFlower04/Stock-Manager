import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [apiData, setApiData] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api-json');
        setApiData(response.data);
      } catch (error) {
        console.error('Error fetching API data', error);
      }
    };
    fetchApiData();
  }, []);

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    setResponse(null);
  };

  const handleRequestSubmit = async (path, method) => {
    try {
      const url = `http://localhost:3000${path.replace('{id}', formData.id || '')}`;
      let requestData = {};

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        throw new Error('No token found');
      }

      if (method !== 'GET' && method !== 'DELETE') {
        requestData = formData.data ? JSON.parse(formData.data) : {};
      }

      const result = await axios({
        method: method.toLowerCase(),
        url,
        data: requestData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setResponse(result.data);
      setShowModal(false); // Close the modal after the request is sent
    } catch (error) {
      console.error('Request error:', error);
      setResponse(error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderMenu = () => {
    if (!apiData || !apiData.paths) {
      return <p>Loading resources...</p>;
    }

    const resources = Object.keys(apiData.paths).reduce((acc, path) => {
      const resource = path.split('/')[1];
      if (!acc.includes(resource)) {
        acc.push(resource);
      }
      return acc;
    }, []);

    return (
      <div className="menu">
        <h2>Resources</h2>
        <ul>
          {resources.map((resource, index) => (
            <li key={index} onClick={() => handleResourceClick(resource)}>
              {resource}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderRequestForm = (path, method) => {
    const isIdRequired = path.includes('{id}');
    const isPostOrPut = method === 'post' || method === 'put'; 
  
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRequestSubmit(path, method);
        }}
        className="request-form"
      >
        {isIdRequired && (
          <div>
            <label>ID:</label>
            <input
              type="text"
              placeholder="Enter ID"
              name="id"
              value={formData.id || ''}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isPostOrPut && (
          <div>
            <label>JSON Data:</label>
            <textarea
              name="data"
              placeholder="Enter JSON data"
              value={formData.data || ''}
              onChange={handleInputChange}
            />
          </div>
        )}
        <button type="submit">Send {method.toUpperCase()} request</button>
      </form>
    );
  };

  const renderRequests = () => {
    if (!selectedResource) {
      return <p>Select a resource to view requests</p>;
    }

    const paths = Object.keys(apiData.paths).filter((path) =>
      path.startsWith(`/${selectedResource}`)
    );

    return (
      <div className="requests">
        <h2>{selectedResource}</h2>
        <div className="request-container">
          <div className="request-methods">
            {paths.map((path, index) => (
              <div key={index}>
                <h3>{path}</h3>
                {Object.keys(apiData.paths[path]).map((method, i) => (
                  <div key={i}>
                    <strong>{method.toUpperCase()}</strong>
                    {renderRequestForm(path, method)}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="response-block">
            {response && (
              <div className="response">
                <h2>Response</h2>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-panel">
      <div className="sidebar">{renderMenu()}</div>
      <div className="content">
        {renderRequests()}
      </div>
    </div>
  );
};

export default AdminPanel;