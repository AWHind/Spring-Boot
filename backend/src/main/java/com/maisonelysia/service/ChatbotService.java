package com.maisonelysia.service;

import com.maisonelysia.dto.ChatMessageDTO;
import com.maisonelysia.model.ChatMessage;
import com.maisonelysia.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChatbotService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessageDTO processMessage(String userMessage) {
        String botResponse = generateBotResponse(userMessage.toLowerCase());

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setUserMessage(userMessage);
        chatMessage.setBotResponse(botResponse);
        chatMessage.setTimestamp(LocalDateTime.now());

        ChatMessage saved = chatMessageRepository.save(chatMessage);

        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setUserMessage(saved.getUserMessage());
        dto.setBotResponse(saved.getBotResponse());

        return dto;
    }

    private String generateBotResponse(String message) {
        if (message.contains("menu") || message.contains("plat") || message.contains("cuisine")) {
            return "Bienvenue! Vous pouvez explorer notre menu complet en cliquant sur 'Menu' en haut de la page. Nous proposons une cuisine contemporaine française avec des spécialités uniques.";
        }
        if (message.contains("horaire") || message.contains("heure") || message.contains("ouvert")) {
            return "Nous sommes ouvert de lundi à samedi de 11h30 à 14h00 et de 18h30 à 23h00. Le dimanche nous sommes fermes.";
        }
        if (message.contains("adresse") || message.contains("localisation") || message.contains("où")) {
            return "Notre restaurant est situé à 123 Rue de Tunis, 75001 Tunis, Tunisie. Vous pouvez nous appeler au +126 28-473-334.";
        }
        if (message.contains("téléphone") || message.contains("contact") || message.contains("appel")) {
            return "Vous pouvez nous contacter au +126 28-473-334 ou par email à Maison.elysia@gmail.com.";
        }
        if (message.contains("réservation") || message.contains("réserver") || message.contains("table")) {
            return "Vous pouvez faire une réservation en utilisant notre formulaire de réservation sur le site. Nous acceptons également les appels pour les réservations.";
        }
        if (message.contains("spécialité") || message.contains("signature") || message.contains("recommande")) {
            return "Nos spécialités incluent des plats français traditionnels réinventés avec des techniques modernes. Consultez la section 'Nos Spécialités' pour découvrir nos plats vedettes.";
        }
        if (message.contains("livraison") || message.contains("commander")) {
            return "Oui, nous proposons la livraison à domicile et le retrait sur place. Vous pouvez passer votre commande directement sur notre site dans la section Menu.";
        }
        if (message.contains("bonjour") || message.contains("salut") || message.contains("coucou")) {
            return "Bonjour! Bienvenue à Maison Élysia. Comment puis-je vous aider aujourd'hui?";
        }
        if (message.contains("merci")) {
            return "De rien! Si vous avez d'autres questions, n'hésitez pas à les poser.";
        }
        return "Merci pour votre message! Je peux vous aider avec des questions sur notre menu, réservations, horaires ou localisation. Comment puis-je vous assister?";
    }

}
