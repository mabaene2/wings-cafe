import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const Dashboard = ({ products }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalSales: 0
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching dashboard data:', err));
  }, []);

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ marginRight: 'auto' }}>Stock Inventory System</h2>
        <h1 style={{ textAlign: 'center', flexGrow: 1 }}>Product Menu</h1>
      </div>
      <div className="stats-grid" style={{ justifyContent: 'center' }}>
        <div className="stat-card" style={{ margin: '0 15px' }}>
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card warning" style={{ margin: '0 15px' }}>
          <h3>Low Stock Items</h3>
          <p className="stat-number">{stats.lowStockItems}</p>
        </div>
        <div className="stat-card" style={{ margin: '0 15px' }}>
          <h3>Total Sales</h3>
          <p className="stat-number">M{stats.totalSales.toFixed(2)}</p>
        </div>
      </div>

      <div className="product-menu">
        {products && products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">M{product.price.toFixed(2)}</p>
                  <p className={`product-availability ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.quantity > 0 ? `Available (${product.quantity})` : 'Out of Stock'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
