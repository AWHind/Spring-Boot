package com.maisonelysia.config;

import com.maisonelysia.model.Dish;
import com.maisonelysia.model.Category; // 🔥 IMPORTANT
import com.maisonelysia.repository.DishRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private DishRepository dishRepository;

    @Override
    public void run(String... args) {

        if (dishRepository.count() > 0) {
            return;
        }

        // Entrées
        dishRepository.save(createDish("Soupe à l'Oignon Gratinée", "Soupe traditionnelle française", 12.50, "MAIN", 5, 245, false, false));
        dishRepository.save(createDish("Salade Niçoise", "Salade fraîche", 10.00, "MAIN", 4, 189, false, true));

        // Plats
        dishRepository.save(createDish("Coq au Vin", "Plat traditionnel", 22.00, "MAIN", 5, 421, false, false));
        dishRepository.save(createDish("Ratatouille", "Légumes méditerranéens", 14.00, "MAIN", 4, 156, true, true));

        // Desserts
        dishRepository.save(createDish("Crème Brûlée", "Dessert classique", 8.50, "DESSERTS", 5, 645, true, false));

        System.out.println("✔ Data initialized successfully !");
    }

    private Dish createDish(String name, String description, Double price, String category,
                            Integer rating, Integer reviews, Boolean vegetarian, Boolean glutenFree) {

        Dish dish = new Dish();

        dish.setName(name);
        dish.setDescription(description);
        dish.setPrice(price);

        // 🔥 FIX IMPORTANT
        dish.setCategory(Category.valueOf(category.toUpperCase()));

        dish.setRating(rating);
        dish.setReviews(reviews);
        dish.setVegetarian(vegetarian);
        dish.setGlutenFree(glutenFree);
        dish.setAvailable(true);

        return dish;
    }
}