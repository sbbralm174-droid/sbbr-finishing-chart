'use client'

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ChartComponent = ({ floor, data, loading, error }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-4 flex-1 min-w-[300px]">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
          {floor}
      </h2>
      {loading ? (
        <p className="text-center text-blue-500">Loading data...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500">No data available for this floor.</p>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              barGap={20}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="alter" stackId="a" fill="#8884d8" radius={[10, 10, 0, 0]} />
              <Bar dataKey="percentage" stackId="a" fill="#82ca9d" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [floor1Data, setFloor1Data] = useState([]);
  const [floor2Data, setFloor2Data] = useState([]);
  const [floor3Data, setFloor3Data] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [res1, res2, res3] = await Promise.all([
          fetch(`/api/alter?date=${selectedDate}&floor=1`),
          fetch(`/api/alter?date=${selectedDate}&floor=2`),
          fetch(`/api/alter?date=${selectedDate}&floor=3`),
        ]);

        const rawData1 = await res1.json();
        const rawData2 = await res2.json();
        const rawData3 = await res3.json();

        setFloor1Data(processChartData(rawData1));
        setFloor2Data(processChartData(rawData2));
        setFloor3Data(processChartData(rawData3));
      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [selectedDate]);

  const processChartData = (rawData) => {
    const timeSlots = ['8-9', '9-10', '10-11', '11-12', '12-1', '2-3', '3-4', '4-5'];

    return timeSlots.map((slot) => {
      const entry = rawData.find((d) => d.name === slot);
      return {
        name: slot,
        alter: entry ? entry.alter : 0,
        production: entry ? entry.production : 0,
      };
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Header & Date Picker */}
      <div className="bg-white rounded-lg text-black shadow-xl p-8 w-full max-w-6xl mb-8">
      <div className="text-center  mb-6">
          <h1 className="text-2xl font-bold">GMS TEXTILES LTD.</h1>
          <p className="text">TANSUTRAPUR, KALIAKOIR, GAZIPUR</p>
          <h2 className="text-lg font-bold">Hourly Production vs DHU</h2>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="date-filter">
            Select Date
          </label>
          <input
            type="date"
            id="date-filter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="flex gap-4 w-full max-w-6xl">
        <div style={{ flex: '0 0 33.33%' }}>
          <ChartComponent floor="Shapla" data={floor1Data} loading={loading} error={error} />
        </div>
        <div style={{ flex: '0 0 33.33%' }}>
          <ChartComponent floor="Poddo" data={floor2Data} loading={loading} error={error} />
        </div>
        <div style={{ flex: '0 0 33.33%' }}>
          <ChartComponent floor="Kadom" data={floor3Data} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
