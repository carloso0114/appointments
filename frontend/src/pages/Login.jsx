import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import styles from './Login.module.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Revisa si el token ya existe en el localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decodifica el token para leer el role
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userRole = decodedToken.role;

      // Redireccion basada en el rol
      switch (userRole) {
        case 'paciente':
          navigate('/paciente');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
          break;
      }
    }
  }, [navigate]);

  // Funcion para iniciar sesion y guardar el token en el localstorage
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axiosInstance.post('auth/login', {
        username,
        password
      });
      
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Decode the JWT token to read the user's role
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userRole = decodedToken.role;

      // Redirect based on the user's role
      switch (userRole) {
        case 'paciente':
          navigate('/paciente');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
          break;
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="username">Username:</label>
          <input className={styles.input} type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">Password:</label>
          <input className={styles.input} type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className={styles.button} type="submit">Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Login;
