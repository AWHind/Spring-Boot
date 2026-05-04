"use client";

import { useState } from "react";

export default function ChatBox() {

    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<any[]>([]);

    const sendMessage = async () => {

        const res = await fetch("http://localhost:8081/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await res.json();

        setChat([...chat,
            { type: "user", text: message },
            { type: "bot", text: data.reply }
        ]);

        setMessage("");
    };

    return (
        <div style={{ marginTop: 30 }}>

            <h3>🤖 AI Assistant</h3>

            <div style={{
                height: 200,
                overflowY: "auto",
                background: "#fff",
                padding: 10
            }}>
                {chat.map((c, i) => (
                    <p key={i}>
                        <b>{c.type === "user" ? "You" : "AI"}:</b> {c.text}
                    </p>
                ))}
            </div>

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask something..."
            />

            <button onClick={sendMessage}>Send</button>

        </div>
    );
}