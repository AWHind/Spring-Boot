package com.maisonelysia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DishDTO {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String image;
    private Integer rating;
    private Integer reviews;
    private Boolean vegetarian;
    private Boolean glutenFree;

}
