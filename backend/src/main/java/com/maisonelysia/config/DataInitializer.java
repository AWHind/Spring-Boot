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

        // Initialize sample dishes
        dishRepository.save(new Dish(null, "Foie Gras Terrine", "Delicate terrine of foie gras with brioche crumble", 28.0, "Entrées", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 5, 127, false, true));

        dishRepository.save(new Dish(null, "Bouillabaisse", "Classic Provençal fish stew with saffron and rouille", 35.0, "Plats Principaux", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 5, 98, false, true));

        dishRepository.save(new Dish(null, "Coq au Vin", "Tender chicken braised in red wine with pearl onions", 32.0, "Plats Principaux", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 5, 156, false, true));

        dishRepository.save(new Dish(null, "Beef Bourguignon", "Succulent beef stew with mushrooms and bacon", 38.0, "Plats Principaux", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 5, 203, false, true));

        dishRepository.save(new Dish(null, "Sole Meunière", "Dover sole with butter, lemon and capers", 36.0, "Plats Principaux", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 5, 89, false, true));

        dishRepository.save(new Dish(null, "Ratatouille", "Medley of seasonal vegetables with herbs", 18.0, "Plats Principaux", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 5, 76, true, true));

        dishRepository.save(new Dish(null, "Crème Brûlée", "Silky vanilla custard with caramelized sugar", 12.0, "Desserts", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 5, 312, true, true));

        dishRepository.save(new Dish(null, "Tarte Tatin", "Caramelized apple tart with vanilla ice cream", 14.0, "Desserts", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 5, 184, true, true));

        dishRepository.save(new Dish(null, "Escargots de Bourgogne", "Snails with garlic, parsley and butter", 22.0, "Entrées", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 4, 67, false, true));

        dishRepository.save(new Dish(null, "Moules Marinières", "Mussels steamed in white wine and shallots", 24.0, "Entrées", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=95", 5, 145, false, true));

        System.out.println("Sample dishes initialized successfully!");
    }

}
