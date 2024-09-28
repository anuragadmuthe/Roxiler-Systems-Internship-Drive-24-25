const express = require('express');
const cors = require('cors');
const data = require('./product_transaction.json'); // Load the data

const app = express();
app.use(cors());

// API endpoint to get transactions filtered by month
app.get('/transactions', (req, res) => {
    const { month } = req.query;
    const filteredData = data.filter(item => {
        const saleDate = new Date(item.dateOfSale);
        return saleDate.getMonth() + 1 === parseInt(month); // Month is 0-indexed, so add 1
    });
    res.json(filteredData);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
