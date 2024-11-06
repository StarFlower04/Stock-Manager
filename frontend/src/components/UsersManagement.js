import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    user_name: '',
    email: '',
    password: '',
    role_id: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('/users/all');
    setUsers(response.data);
  }

  const handleCreateUser = async () => {
    await axios.post('/admin/users/post', newUser);
    fetchUsers();
  }

  const handleUpdateUser = async (id, updatedUser) => {
    await axios.put(`/admin/users/put/${id}`, updatedUser);
    fetchUsers();
  }

  const handleDeleteUser = async (id) => {
    await axios.delete(`/admin/users/delete/${id}`);
    fetchUsers();
  }

  return (
    <div>
      <h2>Users Management</h2>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.user_name}</td>
              <td>{user.email}</td>
              <td>{user.role_id}</td>
              <td>
                <button onClick={() => handleUpdateUser(user.user_id, user)}>Update</button>
                <button onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Create New User</h3>
      <form onSubmit={handleCreateUser}>
        <input
          type="text"
          value={newUser.user_name}
          onChange={(e) => setNewUser({...newUser, user_name: e.target.value})}
          placeholder="User Name"
          required
        />
        <input
          type="email"
          value={newUser.email}
          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          placeholder="Password"
          required
        />
        <input
          type="text"
          value={newUser.role_id}
          onChange={(e) => setNewUser({...newUser, role_id: e.target.value})}
          placeholder="Role ID"
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default UsersManagement;