package com.maisonelysia.controller;

import com.maisonelysia.model.Dish;
import com.maisonelysia.model.Promotion;
import com.maisonelysia.repository.DishRepository;
import com.maisonelysia.repository.PromotionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "http://localhost:3000")
public class PromotionController {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private DishRepository dishRepository;

    /* ================= CREATE ================= */
    @PostMapping
    public Promotion createPromotion(@RequestBody Map<String, Object> body) {

        Double discount = Double.valueOf(body.get("discount").toString());
        List<Integer> dishIds = (List<Integer>) body.get("dishIds");

        int duration = Integer.parseInt(body.get("duration").toString()); // 🔥 مدة
        String unit = body.get("unit").toString(); // hour / day

        List<Dish> dishes = dishRepository.findAllById(
                dishIds.stream().map(Long::valueOf).toList()
        );

        Promotion promo = new Promotion();
        promo.setDiscount(discount);
        promo.setType("PERCENT");
        promo.setActive(true);

        // 🔥 START
        promo.setStartDate(LocalDateTime.now());

        // 🔥 END
        if (unit.equals("hour")) {
            promo.setEndDate(LocalDateTime.now().plusHours(duration));
        } else {
            promo.setEndDate(LocalDateTime.now().plusDays(duration));
        }

        promo.setDishes(dishes);

        return promotionRepository.save(promo);
    }

    /* ================= GET ALL ================= */
    @GetMapping
    public List<Promotion> getAll() {
        return promotionRepository.findAll();
    }

    /* ================= DELETE ================= */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        promotionRepository.deleteById(id);
    }

    /* ================= UPDATE ================= */
    @PutMapping("/{id}")
    public Promotion update(@PathVariable Long id,
                            @RequestBody Map<String, Object> body) {

        Promotion promo = promotionRepository.findById(id).orElse(null);
        if (promo == null) return null;

        Double discount = Double.valueOf(body.get("discount").toString());
        promo.setDiscount(discount);

        return promotionRepository.save(promo);
    }
}