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

  const handleDeleteAppointment = async (id) => {
    try {
      await axiosInstance.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('Failed to delete appointment. Please try again.');
    }
  };

  useEffect(() => {
    fetchAppointments();
    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get('/users/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm); // Toggle create form visibility
  };

  const toggleEditForm = () => {
    setShowEditForm(!showEditForm); // Toggle edit form visibility
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData({
      ...createFormData,
      [name]: value
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const decoded = decodeToken(token);
      const doctorId = decoded.id;

      const postData = {
        ...createFormData,
        doctorId: doctorId,
        dateTime: createFormData.dateTime + ' ' + createFormData.time // Concatenate date and time
      };

      const response = await axiosInstance.post('/appointments', postData);
      fetchAppointments();
      setShowCreateForm(false); // Hide create form after submission
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('Failed to create appointment. Please try again.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const patchData = {
        dateTime: editFormData.dateTime + ' ' + editFormData.time, // Concatenate date and time
        type: editFormData.type,
        room: editFormData.room
      };

      const appointmentId = editFormData.id;

      const response = await axiosInstance.patch(`/appointments/${appointmentId}`, patchData);
      fetchAppointments();
      setShowEditForm(false); // Hide edit form after submission
      // setEditFormData()
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment. Please try again.');
    }
  };

  const handleEdit = (appointment) => {
    setEditFormData({
      id: appointment.id,
      dateTime: appointment.dateTime.split('T')[0], // Extract date part
      time: appointment.dateTime.split('T')[1].substring(0, 5), // Extract time part (hh:mm format)
      type: appointment.type,
      room: appointment.room,
      patientId: appointment.patientId // Assuming you want to display patientId in the form
    });
    toggleEditForm(); // Show the edit form after setting editFormData
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Your Appointments</h1>
      <button onClick={toggleCreateForm}>Add Appointment</button>

      {showCreateForm && (
        <AppointmentForm
          formData={createFormData}
          patients={patients}
          onChange={handleCreateChange}
          onSubmit={handleCreateSubmit}
          formType="create"
        />
      )}

      {appointments.length === 0 ? (
        <p className={styles.noAppointmentsMessage}>No appointments available</p>
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

      {showEditForm && (
        <AppointmentForm
          formData={editFormData}
          patients={patients}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          formType="edit"
        />
      )}
    </div>
  );
}


export default DoctorView;
