import React, { useState, useEffect } from 'react';

function Reporting() {
  const [reportData, setReportData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    mostSoldProducts: []
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/sales')
      .then(res => res.json())
      .then(sales => {
        const totalSales = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

        const productCounts = {};
        sales.forEach(sale => {
          sale.items.forEach(item => {
            if (!productCounts[item.productName]) {
              productCounts[item.productName] = 0;
            }
            productCounts[item.productName] += item.quantity;
          });
        });

        const mostSoldProducts = Object.entries(productCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, quantity]) => ({ name, quantity }));

        setReportData({ totalSales, totalRevenue, mostSoldProducts });
      })
      .catch(err => console.error('Error fetching sales for report:', err));
  }, []);

  return (
    <div
      className="reporting-module"
      style={{
        maxWidth: '1000px',
        margin: '30px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#333' }}>Reporting</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}
      >
        <div
          className="report-summary"
          style={{
            flex: '1',
            minWidth: '200px',
            fontSize: '18px',
            color: '#555',
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 0 5px rgba(0,0,0,0.05)'
          }}
        >
          <p>
            <strong>Total Sales:</strong> {reportData.totalSales}
          </p>
          <p>
            <strong>Total Revenue:</strong> M{reportData.totalRevenue.toFixed(2)}
          </p>
        </div>

        <div
          className="most-sold-products"
          style={{
            flex: '2',
            minWidth: '300px',
            fontSize: '16px',
            color: '#444',
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 0 5px rgba(0,0,0,0.05)'
          }}
        >
          <h2 style={{ fontSize: '22px', marginBottom: '10px', color: '#222' }}>Most Sold Products</h2>
          {reportData.mostSoldProducts.length > 0 ? (
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
              {reportData.mostSoldProducts.map((product, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>
                  {product.name} - {product.quantity} sold
                </li>
              ))}
            </ul>
          ) : (
            <p>No sales data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reporting;
