package com.maisonelysia.service;

import com.maisonelysia.dto.DishDTO;
import com.maisonelysia.model.Dish;
import com.maisonelysia.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    public List<DishDTO> getAllDishes() {
        return dishRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DishDTO> getDishesByCategory(String category) {
        return dishRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DishDTO getDishById(Long id) {
        return dishRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public DishDTO saveDish(DishDTO dishDTO) {
        Dish dish = convertToEntity(dishDTO);
        Dish savedDish = dishRepository.save(dish);
        return convertToDTO(savedDish);
    }

    public void deleteDish(Long id) {
        dishRepository.deleteById(id);
    }

    private DishDTO convertToDTO(Dish dish) {
        return new DishDTO(
                dish.getId(),
                dish.getName(),
                dish.getDescription(),
                dish.getPrice(),
                dish.getCategory(),
                dish.getImage(),
                dish.getRating(),
                dish.getReviews(),
                dish.getVegetarian(),
                dish.getGlutenFree()
        );
    }

    private Dish convertToEntity(DishDTO dishDTO) {
        return new Dish(
                dishDTO.getId(),
                dishDTO.getName(),
                dishDTO.getDescription(),
                dishDTO.getPrice(),
                dishDTO.getCategory(),
                dishDTO.getImage(),
                dishDTO.getRating(),
                dishDTO.getReviews(),
                dishDTO.getVegetarian(),
                dishDTO.getGlutenFree()
        );
    }

}
