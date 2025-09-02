"use client";

import Link from 'next/link';
import React, { useState } from 'react';

const SpotInput = () => {
    const [floor, setFloor] = useState('1');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');

    const timeSlots = [
        '8-9',
        '9-10',
        '10-11',
        '11-12',
        '12-1',
        '1-2',
        '2-3',
        '3-4',
        '4-5'
    ];

    const [timeData, setTimeData] = useState(
        timeSlots.map(slot => ({
            time: slot,
            production: '',
            spot: ''
        }))
    );

    const handleInputChange = (e, index, field) => {
        const newData = [...timeData];
        newData[index][field] = e.target.value;
        setTimeData(newData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('ডেটা আপলোড হচ্ছে...');

        const validEntries = timeData.filter(entry => {
            const productionValue = parseFloat(entry.production);
            const spotValue = parseFloat(entry.spot);

            // Validate that the inputs are non-empty, are numbers, and production is not zero
            return entry.production !== '' && entry.spot !== '' && !isNaN(productionValue) && !isNaN(spotValue) && productionValue > 0;
        });

        if (validEntries.length === 0) {
            setMessage('ত্রুটি: অনুগ্রহ করে কমপক্ষে একটি সেশনের জন্য বৈধ ডেটা ইনপুট করুন।');
            return;
        }

        const promises = validEntries.map(async (entry) => {
            const productionValue = parseFloat(entry.production);
            const spotValue = parseFloat(entry.spot);
            
            const calculatedPercentage = ((productionValue - spotValue) / productionValue) * 100;

            const payload = {
                floor: parseInt(floor),
                date: date,
                name: entry.time,
                production: productionValue,
                spot: spotValue,
                percentage: calculatedPercentage,
            };

            try {
                const response = await fetch('/api/spot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const result = await response.json();
                    return { success: false, error: result.error || 'ডেটা আপলোড ব্যর্থ হয়েছে।' };
                }
                return { success: true };
            } catch (error) {
                console.error("Error submitting data:", error);
                return { success: false, error: 'যোগাযোগের ত্রুটি: ডেটা আপলোড করা যায়নি।' };
            }
        });

        const results = await Promise.all(promises);

        const successfulUploads = results.filter(r => r.success).length;
        const failedUploads = results.filter(r => !r.success).length;

        if (failedUploads === 0) {
            setMessage(`সকল ডেটা সফলভাবে আপলোড হয়েছে! (${successfulUploads}টি এন্ট্রি)`);
            setTimeData(timeSlots.map(slot => ({ time: slot, production: '', spot: '' })));
        } else {
            setMessage(`সফলভাবে আপলোড হয়েছে: ${successfulUploads}টি। ব্যর্থ হয়েছে: ${failedUploads}টি।`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    নতুন ডেটা যোগ করুন
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="floor">
                            ফ্লোর নির্বাচন করুন
                        </label>
                        <select
                            id="floor"
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="1">Shapla</option>
                            <option value="2">Poddo</option>
                            <option value="3">Kadom</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
                            তারিখ নির্বাচন করুন
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="space-y-4">
                        {timeData.map((slotData, index) => (
                            <div key={slotData.time} className="flex flex-col md:flex-row md:items-center md:space-x-4">
                                <label className="block text-gray-700 font-bold mb-2 md:mb-0 w-20" htmlFor={`time-${index}`}>
                                    সময়: {slotData.time}
                                </label>
                                <div className="flex flex-1 space-x-2">
                                    <input
                                        type="number"
                                        id={`production-${index}`}
                                        value={slotData.production}
                                        onChange={(e) => handleInputChange(e, index, 'production')}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Production"
                                    />
                                    <input
                                        type="number"
                                        id={`spot-${index}`}
                                        value={slotData.spot}
                                        onChange={(e) => handleInputChange(e, index, 'spot')}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="spot"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        ডেটা জমা দিন
                    </button>
                </form>
                {message && (
                    <p className={`mt-4 text-center ${message.includes('সফলভাবে') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-blue-500 hover:underline">
                        হোমপেজে ফিরে যান
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SpotInput;