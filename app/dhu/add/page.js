'use client';
import { useState } from 'react';
import useSWR from 'swr';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddDhu() {
  const [formData, setFormData] = useState({ date: null, floor: '', totalPieces: '', totalDefects: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { mutate } = useSWR('/api/dhu');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.date || !formData.floor || formData.totalPieces === '' || formData.totalDefects === '') {
      setMessage('All fields are required!');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        date: formData.date.toISOString().split('T')[0],
        floor: formData.floor,
        totalPieces: Number(formData.totalPieces),
        totalDefects: Number(formData.totalDefects),
      };

      const response = await fetch('/api/dhu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('DHU Data Saved successfully!');
        setFormData({ date: null, floor: '', totalPieces: '', totalDefects: '' });
        mutate();
      } else {
        setMessage(`Error: ${result.message || 'Failed to save data.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Add DHU Data</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date-picker" className="block text-sm font-semibold text-gray-700 mb-1">Select Date</label>
            <DatePicker
              id="date-picker"
              selected={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholderText="Select Date"
            />
          </div>
          <div>
            <label htmlFor="floor" className="block text-sm font-semibold text-gray-700 mb-1">Floor Name</label>
            <input
              id="floor"
              type="text"
              placeholder="e.g., Floor 1"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="total-pieces" className="block text-sm font-semibold text-gray-700 mb-1">Total Pieces</label>
            <input
              id="total-pieces"
              type="number"
              placeholder="Enter Total Pieces"
              value={formData.totalPieces}
              onChange={(e) => setFormData({ ...formData, totalPieces: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="total-defects" className="block text-sm font-semibold text-gray-700 mb-1">Total Defects</label>
            <input
              id="total-defects"
              type="number"
              placeholder="Enter Total Defects"
              value={formData.totalDefects}
              onChange={(e) => setFormData({ ...formData, totalDefects: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save DHU Data'}
          </button>
        </form>
        {message && (
          <p className={`mt-6 text-center font-medium ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}