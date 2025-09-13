const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// In-memory data
// --------------------
let products = [
  {
    id: 1,
    name: "Burger",
    description: "Delicious beef burger with cheese and lettuce",
    category: "Food",
    price: 25,
    quantity: 100,
    lowStockThreshold: 10,
    imageUrl: "https://via.placeholder.com/150x150?text=Burger"
  },
  {
    id: 2,
    name: "Chicken Wings",
    description: "Spicy grilled chicken wings",
    category: "Food",
    price: 30,
    quantity: 80,
    lowStockThreshold: 10,
    imageUrl: "https://via.placeholder.com/150x150?text=Wings"
  },
  {
    id: 3,
    name: "Dessert",
    description: "Sweet chocolate dessert",
    category: "Food",
    price: 15,
    quantity: 50,
    lowStockThreshold: 5,
    imageUrl: "https://via.placeholder.com/150x150?text=Dessert",
  },
  {
    id: 4,
    name: "Coffee",
    description: "Freshly brewed coffee",
    category: "Beverage",
    price: 20,
    quantity: 50,
    lowStockThreshold: 10,
    imageUrl: "https://via.placeholder.com/150x150?text=Coffee"
  },
  {
    id: 5,
    name: "Tea",
    description: "Hot green tea",
    category: "Beverage",
    price: 15,
    quantity: 30,
    lowStockThreshold: 10,
    imageUrl: "https://via.placeholder.com/150x150?text=Tea"
  },
  {
    id: 6,
    name: "Soda",
    description: "Chilled soda drink",
    category: "Beverage",
    price: 10,
    quantity: 60,
    lowStockThreshold: 10,
    imageUrl: "https://via.placeholder.com/150x150?text=Soda"
  },
  {
    id: 7,
    name: "Fries",
    description: "Crispy french fries",
    category: "Food",
    price: 12,
    quantity: 70,
    lowStockThreshold: 10,
    imageUrl: "https://via.placeholder.com/150x150?text=Fries"
  },
  {
    id: 8,
    name: "Salad",
    description: "Fresh garden salad",
    category: "Food",
    price: 18,
    quantity: 40,
    lowStockThreshold: 5,
    imageUrl: "https://via.placeholder.com/150x150?text=Salad"
  }
];



let sales = []; // For storing sales

// --------------------
// Product routes
// --------------------

// Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Add a product
app.post("/api/products", (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product
app.put("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// Delete a product
app.delete("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  products = products.filter(p => p.id !== productId);
  res.json({ message: "Deleted successfully" });
});



// --------------------
// Sales routes
// --------------------

// Get all sales
app.get("/api/sales", (req, res) => {
  res.json(sales);
});

// Add a new sale
app.post("/api/sales", (req, res) => {
  const sale = {
    id: Date.now(),
    customerName: req.body.customerName || 'Anonymous', // Default if not provided
    items: req.body.items,
    totalAmount: req.body.totalAmount,
    date: new Date()
  };

  // Update product quantities
  sale.items.forEach(item => {
    const product = products.find(p => p.id === parseInt(item.productId));
    if (product) product.quantity -= item.quantity;
  });

  sales.push(sale);
  res.status(201).json(sale);
});

// --------------------
// Dashboard route
// --------------------
app.get("/api/dashboard", (req, res) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= 10).length;
  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  res.json({ totalProducts, lowStockProducts, totalSales });
});

// --------------------
// Start server
// --------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
