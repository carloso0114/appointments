import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import styles from './AdminView.module.css';

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'paciente' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('users'); 
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axiosInstance.post('users', newUser); 
      setUsers([...users, response.data]);
      setNewUser({ username: '', password: '', role: 'paciente' }); 
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`); 
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
<div className={styles.container}>
      <h1>Admin View</h1>

      {/* Form for creating new user */}
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); createUser(); }}>
        <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} placeholder="Username" required />
        <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Password" required />
        <select name="role" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} required>
          <option value="paciente">Paciente</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create User</button>
      </form>

      {/* List of users */}
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Username</th>
            <th className={styles.th}>Role</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={styles.tr}>
              <td className={styles.td}>{user.username}</td>
              <td className={styles.td}>{user.role}</td>
              <td className={styles.td}>
                <button className={styles.button} onClick={() => deleteUser(user.id)}>Delete</button>
                {/* Add edit functionality if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminView;