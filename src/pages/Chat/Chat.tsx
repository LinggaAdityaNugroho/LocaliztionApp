import { useEffect, useState } from "react";
import echo from "./echo";
import type { Message, MessageCreatedEvent } from "./types";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/device")
      .then((res) => res.json())
      .then((data) => setMessages([...data].reverse()));
  }, []);

  useEffect(() => {
    echo
      .channel("messages-channel")
      .listen(".message.created", (e: MessageCreatedEvent) => {
        console.log("Realtime:", e.message);

        setMessages((prev) => [...prev, e.message]);
      });

    (echo.connector as any).pusher.connection.bind_global(
      (eventName: any, data: any) => {
        console.log("GLOBAL:", eventName, data);
      },
    );

    return () => {
      echo.leave("messages-channel");
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Realtime Messages (TS)</h2>

      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            padding: 10,
            marginBottom: 10,
            border: "1px solid #ddd",
          }}
        >
          {msg.message}
        </div>
      ))}
    </div>
  );
}
