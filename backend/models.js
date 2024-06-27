import { DataTypes } from 'sequelize';
import sequelize from './database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('doctor', 'paciente', 'admin'),
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: true
  },
  room: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  
  user.password = await bcrypt.hash(user.password, salt);
});

// Define Appointment model
const Appointment = sequelize.define('Appointment', {
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  room: {
    type: DataTypes.STRING,
    allowNull: true
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// Associations
User.hasMany(Appointment, { as: 'PatientAppointments', foreignKey: 'patientId' });
User.hasMany(Appointment, { as: 'DoctorAppointments', foreignKey: 'doctorId' });
Appointment.belongsTo(User, { as: 'Patient', foreignKey: 'patientId' });
Appointment.belongsTo(User, { as: 'Doctor', foreignKey: 'doctorId' });

export { User, Appointment };