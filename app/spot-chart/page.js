'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement, // ArcElement পাই চার্টের জন্য প্রয়োজন
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2'; // Pie কম্পোনেন্ট ইম্পোর্ট করা হয়েছে
import { Container, Grid, Typography, Box, TextField, CircularProgress, Alert } from '@mui/material';
import { format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend);

// স্ট্যাটিক ডেটা (নমুনা হিসেবে)
const staticFloorData = {
  floor1: [{ name: 'Section A', production: 850, rejection: 150 }],
  floor2: [{ name: 'Section B', production: 920, rejection: 80 }],
  floor3: [{ name: 'Section C', production: 780, rejection: 220 }],
};

const processDataForChart = (data) => {
  // Production এবং Rejection এর মোট মান গণনা
  const totalProduction = data.reduce((sum, item) => sum + item.production, 0);
  const totalRejection = data.reduce((sum, item) => sum + item.rejection, 0);

  return {
    labels: ['Production', 'Rejection'],
    datasets: [
      {
        data: [totalProduction, totalRejection],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
};

export default function PieChartPage() {
  const [floor1Data, setFloor1Data] = useState(null);
  const [floor2Data, setFloor2Data] = useState(null);
  const [floor3Data, setFloor3Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    // স্ট্যাটিক ডেটা ব্যবহার করে সরাসরি চার্ট তৈরি করা হচ্ছে
    setFloor1Data(processDataForChart(staticFloorData.floor1));
    setFloor2Data(processDataForChart(staticFloorData.floor2));
    setFloor3Data(processDataForChart(staticFloorData.floor3));
    setLoading(false);
  }, [selectedDate]); // তারিখ পরিবর্তনের সাথে সাথে চার্ট আপডেট হবে

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            const total = tooltipItem.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = (value / total) * 100;
            return `${label}: ${percentage.toFixed(2)}% (${value} units)`;
          },
        },
      },
    },
  };

  return (
    <Container className="text-black" maxWidth="lg" sx={{ mt: 4 }}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">GMS TEXTILES LTD.</h1>
        <p className="text">TANSUTRAPUR, KALIAKOIR, GAZIPUR</p>
        <h2 className="text-lg font-bold">Hourly Spot Status</h2>
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading charts...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 5, width: '100%' }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ height: 400, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
              <Typography variant="h6" align="center" gutterBottom>Floor 1</Typography>
              {floor1Data && floor1Data.datasets[0].data.length > 0 ? (
                <Pie data={floor1Data} options={chartOptions} />
              ) : (
                <Typography align="center" sx={{ mt: 5 }}>No data available for this date.</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ height: 400, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
              <Typography variant="h6" align="center" gutterBottom>Floor 2</Typography>
              {floor2Data && floor2Data.datasets[0].data.length > 0 ? (
                <Pie data={floor2Data} options={chartOptions} />
              ) : (
                <Typography align="center" sx={{ mt: 5 }}>No data available for this date.</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ height: 400, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
              <Typography variant="h6" align="center" gutterBottom>Floor 3</Typography>
              {floor3Data && floor3Data.datasets[0].data.length > 0 ? (
                <Pie data={floor3Data} options={chartOptions} />
              ) : (
                <Typography align="center" sx={{ mt: 5 }}>No data available for this date.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}