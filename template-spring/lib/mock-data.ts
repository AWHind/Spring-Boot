import { User, Dish, Order, OrderStatus, Promotion, Customer } from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'client@example.com',
    name: 'Jean Dupont',
    password: 'password123',
    role: 'client',
    createdAt: new Date('2024-01-15'),
    phone: '+126 98-487-299',
    address: '123 Rue de Tunis, 75001 Tunis'
  },
  {
    id: 'user2',
    email: 'admin@example.com',
    name: 'Admin Restaurant',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'user3',
    email: 'marie@example.com',
    name: 'Marie Lefebvre',
    password: 'password123',
    role: 'client',
    createdAt: new Date('2024-02-10'),
    phone: '+126 28-356-236',
    address: '456 Avenue Habib Bourgiba 75008 Tunis'
  }
];

// Mock Dishes
export const mockDishes: Dish[] = [
  {
    id: 'dish1',
    name: 'Soupe à l\'Oignon Gratinée',
    description: 'Soupe chaude avec oignons caramélisés et pain grillé au fromage',
    price: 8.50,
    image: '/image/dish-soup.jpg',
    category: 'appetizers',
    available: true,
    rating: 4.5,
    reviews: 28
  },
  {
    id: 'dish2',
    name: 'Salade Niçoise',
    description: 'Fraîche salade avec thon, œuf, anchois et olives',
    price: 9.80,
    image: '/image/dish-salad.jpg',
    category: 'appetizers',
    available: true,
    rating: 4.7,
    reviews: 35
  },
  {
    id: 'dish3',
    name: 'Foie Gras Poêlé',
    description: 'Foie gras premium avec réduction de cassis et brioche',
    price: 18.50,
    image: '/image/dish-foie-gras.jpg',
    category: 'appetizers',
    available: true,
    rating: 4.9,
    reviews: 42
  },
  {
    id: 'dish16',
    name: 'Escargots à la Bourguignonne',
    description: 'Escargots de Bourgogne avec beurre persillé et ail',
    price: 12.00,
    image: '/image/dish-escargots.jpg',
    category: 'appetizers',
    available: true,
    rating: 4.8,
    reviews: 38
  },
  {
    id: 'dish17',
    name: 'Huîtres Fraîches',
    description: 'Sélection d\'huîtres fraiches avec sauce mignonette',
    price: 14.50,
    image: '/image/dish-oysters.jpg',
    category: 'appetizers',
    available: true,
    rating: 4.9,
    reviews: 56
  },
  {
    id: 'dish18',
    name: 'Terrine de Foie Gras',
    description: 'Terrine maison avec gelée de sauterne et toasts',
    price: 16.00,
    image: '/image/dish-terrine.jpg',
    category: 'appetizers',
    available: true,
    rating: 4.8,
    reviews: 47
  },
  {
    id: 'dish4',
    name: 'Coq au Vin',
    description: 'Poulet fermier braisé au vin rouge avec champignons et lardons',
    price: 16.90,
    image: '/image/dish-coq-au-vin.jpg',
    category: 'main',
    available: true,
    rating: 4.8,
    reviews: 52
  },
  {
    id: 'dish5',
    name: 'Filet de Boeuf Rossini',
    description: 'Filet de boeuf grillé avec foie gras et sauce périgourdine',
    price: 24.50,
    image: '/image/dish-beef.jpg',
    category: 'main',
    available: true,
    rating: 4.9,
    reviews: 68
  },
  {
    id: 'dish6',
    name: 'Sole Meunière',
    description: 'Sole frais poêlée au beurre blanc et amandes grillées',
    price: 19.80,
    image: '/image/dish-sole.jpg',
    category: 'main',
    available: true,
    rating: 4.6,
    reviews: 31
  },
  {
    id: 'dish7',
    name: 'Homard Thermidor',
    description: 'Homard bleu servi dans sa carapace avec sauce béchamel gratinée',
    price: 28.50,
    image: '/image/dish-lobster.jpg',
    category: 'main',
    available: true,
    rating: 4.8,
    reviews: 45
  },
  {
    id: 'dish8',
    name: 'Magret de Canard',
    description: 'Magret savoureux avec sauce aux cerises et légumes de saison',
    price: 17.50,
    image: '/image/dish-duck.jpg',
    category: 'main',
    available: true,
    rating: 4.7,
    reviews: 39
  },
  {
    id: 'dish19',
    name: 'Bouillabaisse Provençale',
    description: 'Soupe de poissons méditerranéens avec rouille et croûtons',
    price: 22.00,
    image: '/image/dish-bouillabaisse.jpg',
    category: 'main',
    available: true,
    rating: 4.8,
    reviews: 64
  },
  {
    id: 'dish20',
    name: 'Ratatouille Niçoise',
    description: 'Légumes confits en coulis avec fromage de chèvre et herbes provençales',
    price: 14.50,
    image: '/image/dish-ratatouille.jpg',
    category: 'main',
    available: true,
    rating: 4.6,
    reviews: 43
  },
  {
    id: 'dish21',
    name: 'Confit de Canard',
    description: 'Cuisse de canard confite avec pommes sautées et sauce périgourdine',
    price: 19.80,
    image: '/image/dish-confit-duck.jpg',
    category: 'main',
    available: true,
    rating: 4.9,
    reviews: 72
  },
  {
    id: 'dish22',
    name: 'Côte de Veau aux Morilles',
    description: 'Côte de veau grillée avec sauce aux morilles et crème fraîche',
    price: 23.50,
    image: '/image/dish-veal.jpg',
    category: 'main',
    available: true,
    rating: 4.8,
    reviews: 55
  },
  {
    id: 'dish9',
    name: 'Crème Brûlée',
    description: 'Crème vanille classique avec sucre caramélisé croquant',
    price: 7.50,
    image: '/image/dish-creme-brulee.jpg',
    category: 'desserts',
    available: true,
    rating: 4.9,
    reviews: 127
  },
  {
    id: 'dish10',
    name: 'Tarte Tatin',
    description: 'Tarte aux pommes caramélisées servie chaude avec crème fraîche',
    price: 8.00,
    image: '/image/dish-tart.jpg',
    category: 'desserts',
    available: true,
    rating: 4.8,
    reviews: 91
  },
  {
    id: 'dish11',
    name: 'Mousse au Chocolat',
    description: 'Mousse aérée au chocolat noir avec cacao en poudre',
    price: 7.00,
    image: '/image/dish-mousse.jpg',
    category: 'desserts',
    available: true,
    rating: 4.7,
    reviews: 73
  },
  {
    id: 'dish23',
    name: 'Mille-feuille',
    description: 'Pâte feuilletée avec crème pâtissière et glaçage au sucre',
    price: 8.50,
    image: '/image/dish-mille-feuille.jpg',
    category: 'desserts',
    available: true,
    rating: 4.9,
    reviews: 88
  },
  {
    id: 'dish24',
    name: 'Soufflé au Grand Marnier',
    description: 'Soufflé chaud aux œufs avec liqueur Grand Marnier',
    price: 9.50,
    image: '/image/dish-souffle.jpg',
    category: 'desserts',
    available: true,
    rating: 4.8,
    reviews: 51
  },
  {
    id: 'dish25',
    name: 'Panna Cotta aux Fruits Rouges',
    description: 'Crème italienne lisse avec coulis de fraises et framboises',
    price: 8.00,
    image: '/image/dish-panna-cotta.jpg',
    category: 'desserts',
    available: true,
    rating: 4.7,
    reviews: 62
  },
  {
    id: 'dish12',
    name: 'Champagne Rosé',
    description: 'Champagne rosé premium, fruité et élégant',
    price: 45.00,
    image: '/image/dish-champagne.jpg',
    category: 'beverages',
    available: true,
    rating: 4.8,
    reviews: 18
  },
  {
    id: 'dish13',
    name: 'Vin Rouge Bordeaux',
    description: 'Bordeaux tannique et riche avec notes de fruits rouges',
    price: 35.00,
    image: '/image/dish-wine-red.jpg',
    category: 'beverages',
    available: true,
    rating: 4.7,
    reviews: 22
  },
  {
    id: 'dish26',
    name: 'Vin Blanc Bourgogne',
    description: 'Bourgogne blanc minéral et sec avec notes de noisettes',
    price: 32.00,
    image: '/image/dish-wine-white.jpg',
    category: 'beverages',
    available: true,
    rating: 4.8,
    reviews: 29
  },
  {
    id: 'dish27',
    name: 'Jus d\'Orange Frais',
    description: 'Jus d\'orange frais pressé du jour',
    price: 5.50,
    image: '/image/dish-orange-juice.jpg',
    category: 'beverages',
    available: true,
    rating: 4.9,
    reviews: 41
  },
  {
    id: 'dish28',
    name: 'Expresso Double',
    description: 'Café espresso classique double extraction',
    price: 3.50,
    image: '/image/dish-espresso.jpg',
    category: 'beverages',
    available: true,
    rating: 4.8,
    reviews: 37
  },
  {
    id: 'dish29',
    name: 'Cidre Breton',
    description: 'Cidre fermier breton artisanal légèrement sucré',
    price: 8.00,
    image: '/image/dish-cidre.jpg',
    category: 'beverages',
    available: true,
    rating: 4.7,
    reviews: 24
  },
  {
    id: 'dish14',
    name: 'Menu du Chef (3 Plats)',
    description: 'Sélection spéciale du jour : Entrée + Plat + Dessert',
    price: 42.00,
    image: '/image/dish-menu-chef.jpg',
    category: 'specials',
    available: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: 'dish15',
    name: 'Plateau de Fromages',
    description: 'Sélection de fromages français accompagnés de pain grillé',
    price: 12.50,
    image: '/image/dish-cheese.jpg',
    category: 'specials',
    available: true,
    rating: 4.6,
    reviews: 34
  },
  {
    id: 'dish30',
    name: 'Plateau de Charcuteries Premium',
    description: 'Jambon de Parme, proscuitto, saucisson avec olives et cornichons',
    price: 18.00,
    image: '/image/dish-charcuteries.jpg',
    category: 'specials',
    available: true,
    rating: 4.8,
    reviews: 46
  },
  {
    id: 'dish31',
    name: 'Dégustations du Jour (5 Petits Plats)',
    description: 'Menu découverte cuisiné par le chef - 5 portions généreuses',
    price: 48.00,
    image: '/image/dish-tasting.jpg',
    category: 'specials',
    available: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: 'dish32',
    name: 'Menu Végétarien du Chef',
    description: 'Menu 3 plats spécialement conçu pour les végétariens',
    price: 38.00,
    image: '/image/dish-vegetarian-menu.jpg',
    category: 'specials',
    available: true,
    rating: 4.7,
    reviews: 33
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order1',
    userId: 'user1',
    items: [
      { dish: mockDishes[0], quantity: 1 },
      { dish: mockDishes[3], quantity: 2 }
    ],
    status: OrderStatus.DELIVERED,
    subtotal: 42.30,
    tax: 8.46,
    total: 50.76,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
    deliveryAddress: '123 Rue de Paris, 75001 Paris'
  },
  {
    id: 'order2',
    userId: 'user1',
    items: [
      { dish: mockDishes[4], quantity: 1 },
      { dish: mockDishes[8], quantity: 2 }
    ],
    status: OrderStatus.VALIDATED,
    subtotal: 40.00,
    tax: 8.00,
    total: 48.00,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    deliveryAddress: '123 Rue de Tunis, 75001 Tunis'
  },
  {
    id: 'order3',
    userId: 'user3',
    items: [
      { dish: mockDishes[1], quantity: 2 },
      { dish: mockDishes[5], quantity: 1 }
    ],
    status: OrderStatus.PENDING,
    subtotal: 49.40,
    tax: 9.88,
    total: 59.28,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
    deliveryAddress: '456 cité  la ghazelle, 75008 aryena'
  }
];

// Mock Promotions
export const mockPromotions: Promotion[] = [
  {
    id: 'promo1',
    code: 'WELCOME10',
    description: '10% de réduction pour les nouveaux clients',
    discountPercentage: 10,
    active: true,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31')
  },
  {
    id: 'promo2',
    code: 'VALENTINE20',
    description: '20% de réduction Saint-Valentin',
    discountPercentage: 20,
    active: true,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-29')
  },
  {
    id: 'promo3',
    code: 'LOYAL15',
    description: '15% de réduction clients fidèles',
    discountPercentage: 15,
    active: true,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    targetUserId: 'user1'
  }
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'user1',
    name: 'Jean Dupont',
    email: 'client@example.com',
    totalOrders: 12,
    totalSpent: 487.50,
    lastOrderDate: new Date('2024-02-10'),
    loyaltyTier: 'gold'
  },
  {
    id: 'user3',
    name: 'Marie Lefebvre',
    email: 'marie@example.com',
    totalOrders: 5,
    totalSpent: 234.80,
    lastOrderDate: new Date('2024-02-12'),
    loyaltyTier: 'silver'
  },
  {
    id: 'user4',
    name: 'Pierre Moreau',
    email: 'pierre@example.com',
    totalOrders: 8,
    totalSpent: 356.20,
    lastOrderDate: new Date('2024-02-09'),
    loyaltyTier: 'gold'
  },
  {
    id: 'user5',
    name: 'Sophie Bernard',
    email: 'sophie@example.com',
    totalOrders: 2,
    totalSpent: 95.40,
    lastOrderDate: new Date('2024-02-05'),
    loyaltyTier: 'bronze'
  }
];
