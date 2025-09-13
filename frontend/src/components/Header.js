import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const modules = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products", path: "/products" },
    { name: "Sales", path: "/sales" },
    { name: "Inventory", path: "/inventory" },
    { name: "Reporting", path: "/reporting" },
  ];

  return (
    <header className="header">
      <div className="header-left" style={{ flexGrow: 1 }}>
      </div>

      <nav className="header-nav" style={{ textAlign: 'center' }}>
        {modules.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            style={{ margin: '0 10px' }}
          >
            {mod.name}
          </NavLink>
        ))}
      </nav>

      <div className="user-info" style={{ display: 'none' }}>
        <span>Welcome, Admin</span>
        <div className="user-avatar">A</div>
      </div>
    </header>
  );
};

export default Header;
