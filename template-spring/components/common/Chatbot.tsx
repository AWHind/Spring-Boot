'use client';

import React, { useState, useRef, useEffect } from 'react';
import { chatApi } from '@/lib/api/client';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: QuickReply[];
}

interface QuickReply {
  label: string;
  value: string;
}

interface ResponseWithSuggestions {
  text: string;
  suggestions?: QuickReply[];
}

const FRENCH_RESPONSES = {
  greeting: {
    text: "Bienvenue à Maison Élysia! 👋 Comment puis-je vous aider aujourd&apos;hui?",
    suggestions: [
      { label: "🍽️ Consulter le menu", value: "menu" },
      { label: "📞 Informations pratiques", value: "infos" },
      { label: "🎯 Réserver une table", value: "reservation" },
    ],
  },
  menu: {
    text: "Notre menu propose une sélection raffinée de plats français authentiques. Nous avons des entrées délicieuses (Foie Gras, Escargots), des plats principaux exceptionnels (Coq au Vin, Filet de Bœuf), et des desserts exquis. Souhaitez-vous explorer notre menu complet?",
    suggestions: [
      { label: "📖 Voir le menu complet", value: "voir_menu" },
      { label: "⭐ Nos spécialités", value: "specialites" },
      { label: "🍷 Nos vins", value: "vins" },
    ],
  },
  reservation: {
    text: "Nous serions ravi de vous accueillir! Vous pouvez réserver de plusieurs façons:\n✓ Téléphone: +126 28-473-334\n✓ Email: Maison.elysia@gmail.com\n✓ Horaires: Lundi-Dimanche 11h-23h",
    suggestions: [
      { label: "📅 Réserver maintenant", value: "reserver" },
      { label: "🏪 Nos horaires", value: "horaires" },
      { label: "📍 Notre adresse", value: "adresse" },
    ],
  },
  specialities: {
    text: "Nos spécialités d&apos;excellence:\n🥩 Filet de Bœuf Rossini - 32€\n🦞 Homard Thermidor - 35€\n🍗 Magret de Canard - 26€\n🐟 Sole Meunière - 24.50€\nChaque plat est une célébration du goût!",
    suggestions: [
      { label: "📖 Menu complet", value: "menu" },
      { label: "📞 Commander", value: "commander" },
      { label: "⬅️ Retour", value: "accueil" },
    ],
  },
  hours: {
    text: "⏰ Nos horaires d&apos;ouverture:\n📅 Lundi à Dimanche: 11h00 - 23h00\n🎉 Événements spéciaux: Sur réservation\n\nNous accueillons également les groupe et événements privés.",
    suggestions: [
      { label: "🎯 Réserver une table", value: "reservation" },
      { label: "🎪 Événements spéciaux", value: "evenements" },
      { label: "📍 Nous trouver", value: "adresse" },
    ],
  },
  adresse: {
    text: "📍 Notre localisation:\n\n123 Rue de Tunis\n75001 Tunis\nTunisie\n\n🚗 Parking disponible\n🚌 Accès transport en commun\n♿ Accès handicapés",
    suggestions: [
      { label: "📞 Nous appeler", value: "contact" },
      { label: "📅 Réserver", value: "reservation" },
      { label: "🏠 Accueil", value: "accueil" },
    ],
  },
  contact: {
    text: "📞 Contactez-nous:\n☎️  Téléphone: +126 28-473-334\n📧 Email: Maison.elysia@gmail.com\n🌐 Heures: Lun-Dim 11h-23h\n\nNous répondons rapidement à tous vos messages!",
    suggestions: [
      { label: "📅 Réserver", value: "reservation" },
      { label: "📍 Localisation", value: "adresse" },
      { label: "🎯 Menu", value: "menu" },
    ],
  },
  delivery: {
    text: "🚚 Livraison à domicile:\n✓ Disponible dans la région de Tunis\n✓ Retrait sur place possible\n✓ Commandes préparées fraiches\n✓ Livraison rapide et soignée\n\nCommandez dès maintenant!",
    suggestions: [
      { label: "📖 Voir le menu", value: "menu" },
      { label: "📞 Commander", value: "contact" },
      { label: "ℹ️ Plus d&apos;info", value: "infos" },
    ],
  },
  default: {
    text: "C&apos;est une excellente question! 🤔 Pouvez-vous préciser votre demande? Je suis là pour vous aider.",
    suggestions: [
      { label: "📖 Menu", value: "menu" },
      { label: "📅 Réserver", value: "reservation" },
      { label: "📞 Contact", value: "contact" },
    ],
  },
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: FRENCH_RESPONSES.greeting.text,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: FRENCH_RESPONSES.greeting.suggestions,
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

  const getResponse = (userMessage: string): ResponseWithSuggestions => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Greeting detection
    if (
      lowerMessage.includes('bonjour') ||
      lowerMessage.includes('bonsoir') ||
      lowerMessage.includes('salut') ||
      lowerMessage.includes('coucou')
    ) {
      return FRENCH_RESPONSES.greeting;
    }

    // Menu detection
    if (
      lowerMessage.includes('menu') ||
      lowerMessage.includes('plat') ||
      lowerMessage.includes('manger') ||
      lowerMessage.includes('voir_menu') ||
      lowerMessage === 'menu'
    ) {
      return FRENCH_RESPONSES.menu;
    }

    // Reservation detection
    if (
      lowerMessage.includes('réservation') ||
      lowerMessage.includes('réserver') ||
      lowerMessage.includes('table') ||
      lowerMessage.includes('reserver') ||
      lowerMessage === 'reservation'
    ) {
      return FRENCH_RESPONSES.reservation;
    }

    // Hours/Opening times detection
    if (
      lowerMessage.includes('heure') ||
      lowerMessage.includes('ouvert') ||
      lowerMessage.includes('fermeture') ||
      lowerMessage.includes('horaire') ||
      lowerMessage === 'horaires'
    ) {
      return FRENCH_RESPONSES.hours;
    }

    // Adresse detection
    if (
      lowerMessage.includes('adresse') ||
      lowerMessage.includes('localisation') ||
      lowerMessage.includes('où') ||
      lowerMessage.includes('situé') ||
      lowerMessage === 'adresse'
    ) {
      return FRENCH_RESPONSES.adresse;
    }

    // Contact detection
    if (
      lowerMessage.includes('contact') ||
      lowerMessage.includes('téléphone') ||
      lowerMessage.includes('email') ||
      lowerMessage.includes('appel') ||
      lowerMessage === 'contact'
    ) {
      return FRENCH_RESPONSES.contact;
    }

    // Specialities detection
    if (
      lowerMessage.includes('spécialité') ||
      lowerMessage.includes('specialite') ||
      lowerMessage.includes('recommandation') ||
      lowerMessage.includes('meilleur') ||
      lowerMessage.includes('best') ||
      lowerMessage === 'specialites'
    ) {
      return FRENCH_RESPONSES.specialities;
    }

    // Delivery detection
    if (
      lowerMessage.includes('livraison') ||
      lowerMessage.includes('livrer') ||
      lowerMessage.includes('domicile') ||
      lowerMessage.includes('commander') ||
      lowerMessage === 'commander'
    ) {
      return FRENCH_RESPONSES.delivery;
    }

    // Info detection (catch-all for general info)
    if (lowerMessage === 'infos' || lowerMessage === 'information') {
      return FRENCH_RESPONSES.hours;
    }

    // Home/back detection
    if (lowerMessage === 'accueil' || lowerMessage === 'home') {
      return FRENCH_RESPONSES.greeting;
    }

    return FRENCH_RESPONSES.default;
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (textToSend === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(textToSend);
      const responseData = getResponse(textToSend);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.botResponse || responseData.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: responseData.suggestions,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.log('[v0] Chat API error, using fallback:', error instanceof Error ? error.message : 'Unknown error');
      // Fallback to client-side response if API fails
      const responseData = getResponse(textToSend);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseData.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: responseData.suggestions,
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
      {/* Floating Chat Button - Premium Animation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center text-white font-bold text-lg group ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50'
            : 'bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/90 hover:shadow-[0_0_30px_rgba(255,107,53,0.4)] hover:scale-110'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-7 h-7 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <div className="relative flex items-center justify-center">
            <svg className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            {!isOpen && (
              <div className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1 animate-pulse"></div>
            )}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-32px)] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-[550px] overflow-hidden">
          {/* Header - Premium Style */}
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/90 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Maison Élysia</h3>
                <p className="text-xs text-white/85">Assistant virtuel</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                {/* Message Bubble */}
                <div
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        M
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-[#FF6B35] text-white rounded-br-none shadow-md'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.timestamp && (
                      <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Reply Suggestions */}
                {message.sender === 'bot' && message.suggestions && (
                  <div className="flex flex-wrap gap-2 pl-10">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(suggestion.value)}
                        disabled={isLoading}
                        className="text-xs bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/80 hover:from-[#FF6B35]/90 hover:to-[#FF6B35]/70 text-white px-3 py-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 mr-2">
                  <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Premium Style */}
          <div className="border-t border-gray-100 p-4 bg-gradient-to-b from-white to-gray-50">
            <div className="flex gap-3 items-end">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre question..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:ring-offset-0 text-sm placeholder-gray-400 transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || input.trim() === ''}
                className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/80 hover:from-[#FF6B35]/90 hover:to-[#FF6B35]/70 disabled:from-gray-300 disabled:to-gray-300 text-white p-3 rounded-full transition-all duration-200 hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4231693 C0.994623095,2.0460452 0.837654326,3.1368737 1.15159189,3.92237057 L3.03521743,10.3633636 C3.03521743,10.5204609 3.19218622,10.6775583 3.50612381,10.6775583 L16.6915026,11.4630452 C16.6915026,11.4630452 17.1624089,11.4630452 17.1624089,12.0338998 C17.1624089,12.4744748 17.1624089,12.4744748 16.6915026,12.4744748 Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
