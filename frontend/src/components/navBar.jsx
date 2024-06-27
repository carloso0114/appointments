import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './navbar.css'; // Import the CSS file

function Navbar() {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  let username = '';
  
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      username = decodedToken.username;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        const response = await axios.get('http://worldtimeapi.org/api/timezone/America/New_York');
        setCurrentDateTime(response.data.datetime);
      } catch (error) {
        console.error('Error fetching date and time:', error);
      }
    };

    fetchDateTime();
    const interval = setInterval(fetchDateTime, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-link">Home</Link>
        <div className="navbar-datetime">
          Current Date and Time: {new Date(currentDateTime).toLocaleString()}
        </div>
        {token && (
          <div className="navbar-user">
            <span className="navbar-username">Welcome, {username}</span>
            <button className="navbar-button" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;