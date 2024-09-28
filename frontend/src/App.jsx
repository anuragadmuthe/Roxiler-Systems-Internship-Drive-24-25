import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import {
    Container,
    Typography,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Card,
    CardContent,
    Grid,
} from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [statistics, setStatistics] = useState({ totalSales: 0, totalSold: 0, totalNotSold: 0 });
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Number of Items',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    });

    useEffect(() => {
        if (selectedMonth) {
            fetchTransactions();
        }
    }, [selectedMonth]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`https://backend-roxiler-systems-internship-drive.onrender.com/transactions?month=${selectedMonth}`);
            setTransactions(response.data);

            // Calculate statistics
            let totalSales = 0, totalSold = 0, totalNotSold = 0;
            response.data.forEach((item) => {
                if (item.sold) {
                    totalSold += 1;
                    totalSales += item.price;
                } else {
                    totalNotSold += 1;
                }
            });

            setStatistics({ totalSales, totalSold, totalNotSold });
            generateChartData(response.data);
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    const generateChartData = (data) => {
        const priceRanges = { '0-100': 0, '101-500': 0, '501-1000': 0, '1000+': 0 };

        // Update the price ranges based on available data
        data.forEach((item) => {
            if (item.price <= 100) {
                priceRanges['0-100'] += 1;
            } else if (item.price <= 500) {
                priceRanges['101-500'] += 1;
            } else if (item.price <= 1000) {
                priceRanges['501-1000'] += 1;
            } else {
                priceRanges['1000+'] += 1;
            }
        });

        // Ensure that the datasets always have a valid structure
        setChartData({
            labels: Object.keys(priceRanges),
            datasets: [
                {
                    label: 'Number of Items',
                    data: Object.values(priceRanges),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
            ],
        });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center">
                Transaction Management
            </Typography>

            {/* Month Selector */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 150, mr: 2 }}
                >
                    <MenuItem value=""><em>Select Month</em></MenuItem>
                    <MenuItem value="1">January</MenuItem>
                    <MenuItem value="2">February</MenuItem>
                    <MenuItem value="3">March</MenuItem>
                    <MenuItem value="4">April</MenuItem>
                    <MenuItem value="5">May</MenuItem>
                    <MenuItem value="6">June</MenuItem>
                    <MenuItem value="7">July</MenuItem>
                    <MenuItem value="8">August</MenuItem>
                    <MenuItem value="9">September</MenuItem>
                    <MenuItem value="10">October</MenuItem>
                    <MenuItem value="11">November</MenuItem>
                    <MenuItem value="12">December</MenuItem>
                </Select>

                <Button variant="contained" color="primary" onClick={fetchTransactions}>
                    Search
                </Button>
            </Box>

            {/* Transaction Table */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Transaction List
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Sold</TableCell>
                                            <TableCell>Date of Sale</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>{transaction.id}</TableCell>
                                                <TableCell>{transaction.title}</TableCell>
                                                <TableCell>${transaction.price.toFixed(2)}</TableCell>
                                                <TableCell>{transaction.sold ? 'Yes' : 'No'}</TableCell>
                                                <TableCell>{new Date(transaction.dateOfSale).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Statistics */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Transaction Statistics
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                                <Typography>Total Sales: ${statistics.totalSales.toFixed(2)}</Typography>
                                <Typography>Total Sold Items: {statistics.totalSold}</Typography>
                                <Typography>Total Not Sold Items: {statistics.totalNotSold}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Bar Chart */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Price Range Bar Chart
                            </Typography>
                            {chartData && chartData.datasets[0].data.length > 0 ? (
                                <Bar data={chartData} options={{ responsive: true }} />
                            ) : (
                                <Typography>No data available for the selected month</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;
