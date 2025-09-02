"use client";
import { useState } from "react";

const fixedIssues = [
  "SKIP STITCH",
  "BROKEN STITCH",
  "OPEN STITCH",
  "SHADING",
  "OIL SPOT",
  "NEEDLE CUT",
  "HOLE",
  "SIZE MISTAKE",
  "CREASE MARK",
  "UNCUT THREAD",
];

export default function InputPage() {
  const [counts, setCounts] = useState({});
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0] // Default today's date (YYYY-MM-DD)
  );

  const handleChange = (name, value) => {
    setCounts({ ...counts, [name]: Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const [name, count] of Object.entries(counts)) {
      if (count > 0) {
        await fetch("/api/paretoChart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, count, date }), // date is being sent as is
        });
      }
    }
    alert("✅ Data submitted successfully!");
    setCounts({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Issue Input</h1>

        {/* Date select */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* Issues input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fixedIssues.map((issue) => (
            <div key={issue} className="flex gap-4 items-center">
              <label className="w-40">{issue}</label>
              <input
                type="number"
                min="0"
                value={counts[issue] || ""}
                onChange={(e) => handleChange(issue, e.target.value)}
                className="border p-2 flex-1 rounded"
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
