import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import decodeToken from '../utils/decodeToken';
import styles from './PacienteView.module.css'; // Import your CSS module

function PacienteView() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); // State to store list of doctors
  const [error, setError] = useState('');
  const [newAppointment, setNewAppointment] = useState({ dateTime: '', doctorId: '' });
  const [updateAppointment, setUpdateAppointment] = useState({ id: '', dateTime: '' });
  const [isUpdating, setIsUpdating] = useState(false); // State to manage which form to display

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

  useEffect(() => {
    fetchAppointments()
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/users/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to fetch doctors. Please try again.');
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, []);

  const deleteAppointment = async (appointmentId) => {
    try {
      await axiosInstance.delete(`/appointments/${appointmentId}`);
      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('Failed to delete appointment. Please try again.');
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const decoded = decodeToken(token);
      const patientId = decoded.id;
      const response = await axiosInstance.post('/appointments', { ...newAppointment, patientId });
      setAppointments([...appointments, response.data]);
      setNewAppointment({ dateTime: '', doctorId: '' });
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(`/appointments/${updateAppointment.id}`, { dateTime: updateAppointment.dateTime });
      setUpdateAppointment({ id: '', dateTime: '' });
      setIsUpdating(false); // Reset to show the create form
      fetchAppointments()
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment. Please try again.');
    }
  };

  const getCurrentDateTime = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    const hh = String(today.getHours()).padStart(2, '0');
    const min = String(today.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

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
              <th className={styles.th}>Actions</th>
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
                <td className={styles.td}>
                  <button onClick={() => {
                    setUpdateAppointment({ id: appointment.id, dateTime: appointment.dateTime });
                    setIsUpdating(true);
                  }}>Update</button>
                  <button onClick={() => deleteAppointment(appointment.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isUpdating ? (
        <div>
          <h2>Create New Appointment</h2>
          <form onSubmit={handleCreateAppointment}>
            <input
              type="datetime-local"
              value={newAppointment.dateTime}
              min={getCurrentDateTime()} // Set the minimum date and time to the current date and time
              onChange={(e) => setNewAppointment({ ...newAppointment, dateTime: e.target.value })}
              required
            />
            <select
              value={newAppointment.doctorId}
              onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.username}
                </option>
              ))}
            </select>
            <button type="submit">Create Appointment</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Update Appointment</h2>
          <form onSubmit={handleUpdateAppointment}>
            <input
              type="datetime-local"
              value={updateAppointment.dateTime}
              min={getCurrentDateTime()} // Set the minimum date and time to the current date and time
              onChange={(e) => setUpdateAppointment({ ...updateAppointment, dateTime: e.target.value })}
              required
            />
            <button type="submit">Update Appointment</button>
            <button type="button" onClick={() => setIsUpdating(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PacienteView;
