"use client";


export default function Stats({ summary }) {
const { totalPieces = 0, totalDefects = 0, avgDHU = 0 } = summary || {};
return (
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
<div className="rounded-2xl p-5 bg-gray-900 shadow">
<div className="text-sm text-gray-400">Total Pieces</div>
<div className="text-2xl font-semibold">{totalPieces}</div>
</div>
<div className="rounded-2xl p-5 bg-gray-900 shadow">
<div className="text-sm text-gray-400">Total Defects</div>
<div className="text-2xl font-semibold">{totalDefects}</div>
</div>
<div className="rounded-2xl p-5 bg-gray-900 shadow">
<div className="text-sm text-gray-400">Avg. DHU (%)</div>
<div className="text-2xl font-semibold">{avgDHU.toFixed(2)}</div>
</div>
</div>
);
}