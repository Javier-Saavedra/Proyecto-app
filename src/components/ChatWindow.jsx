import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function HighlightedText({ text, query }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function MessageBubble({ msg, query }) {
  const isStudent = msg.from === "student";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex ${isStudent ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={
          "max-w-[70%] px-4 py-2 rounded-xl text-sm shadow-md " +
          (isStudent
            ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-br-none"
            : "bg-white/90 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 rounded-bl-none border")
        }
      >
        <p className="leading-relaxed">
          <HighlightedText text={msg.text} query={query} />
        </p>
        <div className="text-[10px] text-right mt-1 opacity-70">{msg.time}</div>
      </div>
    </motion.div>
  );
}

export default function ChatWindow({
  tutor,
  threads = [],
  activeThread,
  onCreateThread,
  onSelectThread,
  onSendMessage,
  onDeleteThread,
  onRenameThread,
  setSelectedTutorId,
}) {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages?.length]);

  const handleSend = () => {
    if (!input.trim() || !activeThread) return;
    if (onSendMessage) onSendMessage(input.trim());
    setInput("");
  };

  const initials = tutor.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  // Filtrar mensajes si hay búsqueda
  const filteredMessages = search
    ? (activeThread?.messages || []).filter((m) =>
        m.text.toLowerCase().includes(search.toLowerCase())
      )
    : activeThread?.messages || [];

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="p-4 border-b bg-white/70 dark:bg-gray-800/70 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedTutorId(null)}
            className="mr-1 md:hidden px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700"
            title="Volver"
          >
            ←
          </button>

          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700">
            {initials}
          </div>

          <div>
            <div className="font-semibold text-lg">{tutor.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {tutor.status === "online" ? "En línea" : tutor.status === "busy" ? "Ocupado" : "Offline"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeThread?.id || ""}
            onChange={(e) => onSelectThread(e.target.value)}
            className="px-3 py-1 rounded-lg border bg-white dark:bg-gray-700 text-sm"
          >
            {threads.map((th, idx) => (
              <option key={th.id} value={th.id}>
                {th.title || `Consulta ${idx + 1}`} ({th.messages.length})
              </option>
            ))}
          </select>

          <button
            onClick={() => onCreateThread(tutor.id)}
            className="px-3 py-1 rounded-lg bg-uca-blue text-white text-sm"
          >
            + Nueva
          </button>

          {activeThread && (
            <>
              <button
                onClick={() => {
                  const newTitle = prompt(
                    "Nuevo título para esta consulta:",
                    activeThread.title || ""
                  );
                  if (newTitle) {
                    onRenameThread(activeThread.id, newTitle);
                  }
                }}
                className="px-3 py-1 rounded-lg bg-yellow-500 text-white text-sm"
              >
                Renombrar
              </button>

              <button
                onClick={() => {
                  if (confirm("¿Eliminar esta consulta?")) {
                    onDeleteThread(activeThread.id);
                  }
                }}
                className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className="p-2 border-b bg-gray-50 dark:bg-gray-800">
        <input
          type="text"
          placeholder="Buscar en este chat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-uca-blue dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {filteredMessages.map((m, i) => (
          <MessageBubble key={i} msg={m} query={search} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white/70 dark:bg-gray-800/70 flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uca-blue"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
