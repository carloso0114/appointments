import express from 'express';
import { User, Appointment } from '../models.js';
import authenticateJWT from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticateJWT, async (req, res) => {
  const { dateTime, patientId, doctorId } = req.body;

  // Extract the authenticated user ID from the JWT token
  const authenticatedUserId = req.user.id;

  try {
    // Fetch the authenticated user details
    const authenticatedUser = await User.findByPk(authenticatedUserId);

    // Check if the authenticated user is an admin
    if (authenticatedUser.role !== 'admin' && patientId !== authenticatedUserId) {
      return res.status(403).json({ error: 'Unauthorized to create appointment for another patient' });
    }

    // Verify if the doctorId exists in the User table
    const doctor = await User.findOne({ where: { id: doctorId, role: 'doctor' } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const paciente = await User.findOne({ where: { id: patientId, role: 'paciente' } });
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente not found' });
    }

    // Create the appointment
    const newAppointment = await Appointment.create({
      dateTime,
      patientId,
      doctorId,
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Get all appointments for a doctor with patient's username
router.get('/doctor/:doctorId', authenticateJWT, async (req, res) => {
  const { doctorId } = req.params;
  const { id, role } = req.user;

  try {
    // Verify if the doctorId exists and has a room number
    const doctor = await User.findOne({ where: { id: doctorId, role: 'doctor' } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Find appointments where the doctorId matches
    const appointments = await Appointment.findAll({
      where: { doctorId },
      include: [{
        model: User,
        as: 'Patient', // Alias for the patient user
        attributes: ['id', 'username'] // Include only username from User model
      }]
    });

    // If no appointments found return empty array
    if (!appointments || appointments.length === 0) {
      return res.status(200).json([]);
    }
    
    // Format appointments to include patient's username and doctor's room
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      dateTime: appointment.dateTime, // Adjust as per your appointment model
      type: appointment.type,
      area: doctor.area,
      room: doctor.room,
      patientId: appointment.patientId,
      patientName: appointment.Patient.username // Extract username from included Patient
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get all appointments for a patient, including doctor's username
router.get('/patient/:patientId', authenticateJWT, async (req, res) => {
  const { patientId } = req.params;
  const { id: tokenUserId } = req.user;

  if (parseInt(patientId, 10) !== tokenUserId) {
    return res.status(403).json({ message: 'You can only access your own appointment information' });
  }

  try {
    const patient = await User.findByPk(patientId, { 
      include: [
        { 
          model: Appointment, 
          as: 'PatientAppointments', 
          include: [{ model: User, as: 'Doctor', attributes: ['username'] }] // Include doctor's username
        }
      ] 
    });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    // Map appointments to include doctor's username
    const appointments = patient.PatientAppointments.map(appointment => ({
      id: appointment.id,
      dateTime: appointment.dateTime,
      type: appointment.type,
      room: appointment.room,
      doctorUsername: appointment.Doctor.username // Access doctor's username
    }));

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// PATCH (partial update) an appointment
router.patch('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { dateTime, type, room, doctorId, patientId } = req.body;
  const { role } = req.user;

  // If user is a patient
  if (role === 'paciente') {
    return res.status(403).json({ message: 'Patients are not allowed to update appointments' });
  }

  // Validate required fields
  if (!(dateTime || type || room || doctorId || patientId)) {
    return res.status(400).json({ error: 'At least one field (dateTime, type, room, doctorId, patientId) must be provided' });
  }

  try {
    const appointment = await Appointment.findByPk(id);
    if (appointment) {
      // Update appointment if at least one field is provided
      if (dateTime !== undefined) appointment.dateTime = dateTime;
      if (type !== undefined) appointment.type = type;
      if (room !== undefined) appointment.room = room;
      if (doctorId !== undefined) appointment.doctorId = doctorId;
      if (patientId !== undefined) appointment.patientId = patientId;

      await appointment.save();

      res.json(appointment);
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// DELETE an appointment by ID
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  // Check user role
  if (role === 'paciente') {
    return res.status(403).json({ message: 'Patients are not allowed to delete appointments' });
  }

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.destroy();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
