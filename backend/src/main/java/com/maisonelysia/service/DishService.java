package com.maisonelysia.service;

import com.maisonelysia.dto.DishDTO;
import com.maisonelysia.model.Dish;
import com.maisonelysia.model.Category;
import com.maisonelysia.model.Promotion;
import com.maisonelysia.repository.DishRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    /* ================= GET ALL (CLIENT FIX 🔥) ================= */
    public List<DishDTO> getAllDishes() {
        return dishRepository.findAllWithPromotions() // 🔥 FIX هنا
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /* ================= FILTER (CLIENT FIX 🔥) ================= */
    public List<DishDTO> getDishesByCategory(String category) {

        Category cat = Category.valueOf(category.toUpperCase());

        return dishRepository.findByCategoryWithPromotions(cat) // 🔥 FIX هنا
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /* ================= GET ONE ================= */
    public DishDTO getDishById(Long id) {
        return dishRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    /* ================= SAVE ================= */
    public DishDTO saveDish(DishDTO dto) {
        Dish dish = convertToEntity(dto);
        Dish saved = dishRepository.save(dish);
        return convertToDTO(saved);
    }

    /* ================= DELETE ================= */
    public void deleteDish(Long id) {
        dishRepository.deleteById(id);
    }

    /* ================= PROMO CALCULATION ================= */
    private Double calculatePrice(Dish dish) {

        if (dish.getPromotions() != null) {

            for (Promotion promo : dish.getPromotions()) {

                if (Boolean.TRUE.equals(promo.getActive())) {

                    // 🔥 CHECK DATE
                    if (promo.getEndDate() != null &&
                            promo.getEndDate().isBefore(LocalDateTime.now())) {
                        continue;
                    }

                    double result;

                    if ("PERCENT".equals(promo.getType())) {
                        result = dish.getPrice() - (dish.getPrice() * promo.getDiscount() / 100);
                    } else {
                        result = dish.getPrice() - promo.getDiscount();
                    }

                    return Math.max(result, 0);
                }
            }
        }

        return dish.getPrice();
    }

    /* ================= DTO ================= */
    private DishDTO convertToDTO(Dish dish) {

        DishDTO dto = new DishDTO();

        dto.setId(dish.getId());
        dto.setName(dish.getName());
        dto.setDescription(dish.getDescription());
        dto.setPrice(dish.getPrice());

        dto.setCategory(dish.getCategory() != null
                ? dish.getCategory().name()
                : null);

        dto.setImage(dish.getImage());
        dto.setRating(dish.getRating());
        dto.setReviews(dish.getReviews());
        dto.setVegetarian(dish.getVegetarian());
        dto.setGlutenFree(dish.getGlutenFree());

        /* 🔥 APPLY PROMO */
        Double finalPrice = calculatePrice(dish);
        dto.setFinalPrice(finalPrice);

        if (dish.getPrice() != null && finalPrice < dish.getPrice()) {

            dto.setHasPromo(true);

            double discount =
                    ((dish.getPrice() - finalPrice) / dish.getPrice()) * 100;

            dto.setDiscount(Math.round(discount * 10.0) / 10.0);

        } else {
            dto.setHasPromo(false);
            dto.setDiscount(0.0);
        }

        return dto;
    }

    /* ================= ENTITY ================= */
    private Dish convertToEntity(DishDTO dto) {

        Dish dish = new Dish();

        dish.setId(dto.getId());
        dish.setName(dto.getName());
        dish.setDescription(dto.getDescription());
        dish.setPrice(dto.getPrice());

        if (dto.getCategory() != null) {
            dish.setCategory(Category.valueOf(dto.getCategory().toUpperCase()));
        }

        dish.setImage(dto.getImage());
        dish.setRating(dto.getRating());
        dish.setReviews(dto.getReviews());
        dish.setVegetarian(dto.getVegetarian());
        dish.setGlutenFree(dto.getGlutenFree());

        dish.setAvailable(true);

        return dish;
    }
}