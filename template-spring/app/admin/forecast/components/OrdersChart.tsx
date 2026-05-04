"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

export default function OrdersChart() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        fetch("http://localhost:8081/api/stats/last7days")
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    return (
        <div className="bg-white rounded-xl p-4 shadow mt-6">
            <h2 className="text-lg font-semibold mb-4">
                Orders (Last 7 days)
            </h2>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#f97316"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}