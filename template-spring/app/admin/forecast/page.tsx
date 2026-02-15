'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';

type Period = 'week' | 'month' | 'quarter';
type Metric = 'revenue' | 'orders' | 'customers';

export default function AdminForecastPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('week');
  const [metric, setMetric] = useState<Metric>('revenue');
  const [hasResults, setHasResults] = useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [isClient, user, router]);

  const handleSimulate = () => {
    setHasResults(true);
  };

  // Mock forecast data based on selection
  const getForecastData = () => {
    const baseData = {
      week: [
        { date: 'Lun', value: 1200 },
        { date: 'Mar', value: 1450 },
        { date: 'Mer', value: 1320 },
        { date: 'Jeu', value: 1680 },
        { date: 'Ven', value: 1950 },
        { date: 'Sam', value: 2240 },
        { date: 'Dim', value: 1880 }
      ],
      month: [
        { date: 'S1', value: 8500 },
        { date: 'S2', value: 9200 },
        { date: 'S3', value: 8900 },
        { date: 'S4', value: 10200 }
      ],
      quarter: [
        { date: 'Jan', value: 28000 },
        { date: 'Fév', value: 29500 },
        { date: 'Mar', value: 31200 }
      ]
    };

    if (metric === 'orders') {
      return baseData[period].map(item => ({
        ...item,
        value: Math.round(item.value / 15)
      }));
    }

    if (metric === 'customers') {
      return baseData[period].map(item => ({
        ...item,
        value: Math.round(item.value / 150)
      }));
    }

    return baseData[period];
  };

  const forecastData = hasResults ? getForecastData() : [];
  const maxValue = Math.max(...forecastData.map(d => d.value));
  const trend = Math.random() > 0.5 ? 'up' : 'down';
  const confidence = Math.round(Math.random() * 20 + 75);

  if (!isClient || !user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Prévisions</h1>

        {/* Simulation Form */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Paramètres de simulation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Période
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Métrique
              </label>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as Metric)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="revenue">Revenu</option>
                <option value="orders">Commandes</option>
                <option value="customers">Clients</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSimulate}
                className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Simuler
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {hasResults && (
          <>
            {/* Prediction Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Tendance</p>
                <p className="text-2xl font-bold text-foreground flex items-center gap-2">
                  {trend === 'up' ? '📈' : '📉'}
                  {trend === 'up' ? 'Hausse' : 'Baisse'}
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Confiance</p>
                <p className="text-2xl font-bold text-secondary">{confidence}%</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-secondary h-2 rounded-full"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Moyenne prédite</p>
                <p className="text-2xl font-bold text-primary">
                  {(forecastData.reduce((sum, d) => sum + d.value, 0) / forecastData.length).toFixed(0)}
                  {metric === 'revenue' && 'dt'}
                </p>
              </div>
            </div>

            {/* Forecast Chart */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Prévisions de {metric === 'revenue' ? 'revenu' : metric === 'orders' ? 'commandes' : 'clients'}
              </h2>
              
              <div className="flex items-end justify-between h-64 gap-2 mb-4">
                {forecastData.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-secondary rounded-t-lg relative group cursor-pointer" style={{
                      height: `${(item.value / maxValue) * 100}%`
                    }}>
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.value}
                        {metric === 'revenue' && 'dt'}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground text-center">{item.date}</span>
                  </div>
                ))}
              </div>

              {/* Chart Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Min: </span>
                  <span className="font-bold text-foreground">
                    {Math.min(...forecastData.map(d => d.value))}
                    {metric === 'revenue' && 'dt'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Max: </span>
                  <span className="font-bold text-foreground">
                    {Math.max(...forecastData.map(d => d.value))}
                    {metric === 'revenue' && 'dt'}
                  </span>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-accent rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-4">Insights et recommandations</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• La tendance {'👆' || '👇'} suggère une {trend === 'up' ? 'augmentation' : 'diminution'} probable</li>
                <li>• Préparez vos ressources en conséquence</li>
                <li>• Niveau de confiance: {confidence > 80 ? 'Élevé' : confidence > 60 ? 'Moyen' : 'Faible'}</li>
                <li>• Consultez régulièrement les prévisions pour ajuster votre stratégie</li>
              </ul>
            </div>
          </>
        )}

        {!hasResults && (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <svg
              className="w-16 h-16 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Lancez une simulation
            </h3>
            <p className="text-muted-foreground">
              Configurez les paramètres ci-dessus et cliquez sur "Simuler"
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
