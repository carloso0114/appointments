import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import decodeToken from '../utils/decodeToken';
import styles from './DoctorView.module.css'; // Import the CSS module
import AppointmentForm from '../components/AppointmentForm';

function DoctorView() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false); // State to toggle create form visibility
  const [showEditForm, setShowEditForm] = useState(false); // State to toggle edit form visibility
  const [patients, setPatients] = useState([]);
  const [createFormData, setCreateFormData] = useState({
    dateTime: '',
    type: '',
    room: '',
    patientId: ''
  });
  const [editFormData, setEditFormData] = useState({
    id: '',
    dateTime: '',
    type: '',
    room: '',
    patientId: ''
  });

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      const doctorId = decoded.id;
      try {
        const response = await axiosInstance.get(`/appointments/doctor/${doctorId}`);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError(response.data.message);
      }
    } else {
      setError('No token found');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Your Appointments</h1>
      {appointments.length === 0 ? (
        <p className={styles.noAppointmentsMessage}>No tienes citas pendientes</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Patient Name</th>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Time</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Room</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr
                key={appointment.id}
                className={index % 2 === 0 ? '' : styles.tbodyTrOdd}
              >
                <td className={styles.td}>{appointment.patientName}</td>
                <td className={styles.td}>{new Date(appointment.dateTime).toLocaleDateString()}</td>
                <td className={styles.td}>{new Date(appointment.dateTime).toLocaleTimeString()}</td>
                <td className={styles.td}>{appointment.type}</td>
                <td className={styles.td}>{appointment.room}</td>
                <td className={styles.td}>
                  <button onClick={() => handleEdit(appointment)}>Edit</button>
                  <button onClick={() => handleDeleteAppointment(appointment.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


export default DoctorView;
