import { useState, useRef, useEffect } from "react";

const TOPICS = [
  { icon: "💬", label: "Conversación", prompt: "I want to practice everyday conversation in English." },
  { icon: "📝", label: "Gramática", prompt: "Can you help me with English grammar?" },
  { icon: "📚", label: "Vocabulario", prompt: "I want to learn new vocabulary words." },
  { icon: "🗣️", label: "Pronunciación", prompt: "I need help with English pronunciation." },
  { icon: "✍️", label: "Escritura", prompt: "I want to improve my English writing." },
  { icon: "🎯", label: "Phrasal Verbs", prompt: "Can you teach me phrasal verbs?" },
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (userText) => {
    if (!userText.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.text || "Sorry, try again." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const startLesson = async (prompt) => {
    setStarted(true);
    setIsLoading(true);
    const initMsg = prompt || "Hello! I want to start learning English.";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: initMsg }] }),
      });

      const data = await response.json();
      setMessages([
        { role: "user", content: initMsg },
        { role: "assistant", content: data.text || "Hello! Welcome!" },
      ]);
    } catch {
      setMessages([{ role: "assistant", content: "⚠️ Connection error." }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatMessage = (text) =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("✏️")) {
        return (
          <div key={i} style={{
            background: "rgba(255,220,100,0.15)", borderLeft: "3px solid #f5c842",
            padding: "6px 10px", borderRadius: "0 6px 6px 0", margin: "4px 0",
            fontSize: "0.88em", fontFamily: "monospace",
          }}>{line}</div>
        );
      }
      return <p key={i} style={{ margin: "2px 0", lineHeight: 1.6 }}>{line}</p>;
    });

  if (!started) {
    return (
      <div style={{
        minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "Georgia, serif", padding: 24, color: "#fff",
      }}>
        <div style={{ textAlign: "center", maxWidth: 560 }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>🎓</div>
          <h1 style={{
            fontSize: "clamp(2rem,5vw,3rem)", fontWeight: "bold", margin: "0 0 8px",
            background: "linear-gradient(90deg,#a8edea,#fed6e3)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Mr. Ellis</h1>
          <p style={{ color: "#a0a8c0", fontSize: "1.05rem", margin: "0 0 32px", fontStyle: "italic" }}>
            Tu profesor de inglés personal · Your personal English tutor
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 28 }}>
            {TOPICS.map((t) => (
              <button key={t.label} onClick={() => startLesson(t.prompt)} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12, padding: "14px 8px", color: "#dde", cursor: "pointer",
                fontSize: "0.88rem", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(168,237,234,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{t.icon}</div>
                {t.label}
              </button>
            ))}
          </div>

          <button onClick={() => startLesson()} style={{
            background: "linear-gradient(90deg,#a8edea,#fed6e3)", border: "none",
            borderRadius: 50, padding: "14px 40px", fontSize: "1rem", fontWeight: "bold",
            cursor: "pointer", color: "#1a1a2e", boxShadow: "0 8px 24px rgba(168,237,234,0.25)",
          }}>
            ¡Empezar clase! · Start class!
          </button>
        </div>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "linear-gradient(160deg,#0f0c29,#302b63)",
      fontFamily: "Georgia, serif", color: "#e8eaf0",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.25)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "linear-gradient(135deg,#a8edea,#fed6e3)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
        }}>🎓</div>
        <div>
          <div style={{ fontWeight: "bold" }}>Mr. Ellis</div>
          <div style={{ fontSize: "0.75rem", color: "#a8edea" }}>English Teacher</div>
        </div>
        <button onClick={() => { setStarted(false); setMessages([]); }} style={{
          marginLeft: "auto", background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
          color: "#aab", cursor: "pointer", padding: "6px 12px", fontSize: "0.78rem",
        }}>← Menú</button>
      </div>

      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 16px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg,#a8edea,#fed6e3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", flexShrink: 0, marginRight: 8, marginTop: 4,
              }}>🎓</div>
            )}
            <div style={{
              maxWidth: "78%",
              background: msg.role === "user" ? "rgba(168,237,234,0.1)" : "rgba(255,255,255,0.06)",
              border: msg.role === "user" ? "1px solid rgba(168,237,234,0.3)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              padding: "12px 16px", fontSize: "0.92rem", lineHeight: 1.6,
            }}>
              {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg,#a8edea,#fed6e3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>🎓</div>
            <div style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px 18px 18px 18px", padding: "12px 18px",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(n => (
                <div key={n} style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#a8edea",
                  animation: "pulse 1.2s ease-in-out infinite",
                  animationDelay: `${n * 0.2}s`, opacity: 0.7,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.2)", display: "flex", gap: 10, flexShrink: 0,
      }}>
        <textarea
          ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type in English or Spanish... / Escribe en inglés o español..."
          rows={1} disabled={isLoading}
          style={{
            flex: 1, background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12,
            padding: "12px 16px", color: "#e8eaf0", fontSize: "0.93rem",
            resize: "none", outline: "none", fontFamily: "Georgia, serif",
          }}
        />
        <button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()} style={{
          width: 46, height: 46, borderRadius: "50%",
          background: input.trim() && !isLoading ? "linear-gradient(135deg,#a8edea,#fed6e3)" : "rgba(255,255,255,0.1)",
          border: "none", cursor: input.trim() && !isLoading ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.2rem", alignSelf: "flex-end",
        }}>➤</button>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.3);opacity:1} }
        textarea::placeholder { color: rgba(255,255,255,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>
    </div>
  );
}
