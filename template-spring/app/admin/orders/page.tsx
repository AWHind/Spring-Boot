'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useOrders } from '@/lib/contexts/OrderContext';
import { OrderStatus } from '@/lib/types';

type FilterStatus = 'all' | OrderStatus;

const statusConfig = {
  [OrderStatus.PENDING]: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  [OrderStatus.VALIDATED]: { label: 'Validée', color: 'bg-blue-100 text-blue-800' },
  [OrderStatus.CANCELLED]: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
  [OrderStatus.DELIVERED]: { label: 'Livrée', color: 'bg-green-100 text-green-800' }
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [isClient, user, router]);

  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'all') return orders;
    return orders.filter(o => o.status === selectedStatus);
  }, [orders, selectedStatus]);

  if (!isClient || !user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Gestion des commandes</h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', OrderStatus.PENDING, OrderStatus.VALIDATED, OrderStatus.DELIVERED, OrderStatus.CANCELLED] as FilterStatus[]).map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-foreground hover:bg-secondary'
              }`}
            >
              {status === 'all' ? 'Tous' : statusConfig[status as OrderStatus].label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune commande trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Articles</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Montant</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <tr key={order.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-accent/50'}>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.userId}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.items.length} article(s)</td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">{order.total.toFixed(2)}dt</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                          {statusConfig[order.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {order.status === OrderStatus.PENDING && (
                            <button
                              onClick={() => updateOrderStatus(order.id, OrderStatus.VALIDATED)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                            >
                              Valider
                            </button>
                          )}
                          {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED && (
                            <button
                              onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
                            >
                              Livrer
                            </button>
                          )}
                          {order.status !== OrderStatus.CANCELLED && (
                            <button
                              onClick={() => {
                                if (confirm('Êtes-vous sûr ?')) {
                                  updateOrderStatus(order.id, OrderStatus.CANCELLED);
                                }
                              }}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
