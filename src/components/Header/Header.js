import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active-link' : ''}`}>Статистика</Link>
          </li>
          <li className="nav-item">
            <Link to="/losses" className={`nav-link ${location.pathname === '/losses' ? 'active-link' : ''}`}>Расходы</Link>
          </li>
          <li className="nav-item">
            <Link to="/profits" className={`nav-link ${location.pathname === '/profits' ? 'active-link' : ''}`}>Доходы</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
