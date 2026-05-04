"use client";

import React, { useEffect, useState } from "react";

type Stats = {
    today: number;
    yesterday: number;
    week: number;
    lastWeek: number;
};

export default function ComparaisonPeriodes() {
    const [stats, setStats] = useState<Stats>({
        today: 0,
        yesterday: 0,
        week: 0,
        lastWeek: 0,
    });

    useEffect(() => {
        fetch("http://localhost:8081/api/stats/comparison")
            .then((res) => res.json())
            .then((data) =>
                setStats({
                    today: data.today ?? 0,
                    yesterday: data.yesterday ?? 0,
                    week: data.week ?? 0,
                    lastWeek: data.lastWeek ?? 0,
                })
            )
            .catch(() => {
                // fallback
                setStats({
                    today: 120,
                    yesterday: 100,
                    week: 800,
                    lastWeek: 700,
                });
            });
    }, []);

    const calc = (current: number, prev: number) => {
        if (!prev || prev === 0) return 0;
        return ((current - prev) / prev) * 100;
    };

    const todayPercent = calc(stats.today, stats.yesterday);
    const weekPercent = calc(stats.week, stats.lastWeek);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* TODAY */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-gray-500">Aujourd’hui</h3>

                <p className="text-3xl font-bold">
                    {stats.today}
                </p>

                <span
                    className={
                        todayPercent >= 0
                            ? "text-green-500 font-bold"
                            : "text-red-500 font-bold"
                    }
                >
          {todayPercent >= 0 ? "+" : ""}
                    {todayPercent.toFixed(1)}%
        </span>

                <p className="text-sm text-gray-400">
                    vs Hier ({stats.yesterday})
                </p>
            </div>

            {/* WEEK */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-gray-500">Cette semaine</h3>

                <p className="text-3xl font-bold">
                    {stats.week}
                </p>

                <span
                    className={
                        weekPercent >= 0
                            ? "text-green-500 font-bold"
                            : "text-red-500 font-bold"
                    }
                >
          {weekPercent >= 0 ? "+" : ""}
                    {weekPercent.toFixed(1)}%
        </span>

                <p className="text-sm text-gray-400">
                    vs Semaine passée ({stats.lastWeek})
                </p>
            </div>

        </div>
    );
}