package com.maisonelysia.controller;

import com.maisonelysia.dto.DishDTO;
import com.maisonelysia.service.DishService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes")
@CrossOrigin(origins = "http://localhost:3000")
public class DishController {

    @Autowired
    private DishService dishService;

    /* ================= CLIENT MENU (🔥 WITH PROMO) ================= */
    @GetMapping("/client/menu")
    public ResponseEntity<List<DishDTO>> getMenuClient() {
        return ResponseEntity.ok(dishService.getAllDishes()); // 🔥 لازم service يرجّع promo
    }

    /* ================= GET ALL ================= */
    @GetMapping
    public ResponseEntity<List<DishDTO>> getAllDishes() {
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    /* ================= FILTER ================= */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<DishDTO>> getByCategory(@PathVariable String category) {

        try {
            return ResponseEntity.ok(
                    dishService.getDishesByCategory(category.toUpperCase())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /* ================= GET ONE ================= */
    @GetMapping("/{id}")
    public ResponseEntity<DishDTO> getOne(@PathVariable Long id) {

        DishDTO dish = dishService.getDishById(id);

        if (dish == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dish);
    }

    /* ================= CREATE ================= */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody DishDTO dishDTO) {

        try {

            if (dishDTO.getName() == null || dishDTO.getPrice() == null) {
                return ResponseEntity.badRequest().body("Name and price required");
            }

            DishDTO created = dishService.saveDish(dishDTO);

            return ResponseEntity.ok(created);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error create dish");
        }
    }

    /* ================= UPDATE ================= */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody DishDTO dishDTO) {

        try {

            DishDTO existing = dishService.getDishById(id);

            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            dishDTO.setId(id);

            DishDTO updated = dishService.saveDish(dishDTO);

            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error update dish");
        }
    }

    /* ================= DELETE ================= */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        try {

            DishDTO existing = dishService.getDishById(id);

            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            dishService.deleteDish(id);

            return ResponseEntity.ok("Deleted");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error delete");
        }
    }

    /* ================= PROMO STATS ================= */
    @GetMapping("/promotions/stats")
    public List<Integer> getPromoStats() {
        return List.of(1, 3, 2, 5, 4, 6, 2);
    }
}