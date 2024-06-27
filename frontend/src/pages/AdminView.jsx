import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import styles from './AdminView.module.css';

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'paciente', area: '', room: '' });
  const [selectedRole, setSelectedRole] = useState('paciente');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axiosInstance.post('/users', newUser);
      setUsers([...users, response.data]);
      setNewUser({ username: '', password: '', role: 'paciente', area: '', room: '' });
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

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    setNewUser({ ...newUser, role });
  };

  const renderTable = (title, users, isDoctorTable = false) => (
    <div>
      <h2>{title}</h2>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Username</th>
            {isDoctorTable && (
              <>
                <th className={styles.th}>Area</th>
                <th className={styles.th}>Room</th>
              </>
            )}
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={styles.tr}>
              <td className={styles.td}>{user.username}</td>
              {isDoctorTable && (
                <>
                  <td className={styles.td}>{user.area}</td>
                  <td className={styles.td}>{user.room}</td>
                </>
              )}
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

  const doctors = users.filter(user => user.role === 'doctor');
  const pacientes = users.filter(user => user.role === 'paciente');
  const admins = users.filter(user => user.role === 'admin');

  return (
    <div className={styles.container}>
      <h1>Admin View</h1>

      {/* Form for creating new user */}
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); createUser(); }}>
        <input
          type="text"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Password"
          required
        />
        <select
          name="role"
          value={selectedRole}
          onChange={handleRoleChange}
          required
        >
          <option value="paciente">Paciente</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>

        {/* Conditionally render fields for doctors */}
        {selectedRole === 'doctor' && (
          <>
            <input
              type="text"
              value={newUser.area}
              onChange={(e) => setNewUser({ ...newUser, area: e.target.value })}
              placeholder="Area"
              required
            />
            <input
              type="text"
              value={newUser.room}
              onChange={(e) => setNewUser({ ...newUser, room: e.target.value })}
              placeholder="Room"
              required
            />
          </>
        )}

        <button type="submit">Create User</button>
      </form>

      {/* Render separate tables for each role */}
      {renderTable('Admins', admins)}
      {renderTable('Doctors', doctors, true)}
      {renderTable('Pacientes', pacientes)}
    </div>
  );
};

export default AdminView;
