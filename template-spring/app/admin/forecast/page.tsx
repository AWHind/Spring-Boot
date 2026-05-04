"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    ResponsiveContainer, CartesianGrid,
    XAxis, YAxis, Tooltip, Area, Line, ComposedChart,
    Legend, ReferenceLine
} from "recharts";
import {
    RefreshCw, Activity, AlertCircle, Star,
    TrendingUp, TrendingDown, Minus, Clock, Shield,
    Crown, Target, Award
} from "lucide-react";

// ================= TYPES =================
type Trend = 'up' | 'down' | 'stable';

interface DailyOrder {
    day: string;
    count: number;
}

interface Forecast {
    predictedTomorrowOrders: number;
    confidence: number;
    trend: Trend;
    last7Days: DailyOrder[];
    recommendations?: string[];
    metadata?: {
        modelVersion: string;
        lastUpdated: string;
    };
}

// ================= MAIN =================
export default function ForecastPage() {

    const [data, setData] = useState<Forecast | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // ================= FETCH =================
    const fetchForecast = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const res = await fetch("http://localhost:8081/api/forecast");
            if (!res.ok) throw new Error("API Error");
            const result = await res.json();

            if (!result.metadata) {
                result.metadata = {
                    modelVersion: "v3.0.0",
                    lastUpdated: new Date().toISOString()
                };
            }

            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchForecast();
    }, [fetchForecast]);

    useEffect(() => {
        if (autoRefresh) {
            intervalRef.current = setInterval(() => fetchForecast(true), 10000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [autoRefresh, fetchForecast]);

    if (loading) return <LoadingSkeleton />;
    if (!data) return <NoDataState onRetry={() => fetchForecast()} />;

    const trendInfo = getTrendInfo(data.trend);
    const confidenceColor = getConfidenceColor(data.confidence);

    // Calculate stats
    const totalOrders = data.last7Days.reduce((s, d) => s + d.count, 0);
    const avgOrders = Math.round(totalOrders / data.last7Days.length);
    const peakDay = data.last7Days.reduce((max, d) => d.count > max.count ? d : max, data.last7Days[0]);
    const growthPercent = (((data.last7Days[6]?.count || 0) - (data.last7Days[0]?.count || 0)) / (data.last7Days[0]?.count || 1) * 100).toFixed(1);

    // 🔧 FIXED: Moving average - filter out null values properly
    const movingAverageData = data.last7Days.map((_, idx, arr) => {
        if (idx < 2) return null;
        const avg = (arr[idx-2].count + arr[idx-1].count + arr[idx].count) / 3;
        return { day: arr[idx].day, ma: Math.round(avg) };
    }).filter((item): item is { day: string; ma: number } => item !== null);

    return (
        <div className="page">
            <div className="container">

                {/* ========== HEADER ========== */}
                <div className="header">
                    <div>
                        <div className="plan-badge">
                            <Crown size={14} />
                            <span>ARIERE PRO PLAN</span>
                            <span className="plan-dot">●</span>
                            <span className="plan-active">Active</span>
                        </div>
                        <h1 className="title">Forecast Dashboard</h1>
                        <p className="subtitle">AI-powered order predictions & analytics</p>
                    </div>

                    <div className="actions">
                        <button className={`live-btn ${autoRefresh ? 'active' : ''}`} onClick={() => setAutoRefresh(!autoRefresh)}>
                            <Activity size={14} />
                            {autoRefresh ? 'Live Mode' : 'Manual'}
                        </button>
                        <button className="sync-btn" onClick={() => fetchForecast(true)} disabled={refreshing}>
                            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
                            Sync
                        </button>
                    </div>
                </div>

                {/* ========== PLAN BAR ========== */}
                <div className="plan-bar">
                    <div className="plan-item">
                        <span className="plan-label">Current Plan</span>
                        <span className="plan-value">Ariere Pro</span>
                    </div>
                    <div className="plan-divider"></div>
                    <div className="plan-item">
                        <span className="plan-label">Valid Until</span>
                        <span className="plan-value">December 2025</span>
                    </div>
                    <div className="plan-divider"></div>
                    <div className="plan-item">
                        <span className="plan-label">Model Version</span>
                        <span className="plan-value">{data.metadata?.modelVersion || 'v3.0'}</span>
                    </div>
                    <div className="plan-divider"></div>
                    <div className="plan-item">
                        <span className="plan-label">Support</span>
                        <span className="plan-value priority">24/7 Priority</span>
                    </div>
                </div>

                {/* ========== CARDS ========== */}
                <div className="cards">
                    <div className="card">
                        <div className="card-header">
                            <span className="card-icon">📊</span>
                            <span className="card-badge">AI Prediction</span>
                        </div>
                        <div className="card-value">{data.predictedTomorrowOrders.toLocaleString()}</div>
                        <div className="card-title">Tomorrow's Orders</div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${data.confidence * 100}%`, background: '#f59e0b' }}></div>
                        </div>
                        <div className="progress-text">{Math.round(data.confidence * 100)}% confidence</div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <span className="card-icon">🎯</span>
                            <span className="card-badge">Accuracy</span>
                        </div>
                        <div className="card-value">{(data.confidence * 100).toFixed(1)}<span className="value-suffix">%</span></div>
                        <div className="card-title">Confidence Score</div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${data.confidence * 100}%`, background: confidenceColor }}></div>
                        </div>
                        <div className="progress-text">Model certainty</div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <span className="card-icon">{trendInfo.icon}</span>
                            <span className="card-badge">Trend</span>
                        </div>
                        <div className="card-value trend" style={{ color: trendInfo.color }}>{trendInfo.text}</div>
                        <div className="card-title">Market Trend</div>
                        <div className="trend-change">{data.trend === 'up' ? '↑ +12.5%' : data.trend === 'down' ? '↓ -5.2%' : '→ +2.1%'} vs last week</div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <span className="card-icon">🏆</span>
                            <span className="card-badge">Performance</span>
                        </div>
                        <div className="card-value">98<span className="value-suffix">/100</span></div>
                        <div className="card-title">Pro Score</div>
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (<Star key={i} size={14} fill="#f59e0b" stroke="none" />))}
                        </div>
                        <div className="progress-text">Top 2% globally</div>
                    </div>
                </div>

                {/* ========== PROFESSIONAL CHART ========== */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">Orders Performance Analytics</h3>
                            <p className="chart-subtitle">7-day trend with moving average</p>
                        </div>
                        <div className="chart-stats">
                            <div className="stat-badge">Total: {totalOrders.toLocaleString()}</div>
                            <div className="stat-badge">Avg: {avgOrders.toLocaleString()}</div>
                            <div className="stat-badge">Peak: {peakDay.count.toLocaleString()}</div>
                        </div>
                    </div>

                    <div style={{ height: 380 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data.last7Days} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => v.toLocaleString()} />
                                <Tooltip content={<ProTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                                <Area type="monotone" dataKey="count" name="Orders" stroke="#f59e0b" fill="url(#areaGradient)" strokeWidth={2.5} />
                                <Line type="monotone" dataKey="count" name="Trend Line" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                {/* 🔧 FIXED: Only render MA line if we have data */}
                                {movingAverageData.length > 0 && (
                                    <Line
                                        type="monotone"
                                        data={movingAverageData}
                                        dataKey="ma"
                                        name="3-Day MA"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        connectNulls
                                    />
                                )}
                                <ReferenceLine y={avgOrders} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Avg', position: 'right', fill: '#10b981', fontSize: 10 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-footer">
                        <div className="footer-stat">
                            <span className="footer-label">Weekly Growth</span>
                            <span className="footer-value" style={{ color: Number(growthPercent) >= 0 ? '#10b981' : '#ef4444' }}>
                                {Number(growthPercent) >= 0 ? '+' : ''}{growthPercent}%
                            </span>
                        </div>
                        <div className="footer-stat">
                            <span className="footer-label">Best Day</span>
                            <span className="footer-value">{peakDay.day} ({peakDay.count.toLocaleString()})</span>
                        </div>
                        <div className="footer-stat">
                            <span className="footer-label">Forecast Match</span>
                            <span className="footer-value" style={{ color: '#f59e0b' }}>{(data.confidence * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

                {/* ========== RECOMMENDATIONS ========== */}
                {data.recommendations && data.recommendations.length > 0 && (
                    <div className="rec-container">
                        <div className="rec-header">
                            <h3 className="rec-title">AI Recommendations</h3>
                            <span className="rec-badge">Powered by GPT-4</span>
                        </div>
                        <div className="rec-list">
                            {data.recommendations.map((rec, idx) => (
                                <div key={idx} className="rec-item">
                                    <div className="rec-number">{idx + 1}</div>
                                    <div className="rec-text">{rec}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ========== FOOTER ========== */}
                <div className="footer">
                    <div className="footer-left">
                        <span><Clock size={12} /> Updated: {new Date(data.metadata?.lastUpdated || '').toLocaleString()}</span>
                        <span><Shield size={12} /> SSL Encrypted</span>
                    </div>
                    <div className="footer-right">
                        <span>v{data.metadata?.modelVersion}</span>
                    </div>
                </div>

            </div>

            <style jsx>{`
                .page {
                    min-height: 100vh;
                    background: #f8fafc;
                }
                
                .container {
                    max-width: 1300px;
                    margin: 0 auto;
                    padding: 32px 28px;
                }
                
                /* Header */
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    gap: 20px;
                }
                
                .plan-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #f1f5f9;
                    padding: 6px 14px;
                    border-radius: 20px;
                    margin-bottom: 14px;
                    font-size: 11px;
                    font-weight: 600;
                }
                
                .plan-badge span:first-of-type { color: #f59e0b; }
                .plan-dot { color: #cbd5e1; font-size: 8px; }
                .plan-active { color: #10b981; }
                
                .title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 6px 0;
                }
                
                .subtitle {
                    font-size: 13px;
                    color: #64748b;
                    margin: 0;
                }
                
                .actions {
                    display: flex;
                    gap: 10px;
                }
                
                .live-btn, .sync-btn {
                    background: white;
                    border: 1px solid #e2e8f0;
                    padding: 8px 18px;
                    border-radius: 30px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #64748b;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s;
                }
                
                .live-btn.active {
                    background: #10b981;
                    border-color: #10b981;
                    color: white;
                }
                
                .sync-btn:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }
                
                .spin {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Plan Bar */
                .plan-bar {
                    background: white;
                    border-radius: 16px;
                    padding: 14px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                    gap: 16px;
                    border: 1px solid #e2e8f0;
                }
                
                .plan-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                
                .plan-label {
                    font-size: 10px;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .plan-value {
                    font-size: 13px;
                    font-weight: 600;
                    color: #0f172a;
                }
                
                .plan-value.priority { color: #f59e0b; }
                
                .plan-divider {
                    width: 1px;
                    height: 35px;
                    background: #e2e8f0;
                }
                
                /* Cards */
                .cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 28px;
                }
                
                .card {
                    background: white;
                    border-radius: 20px;
                    padding: 20px;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s;
                }
                
                .card:hover {
                    border-color: #cbd5e1;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                
                .card-icon { font-size: 28px; }
                
                .card-badge {
                    background: #f1f5f9;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 600;
                    color: #64748b;
                }
                
                .card-value {
                    font-size: 34px;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 6px;
                }
                
                .card-value.trend { font-size: 28px; }
                .value-suffix { font-size: 16px; font-weight: 500; color: #94a3b8; }
                .card-title { font-size: 13px; color: #64748b; margin-bottom: 16px; }
                
                .progress-bar {
                    height: 4px;
                    background: #f1f5f9;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 6px;
                }
                
                .progress-fill { height: 100%; border-radius: 4px; }
                .progress-text { font-size: 10px; color: #94a3b8; }
                .trend-change { font-size: 12px; font-weight: 500; color: #64748b; }
                .stars { display: flex; gap: 3px; margin-bottom: 6px; }
                
                /* Chart */
                .chart-container {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 28px;
                    border: 1px solid #e2e8f0;
                }
                
                .chart-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                
                .chart-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 4px 0;
                }
                
                .chart-subtitle {
                    font-size: 12px;
                    color: #64748b;
                    margin: 0;
                }
                
                .chart-stats {
                    display: flex;
                    gap: 10px;
                }
                
                .stat-badge {
                    background: #f1f5f9;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 500;
                    color: #475569;
                }
                
                .chart-footer {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 20px;
                    padding-top: 16px;
                    border-top: 1px solid #f1f5f9;
                    gap: 20px;
                    flex-wrap: wrap;
                }
                
                .footer-stat {
                    text-align: center;
                }
                
                .footer-label {
                    font-size: 10px;
                    color: #94a3b8;
                    display: block;
                    margin-bottom: 4px;
                }
                
                .footer-value {
                    font-size: 14px;
                    font-weight: 700;
                    color: #0f172a;
                }
                
                /* Recommendations */
                .rec-container {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 28px;
                    border: 1px solid #e2e8f0;
                }
                
                .rec-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                
                .rec-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }
                
                .rec-badge {
                    background: #f1f5f9;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 10px;
                    color: #64748b;
                }
                
                .rec-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .rec-item {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 12px 16px;
                    background: #f8fafc;
                    border-radius: 14px;
                    border: 1px solid #f1f5f9;
                }
                
                .rec-number {
                    width: 28px;
                    height: 28px;
                    background: #fef3c7;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 13px;
                    color: #d97706;
                }
                
                .rec-text {
                    flex: 1;
                    font-size: 13px;
                    color: #334155;
                }
                
                /* Footer */
                .footer {
                    background: white;
                    border-radius: 16px;
                    padding: 14px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                    border: 1px solid #e2e8f0;
                }
                
                .footer-left {
                    display: flex;
                    gap: 20px;
                    font-size: 11px;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .footer-left span {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .footer-right {
                    font-size: 11px;
                    font-weight: 600;
                    color: #cbd5e1;
                }
                
                @media (max-width: 768px) {
                    .container {
                        padding: 20px 16px;
                    }
                    
                    .title {
                        font-size: 24px;
                    }
                    
                    .plan-bar {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .plan-divider {
                        width: 100%;
                        height: 1px;
                    }
                    
                    .cards {
                        grid-template-columns: 1fr;
                    }
                    
                    .footer-left {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }
                }
            `}</style>
        </div>
    );
}

// ========== COMPONENTS ==========

function ProTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="tooltip">
                <div className="tooltip-date">{label}</div>
                <div className="tooltip-row">
                    <span className="tooltip-dot" style={{ background: '#f59e0b' }}></span>
                    <span>Orders: </span>
                    <strong>{payload[0]?.value?.toLocaleString()}</strong>
                </div>
                {payload[1]?.value && payload[1]?.dataKey === 'ma' && (
                    <div className="tooltip-row">
                        <span className="tooltip-dot" style={{ background: '#3b82f6' }}></span>
                        <span>MA (3d): </span>
                        <strong>{payload[1].value.toLocaleString()}</strong>
                    </div>
                )}
                <style jsx>{`
                    .tooltip {
                        background: white;
                        border-radius: 12px;
                        padding: 10px 14px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        border: 1px solid #e2e8f0;
                        min-width: 140px;
                    }
                    .tooltip-date {
                        font-size: 11px;
                        font-weight: 600;
                        color: #0f172a;
                        margin-bottom: 6px;
                        padding-bottom: 4px;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .tooltip-row {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 11px;
                        color: #64748b;
                        margin-top: 4px;
                    }
                    .tooltip-dot {
                        width: 6px;
                        height: 6px;
                        border-radius: 3px;
                    }
                    .tooltip-row strong {
                        color: #0f172a;
                    }
                `}</style>
            </div>
        );
    }
    return null;
}

function LoadingSkeleton() {
    return (
        <div className="skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-cards">
                {[...Array(4)].map((_, i) => (<div key={i} className="skeleton-card"></div>))}
            </div>
            <div className="skeleton-chart"></div>
            <style jsx>{`
                .skeleton {
                    min-height: 100vh;
                    background: #f8fafc;
                    padding: 32px;
                }
                .skeleton-header { height: 80px; background: #e2e8f0; border-radius: 16px; margin-bottom: 20px; max-width: 1300px; margin: 0 auto 20px; }
                .skeleton-bar { height: 70px; background: #e2e8f0; border-radius: 16px; margin: 0 auto 28px; max-width: 1300px; }
                .skeleton-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px,1fr)); gap: 20px; max-width: 1300px; margin: 0 auto 28px; }
                .skeleton-card { height: 180px; background: #e2e8f0; border-radius: 20px; }
                .skeleton-chart { height: 500px; background: #e2e8f0; border-radius: 20px; max-width: 1300px; margin: 0 auto; }
            `}</style>
        </div>
    );
}

function NoDataState({ onRetry }: any) {
    return (
        <div className="nodata">
            <div className="nodata-card">
                <AlertCircle size={40} color="#f59e0b" />
                <h2>No Data Available</h2>
                <p>Waiting for forecast data...</p>
                <button onClick={onRetry}>
                    <RefreshCw size={14} />
                    Retry
                </button>
            </div>
            <style jsx>{`
                .nodata {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                }
                .nodata-card {
                    background: white;
                    border-radius: 24px;
                    padding: 40px;
                    text-align: center;
                    border: 1px solid #e2e8f0;
                }
                .nodata-card h2 {
                    color: #0f172a;
                    margin: 16px 0 8px;
                    font-size: 20px;
                }
                .nodata-card p {
                    color: #64748b;
                    margin-bottom: 24px;
                }
                .nodata-card button {
                    background: #f59e0b;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 30px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                    color: white;
                }
            `}</style>
        </div>
    );
}

function getTrendInfo(trend: Trend) {
    switch (trend) {
        case 'up': return { text: 'Growing', icon: '📈', color: '#10b981' };
        case 'down': return { text: 'Declining', icon: '📉', color: '#ef4444' };
        default: return { text: 'Stable', icon: '➡️', color: '#f59e0b' };
    }
}

function getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
}