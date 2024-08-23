import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className='sidebar d-flex flex-column justify-content-between bg-[#557C55] text-white p-4 vh-100 fixed top-0 left-0 bottom-0 w-70'>
      <div>
        <div className="dropdown mb-3">
          <a 
            href="#" 
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" 
            onClick={toggleDropdown}
            data-bs-toggle="dropdown" 
            aria-expanded={dropdownOpen}
          >
            <img 
              src="https://via.placeholder.com/40" 
              alt="profile" 
              className="rounded-circle me-2" 
              width="40" 
              height="40"
            />
            <span className='fs-5'>Admin</span>
          </a>
          <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} style={{ backgroundColor: '#557C55', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', position: 'absolute' }}>
            <li>
              <Link to="/view_profile" className="dropdown-item text-white" style={{ backgroundColor: '#557C55' }} onMouseOver={(e) => e.target.style.backgroundColor = '#6EA46E'} onMouseOut={(e) => e.target.style.backgroundColor = '#557C55'}>
                <i className="bi bi-person me-2"></i>View Profile
              </Link>
            </li>
            <li>
              <Link to="/change_password" className="dropdown-item text-white" style={{ backgroundColor: '#557C55' }} onMouseOver={(e) => e.target.style.backgroundColor = '#6EA46E'} onMouseOut={(e) => e.target.style.backgroundColor = '#557C55'}>
                <i className="bi bi-key me-2"></i>Change Password
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-3">
          <a href="#" className="d-flex align-items-center text-white text-decoration-none">
            <i className='fs-5 me-2'></i>
            <span className='text-based'>Dashboard</span>
          </a>
        </div>

        <hr className='border-white border-2 mt-2'></hr>

        <ul className='nav nav-pills flex-column px-0'>
          <li className='nav-item py-1'>
            <Link to="/" className='nav-link text-white d-flex align-items-center px-2'>
              <i className='bi bi-phone-vibrate-fill fs-5 me-2'></i>
              <span className='fs-5 mb-0'>Incoming Requests</span>
            </Link>
          </li>
          <li className='nav-item py-1'>
            <Link to="/assign_rescuer" className='nav-link text-white d-flex align-items-center px-2'>
              <i className='bi bi-people-fill fs-5 me-2'></i>
              <span className='fs-5 mb-0'>Assign Rescuer</span>
            </Link>
          </li>
          <li className='nav-item py-1'>
            <Link to="/ongoing_rescues" className='nav-link text-white d-flex align-items-center px-2'>
              <i className='bi bi-arrow-repeat fs-5 me-2'></i>
              <span className='fs-5 mb-0'>On Going Rescues</span>
            </Link>
          </li>
          <li className='nav-item py-1'>
            <Link to="/generate_reports" className='nav-link text-white d-flex align-items-center px-2'>
              <i className='bi bi-printer-fill fs-5 me-2'></i>
              <span className='fs-5 mb-0'>Generate Reports</span>
            </Link>
          </li>
          <li className='nav-item py-1'>
            <Link to="/settings" className='nav-link text-white d-flex align-items-center px-2'>
              <i className='bi bi-gear-fill fs-5 me-2'></i>
              <span className='fs-5 mb-0'>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <hr className='border-white border-2 mt-2'></hr>
        <Link to="/logout" className='nav-link text-white d-flex align-items-center px-2'>
          <i className='bi bi-box-arrow-right fs-5 me-2'></i>
          <span className='fs-5 mb-0'>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
