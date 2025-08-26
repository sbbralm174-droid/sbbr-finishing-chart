'use client'
import useSWR from 'swr'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function DhuPage() {
  const { data, error } = useSWR('/api/dhu', fetcher)

  if (error) return <div className="text-red-500">Failed to load data</div>
  if (!data) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Daily DHU Trend</h1>

      <div className="bg-white p-4 rounded-lg shadow w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="dhu" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
