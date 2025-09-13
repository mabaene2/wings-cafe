import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{
      textAlign: 'center',
      padding: '10px 0',
      borderTop: '1px solid #ccc',
      marginTop: '20px',
      position: 'relative',
      width: '100%'
    }}>
      &copy; {currentYear} Wings Cafe. All rights reserved.
    </footer>
  );
};

export default Footer;
