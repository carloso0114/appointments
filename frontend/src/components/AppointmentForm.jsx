import styles from './AppointmentForm.module.css'

function AppointmentForm({ formData, patients, onChange, onSubmit, formType }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2>{formType === 'create' ? 'Add Appointment' : 'Edit Appointment'}</h2>
      <label>
        Date:
        <input
          type="date"
          name="dateTime"
          value={formData.dateTime}
          onChange={onChange}
          required
        />
      </label>
      <label>
        Time:
        <input
          type="time"
          name="time"
          value={formData.time || ''}
          onChange={onChange}
          required
        />
      </label>
      <label>
        Type:
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={onChange}
          required // Allow user to input any value for appointment type
        />
      </label>
      <label>
        Room:
        <input
          type="text"
          name="room"
          value={formData.room}
          onChange={onChange}
          required
        />
      </label>
      {formType === 'create' && (
        <label>
          Patient:
          <select
            name="patientId"
            value={formData.patientId}
            onChange={onChange}
            required
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.username}</option>
            ))}
          </select>
        </label>
      )}
      <button type="submit">{formType === 'create' ? 'Submit' : 'Update'}</button>
    </form>
  );
}
export default AppointmentForm