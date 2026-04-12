package com.maisonelysia.controller;

import com.maisonelysia.dto.DishDTO;
import com.maisonelysia.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes")
public class DishController {

    @Autowired
    private DishService dishService;

    @GetMapping
    public ResponseEntity<List<DishDTO>> getAllDishes() {
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<DishDTO>> getDishesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(dishService.getDishesByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DishDTO> getDishById(@PathVariable Long id) {
        DishDTO dish = dishService.getDishById(id);
        if (dish != null) {
            return ResponseEntity.ok(dish);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<DishDTO> createDish(@RequestBody DishDTO dishDTO) {
        DishDTO created = dishService.saveDish(dishDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishDTO> updateDish(@PathVariable Long id, @RequestBody DishDTO dishDTO) {
        dishDTO.setId(id);
        DishDTO updated = dishService.saveDish(dishDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.noContent().build();
    }

}
