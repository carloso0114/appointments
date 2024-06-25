import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import decodeToken from '../utils/decodeToken';
import styles from './PacienteView.module.css'; // Import your CSS module

function PacienteView() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      if (token) {
        const decoded = decodeToken(token);
        const patientId = decoded.id; // Assuming patientId is decoded from token, adjust as necessary
        try {
          const response = await axiosInstance.get(`/appointments/patient/${patientId}`);
          if (response.data.message) {
            setError(response.data.message);
          } else {
            setAppointments(response.data);
          }
        } catch (error) {
          console.error('Error fetching appointments:', error);
          setError('Failed to fetch appointments. Please try again.');
        }
      } else {
        setError('No token found');
      }
    };

    fetchAppointments();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Your Appointments</h1>
      {appointments.length === 0 ? (
        <p className={styles.noAppointmentsMessage}>No appointments available</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Time</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Room</th>
              <th className={styles.th}>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id} className={styles.tbodyTr}>
                <td className={styles.td}>{new Date(appointment.dateTime).toLocaleDateString()}</td>
                <td className={styles.td}>{new Date(appointment.dateTime).toLocaleTimeString()}</td>
                <td className={styles.td}>{appointment.type}</td>
                <td className={styles.td}>{appointment.room}</td>
                <td className={styles.td}>{appointment.doctorUsername}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PacienteView;
