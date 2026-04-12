-- =====================================================
-- Maison Élysia - Sample Data (French Cuisine)
-- =====================================================

-- Insert DISHES data
INSERT INTO dishes (name, description, price, category, rating, reviews, vegetarian, gluten_free, available) VALUES

-- ENTRÉES (Appetizers)
('Soupe à l''Oignon Gratinée', 'Soupe traditionnelle française avec oignon caramélisé et croûte de gruyère', 12.50, 'Entrées', 5, 245, false, false, true),
('Salade Niçoise', 'Mélange frais de tomates, anchois, œufs et olives noires', 10.00, 'Entrées', 4, 189, false, true, true),
('Foie Gras Poêlé', 'Foie gras de canard poêlé avec réduction de Porto', 18.00, 'Entrées', 5, 312, false, false, true),
('Escargots de Bourgogne', 'Six escargots cuisinés à la bourguignonne avec beurre persillé', 14.50, 'Entrées', 5, 167, false, false, true),
('Huîtres Bretonnes', 'Plateau de six huîtres de Bretagne avec sauce mignonette', 16.00, 'Entrées', 5, 298, false, true, true),

-- PLATS PRINCIPAUX (Main Courses)
('Coq au Vin', 'Coq braisé au vin rouge de Bourgogne avec légumes racines', 22.00, 'Plats principaux', 5, 421, false, false, true),
('Filet de Bœuf Rossini', 'Filet de bœuf avec foie gras et sauce Périgueux', 32.00, 'Plats principaux', 5, 356, false, false, true),
('Sole Meunière', 'Filet de sole poêlé au beurre noisette avec câpres', 24.50, 'Plats principaux', 5, 289, false, false, true),
('Homard Thermidor', 'Homard grillé sauce thermidor avec fromage râpé', 35.00, 'Plats principaux', 5, 234, false, false, true),
('Magret de Canard', 'Magret de canard rôti avec sauce aux cerises', 26.00, 'Plats principaux', 5, 398, false, false, true),
('Bouillabaisse Provençale', 'Soupe provençale aux poissons et fruits de mer avec rouille', 28.00, 'Plats principaux', 5, 167, false, false, true),
('Ratatouille Niçoise', 'Légumes méditerranéens revenus lentement', 14.00, 'Plats principaux', 4, 156, true, true, true),
('Confit de Canard', 'Confit de canard avec pommes Anna', 20.00, 'Plats principaux', 5, 289, false, false, true),
('Côte de Veau Bonne Maman', 'Côte de veau rôtie avec champignons de Paris', 27.00, 'Plats principaux', 5, 234, false, false, true),

-- DESSERTS (Desserts)
('Crème Brûlée', 'Crème brûlée classique avec sucre caramélisé', 8.50, 'Desserts', 5, 645, true, false, true),
('Tarte Tatin', 'Tarte aux pommes caramélisées inversée, servie tiède', 9.00, 'Desserts', 5, 523, true, false, true),
('Mousse au Chocolat', 'Mousse légère aux trois chocolats', 7.50, 'Desserts', 5, 412, true, false, true),
('Mille-feuille', 'Trois couches de pâte feuilletée et crème pâtissière', 8.00, 'Desserts', 5, 356, true, false, true),
('Soufflé au Grand Marnier', 'Soufflé chaud au Grand Marnier', 10.00, 'Desserts', 5, 234, true, false, true),
('Panna Cotta', 'Panna cotta vanille avec coulis de fruits rouges', 8.50, 'Desserts', 4, 189, true, true, true),

-- BOISSONS (Beverages)
('Champagne Rosé', 'Verre de champagne rosé (150ml)', 12.00, 'Boissons', 5, 198, true, true, true),
('Vin Rouge Bordeaux', 'Verre de Bordeaux prestigieux (150ml)', 10.00, 'Boissons', 5, 167, true, true, true),
('Vin Blanc Alsacien', 'Verre de Riesling d''Alsace (150ml)', 9.50, 'Boissons', 5, 145, true, true, true),
('Jus d''Orange Frais', 'Jus d''orange pressé à froid', 4.50, 'Boissons', 4, 89, true, true, true),
('Espresso', 'Café espresso double', 2.50, 'Boissons', 5, 234, true, true, true),
('Cidre Fermier', 'Cidre fermier artisanal', 6.50, 'Boissons', 5, 123, true, true, true),

-- SPÉCIALITÉS (Specialties)
('Plateau de Fromages', 'Sélection de 8 fromages français affinés', 15.00, 'Spécialités', 5, 267, true, false, true),
('Plateau de Charcuterie', 'Jambon de Parme, saucisson sec, pâtés fins', 16.50, 'Spécialités', 5, 289, false, false, true),
('Menu Dégustation 5 Plats', 'Menu gastronomique avec 5 plats et accord mets-vins', 85.00, 'Spécialités', 5, 156, false, false, true),
('Menu Végétarien 3 Plats', 'Menu complet réservé aux végétariens', 35.00, 'Spécialités', 4, 78, true, false, true),
('Menu du Chef', 'Surprise du chef avec produits du jour', 75.00, 'Spécialités', 5, 198, false, false, true);

-- =====================================================
-- Verify Data Insertion
-- =====================================================
SELECT COUNT(*) as total_dishes FROM dishes;
SELECT COUNT(*) as total_by_category, category FROM dishes GROUP BY category;
