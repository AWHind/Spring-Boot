package com.maisonelysia.config;

import com.maisonelysia.model.Dish;
import com.maisonelysia.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DishRepository dishRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (dishRepository.count() > 0) {
            return;
        }

        // Initialize sample French dishes (Maison Élysia)
        // Entrées
        dishRepository.save(createDish("Soupe à l'Oignon Gratinée", "Soupe traditionnelle française avec oignon caramélisé et croûte de gruyère", 12.50, "Entrées", 5, 245, false, false, true));
        dishRepository.save(createDish("Salade Niçoise", "Mélange frais de tomates, anchois, œufs et olives noires", 10.00, "Entrées", 4, 189, false, true, true));
        dishRepository.save(createDish("Foie Gras Poêlé", "Foie gras de canard poêlé avec réduction de Porto", 18.00, "Entrées", 5, 312, false, false, true));
        dishRepository.save(createDish("Escargots de Bourgogne", "Six escargots cuisinés à la bourguignonne avec beurre persillé", 14.50, "Entrées", 5, 167, false, false, true));
        dishRepository.save(createDish("Huîtres Bretonnes", "Plateau de six huîtres de Bretagne avec sauce mignonette", 16.00, "Entrées", 5, 298, false, true, true));

        // Plats Principaux
        dishRepository.save(createDish("Coq au Vin", "Coq braisé au vin rouge de Bourgogne avec légumes racines", 22.00, "Plats principaux", 5, 421, false, false, true));
        dishRepository.save(createDish("Filet de Bœuf Rossini", "Filet de bœuf avec foie gras et sauce Périgueux", 32.00, "Plats principaux", 5, 356, false, false, true));
        dishRepository.save(createDish("Sole Meunière", "Filet de sole poêlé au beurre noisette avec câpres", 24.50, "Plats principaux", 5, 289, false, false, true));
        dishRepository.save(createDish("Homard Thermidor", "Homard grillé sauce thermidor avec fromage râpé", 35.00, "Plats principaux", 5, 234, false, false, true));
        dishRepository.save(createDish("Magret de Canard", "Magret de canard rôti avec sauce aux cerises", 26.00, "Plats principaux", 5, 398, false, false, true));
        dishRepository.save(createDish("Bouillabaisse Provençale", "Soupe provençale aux poissons et fruits de mer avec rouille", 28.00, "Plats principaux", 5, 167, false, false, true));
        dishRepository.save(createDish("Ratatouille Niçoise", "Légumes méditerranéens revenus lentement", 14.00, "Plats principaux", 4, 156, true, true, true));
        dishRepository.save(createDish("Confit de Canard", "Confit de canard avec pommes Anna", 20.00, "Plats principaux", 5, 289, false, false, true));
        dishRepository.save(createDish("Côte de Veau Bonne Maman", "Côte de veau rôtie avec champignons de Paris", 27.00, "Plats principaux", 5, 234, false, false, true));

        // Desserts
        dishRepository.save(createDish("Crème Brûlée", "Crème brûlée classique avec sucre caramélisé", 8.50, "Desserts", 5, 645, true, false, true));
        dishRepository.save(createDish("Tarte Tatin", "Tarte aux pommes caramélisées inversée, servie tiède", 9.00, "Desserts", 5, 523, true, false, true));
        dishRepository.save(createDish("Mousse au Chocolat", "Mousse légère aux trois chocolats", 7.50, "Desserts", 5, 412, true, false, true));
        dishRepository.save(createDish("Mille-feuille", "Trois couches de pâte feuilletée et crème pâtissière", 8.00, "Desserts", 5, 356, true, false, true));
        dishRepository.save(createDish("Soufflé au Grand Marnier", "Soufflé chaud au Grand Marnier", 10.00, "Desserts", 5, 234, true, false, true));
        dishRepository.save(createDish("Panna Cotta", "Panna cotta vanille avec coulis de fruits rouges", 8.50, "Desserts", 4, 189, true, true, true));

        // Boissons
        dishRepository.save(createDish("Champagne Rosé", "Verre de champagne rosé (150ml)", 12.00, "Boissons", 5, 198, true, true, true));
        dishRepository.save(createDish("Vin Rouge Bordeaux", "Verre de Bordeaux prestigieux (150ml)", 10.00, "Boissons", 5, 167, true, true, true));
        dishRepository.save(createDish("Vin Blanc Alsacien", "Verre de Riesling d'Alsace (150ml)", 9.50, "Boissons", 5, 145, true, true, true));
        dishRepository.save(createDish("Jus d'Orange Frais", "Jus d'orange pressé à froid", 4.50, "Boissons", 4, 89, true, true, true));
        dishRepository.save(createDish("Espresso", "Café espresso double", 2.50, "Boissons", 5, 234, true, true, true));
        dishRepository.save(createDish("Cidre Fermier", "Cidre fermier artisanal", 6.50, "Boissons", 5, 123, true, true, true));

        // Spécialités
        dishRepository.save(createDish("Plateau de Fromages", "Sélection de 8 fromages français affinés", 15.00, "Spécialités", 5, 267, true, false, true));
        dishRepository.save(createDish("Plateau de Charcuterie", "Jambon de Parme, saucisson sec, pâtés fins", 16.50, "Spécialités", 5, 289, false, false, true));
        dishRepository.save(createDish("Menu Dégustation 5 Plats", "Menu gastronomique avec 5 plats et accord mets-vins", 85.00, "Spécialités", 5, 156, false, false, true));
        dishRepository.save(createDish("Menu Végétarien 3 Plats", "Menu complet réservé aux végétariens", 35.00, "Spécialités", 4, 78, true, false, true));
        dishRepository.save(createDish("Menu du Chef", "Surprise du chef avec produits du jour", 75.00, "Spécialités", 5, 198, false, false, true));

        System.out.println("[v0] ✓ 35 plats français de Maison Élysia initialisés avec succès!");
    }

    private Dish createDish(String name, String description, Double price, String category, Integer rating, Integer reviews, Boolean vegetarian, Boolean glutenFree, Boolean available) {
        Dish dish = new Dish();
        dish.setName(name);
        dish.setDescription(description);
        dish.setPrice(price);
        dish.setCategory(category);
        dish.setRating(rating);
        dish.setReviews(reviews);
        dish.setVegetarian(vegetarian);
        dish.setGlutenFree(glutenFree);
        dish.setAvailable(available);
        return dish;
    }

}
