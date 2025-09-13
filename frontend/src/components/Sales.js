import React, { useState, useEffect } from 'react';
import '../styles/Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    items: [{ productId: '', quantity: 1 }]
  });

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = () => {
    fetch('http://localhost:5000/api/sales')
      .then(res => res.json())
      .then(data => setSales(data))
      .catch(err => console.error('Error fetching sales:', err));
  };

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate total amount
    const itemsWithDetails = formData.items.map(item => {
      const product = products.find(p => p.id === parseInt(item.productId));
      if (!product) {
        throw new Error('Product not found for id ' + item.productId);
      }
      return {
        ...item,
        productName: product.name,
        unitPrice: product.price,
        subtotal: product.price * item.quantity
      };
    });
    
    const totalAmount = itemsWithDetails.reduce((sum, item) => sum + item.subtotal, 0);
    
    const saleData = {
      items: itemsWithDetails,
      totalAmount
    };
    
    fetch('http://localhost:5000/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    })
      .then(res => res.json())
      .then(() => {
        setShowForm(false);
        setFormData({
          items: [{ productId: '', quantity: 1 }]
        });
        fetchSales();
        fetchProducts(); // Refresh products to update quantities
      })
      .catch(err => console.error('Error recording sale:', err));
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }]
    });
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="sales" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fff8e1', padding: '20px' }}>
      <div>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#6f4e37', fontWeight: 'bold' }}>Sales</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            style={{ height: '40px', padding: '0 15px', backgroundColor: '#6f4e37', borderColor: '#6f4e37' }}
          >
            New Sale
          </button>
        </div>

        {showForm && (
          <div className="sale-form" style={{ marginTop: '20px', padding: '20px', border: '2px solid #6f4e37', borderRadius: '10px', backgroundColor: '#fff3e0' }}>
            <h2 style={{ color: '#6f4e37', marginBottom: '15px' }}>Record New Sale</h2>
            <form onSubmit={handleSubmit}>
              
              <div className="sale-items" style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#6f4e37', marginBottom: '10px' }}>Items</h3>
                {formData.items.map((item, index) => (
                  <div key={index} className="sale-item" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px', backgroundColor: '#fff8e1', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <div className="form-group" style={{ flex: '1' }}>
                      <label style={{ fontWeight: 'bold', color: '#6f4e37' }}>Product</label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      >
                        <option value="">Select a product</option>
                        {products.map(product => (
                          <option 
                            key={product.id} 
                            value={product.id}
                            disabled={product.quantity <= 0}
                          >
                            {product.name} {product.quantity <= 0 ? '(Out of Stock)' : `(Available: ${product.quantity})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ width: '100px' }}>
                      <label style={{ fontWeight: 'bold', color: '#6f4e37' }}>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </div>
                    {formData.items.length > 1 && (
                      <button 
                        type="button" 
                        className="btn btn-sm btn-delete"
                        onClick={() => removeItem(index)}
                        style={{ height: '35px', alignSelf: 'flex-end', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addItem} style={{ marginTop: '10px', backgroundColor: '#6f4e37', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                  Add Item
                </button>
              </div>
              
              <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: '1', backgroundColor: '#6f4e37', border: 'none', padding: '10px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>
                  Record Sale
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowForm(false)}
                  style={{ flex: '1', backgroundColor: '#aaa', border: 'none', padding: '10px', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="sales-table" style={{ marginTop: '30px', overflowX: 'auto' }}>
          <h2 style={{ color: '#6f4e37' }}>Sales History</h2>
          <table style={{ minWidth: '700px', borderCollapse: 'collapse', backgroundColor: '#fff8e1', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '2px solid #6f4e37', padding: '12px', textAlign: 'left', color: '#6f4e37' }}>Date</th>
                <th style={{ borderBottom: '2px solid #6f4e37', padding: '12px', textAlign: 'left', color: '#6f4e37' }}>Items</th>
                <th style={{ borderBottom: '2px solid #6f4e37', padding: '12px', textAlign: 'left', color: '#6f4e37' }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{new Date(sale.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    {sale.items.map(item => (
                      <div key={item.productId}>
                        {item.quantity}x {item.productName} (M{item.unitPrice} each)
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '12px' }}>M{sale.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer style={{ marginTop: 'auto', padding: '15px', backgroundColor: '#f1f1f1', textAlign: 'center' }}>
        &copy; 2024 Wings Cafe Inventory
      </footer>
    </div>
  );
};

export default Sales;