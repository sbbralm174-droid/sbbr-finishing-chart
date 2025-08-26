'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DhuPage() {
  const [selectedFloor, setSelectedFloor] = useState('all');

  // SWR key-তে নির্বাচিত ফ্লোরটি যুক্ত করা হয়েছে
  const { data, error } = useSWR(`/api/dhu?floor=${selectedFloor}`, fetcher, { refreshInterval: 5000 });

  if (error) {
    console.error("Failed to load data:", error);
    return <div className="text-red-500 text-center">Failed to load data. Please check your network or API endpoint.</div>;
  }

  if (!data) {
    console.log("Loading data...");
    return <div className="text-gray-400 text-center">Loading...</div>;
  }
  
  // ডেটা প্রক্রিয়াকরণ: অনুপস্থিত মানগুলোকে 0 হিসেবে ধরা হয়েছে
  const processedData = data.map(d => ({
    ...d,
    totalPieces: d.totalPieces === undefined ? 0 : d.totalPieces,
    totalDefects: d.totalDefects === undefined ? 0 : d.totalDefects,
  }));

  const xLabels = processedData.map(d => d.date);

  const chartSeries = [
    { data: processedData.map(d => d.dhu), label: 'DHU %', yAxisKey: 'dhu', color: '#1976d2' },
    { data: processedData.map(d => d.totalPieces), label: 'Total Pieces', yAxisKey: 'count', color: '#ff9800' },
    { data: processedData.map(d => d.totalDefects), label: 'Total Defects', yAxisKey: 'count', color: '#f44336' }
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily DHU Trend
          </Typography>

          <FormControl variant="outlined" sx={{ minWidth: 150, mb: 3 }}>
            <InputLabel>Select Floor</InputLabel>
            <Select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              label="Select Floor"
            >
              <MenuItem value="all">All Floors</MenuItem>
              <MenuItem value="Floor 1">Floor 1</MenuItem>
              <MenuItem value="Floor 2">Floor 2</MenuItem>
              <MenuItem value="Floor 3">Floor 3</MenuItem>
              {/* প্রয়োজনে এখানে আরও ফ্লোর যোগ করুন */}
            </Select>
          </FormControl>

          <div className="p-6 w-full" style={{ height: 450 }}>
            <LineChart
              xAxis={[{ scaleType: 'point', data: xLabels }]}
              yAxis={[
                { id: 'dhu', label: 'DHU %', min: 0, max: 100 },
                { id: 'count', label: 'Pieces / Defects', min: 0 }
              ]}
              series={chartSeries}
              width={900}
              height={450}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}