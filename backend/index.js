import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './database.js';
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import { User } from './models.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

async function createDefaultUser() {
  try {
    await sequelize.sync(); // Sync Sequelize models with the database (if necessary)

    // Check if the default user already exists
    const existingUser = await User.findOne({ where: { username: 'admin' } });
    if (existingUser) {
      console.log('Default user already exists:', existingUser.username);
      return;
    }

    // Create the default user
    const defaultUser = await User.create({
      username: 'admin',
      password: '123456', 
      role: 'admin'
    });

    console.log('Default user created:', defaultUser.username);
  } catch (error) {
    console.error('Error creating default user:', error);
  }
}

// Call the function to create the default user when the application starts
createDefaultUser();

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server Citas medicas is running on http://localhost:3000');
  });
});