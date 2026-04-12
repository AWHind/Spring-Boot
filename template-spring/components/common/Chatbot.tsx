'use client';

import React, { useState, useRef, useEffect } from 'react';
import { chatApi } from '@/lib/api/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FRENCH_RESPONSES = {
  greeting: [
    "Bienvenue à Maison Élysia! 👋 Comment puis-je vous aider?",
    "Bonjour! Bienvenue chez nous. Avez-vous des questions?",
    "Bonsoir! Heureux de vous accueillir chez Maison Élysia.",
  ],
  menu: [
    "Notre menu propose une sélection raffinée de plats français. Souhaitez-vous connaître nos spécialités?",
    "Nous avons des entrées, plats principaux, desserts et boissons. Que préférez-vous?",
    "Consultez notre menu complet avec nos plats du jour!",
  ],
  reservation: [
    "Vous pouvez effectuer une réservation en nous appelant au +126 28-473-334.",
    "Pour réserver une table, contactez-nous directement par téléphone.",
  ],
  hours: [
    "Nous sommes ouverts du lundi au dimanche, 11h à 23h.",
    "Maison Élysia accueille ses clients tous les jours de 11h à 23h.",
  ],
  address: [
    "Nous sommes situés au 123 Rue de Tunis, 75001 Tunis.",
    "Notre adresse: 123 Rue de Tunis, Tunis.",
  ],
  contact: [
    "Vous pouvez nous joindre au +126 28-473-334 ou à Maison.elysia@gmail.com",
    "Téléphone: +126 28-473-334 | Email: Maison.elysia@gmail.com",
  ],
  specialities: [
    "Nos spécialités incluent le Coq au Vin, le Filet de Boeuf Rossini, et la Sole Meunière.",
    "Découvrez notre Menu du Chef (3 plats) et nos Dégustations du Jour!",
  ],
  delivery: [
    "Oui, nous livrons dans la région de Tunis. Commandez maintenant!",
    "Nous proposons la livraison à domicile et le retrait sur place.",
  ],
  default: [
    "C'est une excellente question! Pouvez-vous préciser?",
    "Merci de votre intérêt. Y a-t-il autre chose que je puisse faire pour vous?",
    "Je suis là pour vous aider! Avez-vous besoin d'autre chose?",
  ],
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bienvenue à Maison Élysia! 👋 Comment puis-je vous aider?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes('menu') ||
      lowerMessage.includes('plat') ||
      lowerMessage.includes('manger')
    ) {
      return FRENCH_RESPONSES.menu[Math.floor(Math.random() * FRENCH_RESPONSES.menu.length)];
    } else if (
      lowerMessage.includes('réservation') ||
      lowerMessage.includes('réserver') ||
      lowerMessage.includes('table')
    ) {
      return FRENCH_RESPONSES.reservation[Math.floor(Math.random() * FRENCH_RESPONSES.reservation.length)];
    } else if (
      lowerMessage.includes('heure') ||
      lowerMessage.includes('ouvert') ||
      lowerMessage.includes('fermeture')
    ) {
      return FRENCH_RESPONSES.hours[Math.floor(Math.random() * FRENCH_RESPONSES.hours.length)];
    } else if (
      lowerMessage.includes('adresse') ||
      lowerMessage.includes('localisation') ||
      lowerMessage.includes('où')
    ) {
      return FRENCH_RESPONSES.address[Math.floor(Math.random() * FRENCH_RESPONSES.address.length)];
    } else if (
      lowerMessage.includes('contact') ||
      lowerMessage.includes('téléphone') ||
      lowerMessage.includes('email')
    ) {
      return FRENCH_RESPONSES.contact[Math.floor(Math.random() * FRENCH_RESPONSES.contact.length)];
    } else if (
      lowerMessage.includes('spécialité') ||
      lowerMessage.includes('recommand') ||
      lowerMessage.includes('meilleur')
    ) {
      return FRENCH_RESPONSES.specialities[Math.floor(Math.random() * FRENCH_RESPONSES.specialities.length)];
    } else if (
      lowerMessage.includes('livraison') ||
      lowerMessage.includes('livrer') ||
      lowerMessage.includes('à domicile')
    ) {
      return FRENCH_RESPONSES.delivery[Math.floor(Math.random() * FRENCH_RESPONSES.delivery.length)];
    }

    return FRENCH_RESPONSES.default[Math.floor(Math.random() * FRENCH_RESPONSES.default.length)];
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(input);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.botResponse || getResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('[v0] Chat API error:', error);
      // Fallback to client-side response if API fails
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-[500px] overflow-hidden">
          {/* Header */}
          <div className="bg-[#FF6B35] text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Maison Élysia Support</h3>
              <p className="text-sm text-white/90">Réponses instantanées</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-[#FF6B35]/80 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#FF6B35] text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez une question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B35] text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || input.trim() === ''}
                className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
