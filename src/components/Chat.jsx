import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import Toggle from "./components/Toggle";

/* mantengo la estructura de chats con threads y persistencia (uca-chats-v2) */

export default function App() {
  const tutors = [
    { id: "juan", name: "Juan Pérez", status: "online" },
    { id: "maria", name: "María López", status: "busy" },
    { id: "carlos", name: "Carlos Ruiz", status: "offline" },
  ];

  const [selectedTutorId, setSelectedTutorId] = useState(null);

  // dark mode persistente
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("uca-dark");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("uca-dark", JSON.stringify(darkMode));
    } catch {}
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // chats con threads (lee de localStorage o crea inicial)
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("uca-chats-v2");
    if (saved) return JSON.parse(saved);

    const initial = {};
    tutors.forEach((t) => {
      const threadId = `${t.id}-t1`;
      const messages = [
        {
          from: "tutor",
          text: `Hola 👋, soy ${t.name.split(" ")[0]}. ¿En qué puedo ayudarte?`,
          time: "10:30 AM",
        },
      ];
      initial[t.id] = {
        threads: [{ id: threadId, messages, lastRead: messages.length }],
        activeThreadId: threadId,
      };
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem("uca-chats-v2", JSON.stringify(chats));
    } catch {}
  }, [chats]);

  // Crear nuevo hilo (y seleccionarlo)
  const createThread = (tutorId) => {
    if (!tutorId) return;
    const newId = `${tutorId}-${Date.now()}`;
    setChats((prev) => {
      const tutorData = prev[tutorId] || { threads: [], activeThreadId: null };
      const newThread = { id: newId, messages: [], lastRead: 0, title: "Nueva consulta" };

      return {
        ...prev,
        [tutorId]: {
          threads: [...tutorData.threads, newThread],
          activeThreadId: newId,
        },
      };
    });
    setSelectedTutorId(tutorId);
  };

  // seleccionar hilo y marcar leído
  const selectThread = (tutorId, threadId) => {
    if (!tutorId || !threadId) return;
    setChats((prev) => {
      const tutorData = prev[tutorId] || { threads: [], activeThreadId: null };
      const threads = tutorData.threads.map((th) =>
        th.id === threadId ? { ...th, lastRead: th.messages.length } : th
      );
      return { ...prev, [tutorId]: { ...tutorData, threads, activeThreadId: threadId } };
    });
    setSelectedTutorId(tutorId);
  };

  // enviar mensaje (al hilo activo)
const sendMessage = (tutorId, threadId, message) => {
  if (!tutorId || !threadId || !message?.trim()) return;
  const newMsg = {
    from: "student",
    text: message,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  setChats((prev) => {
    const tutorData = prev[tutorId] || { threads: [], activeThreadId: threadId };
    const threads = tutorData.threads.map((t) =>
      t.id === threadId
        ? { ...t, messages: [...t.messages, newMsg], lastRead: t.messages.length + 1 }
        : t
    );
    return { ...prev, [tutorId]: { ...tutorData, threads, activeThreadId: threadId } };
  });

  // Respuesta automática simulada (después de 2s)
  setTimeout(() => {
    const autoMsg = {
      from: "tutor",
      text: "He recibido tu mensaje, enseguida lo reviso 📚",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChats((prev) => {
      const tutorData = prev[tutorId];
      if (!tutorData) return prev;
      const threads = tutorData.threads.map((t) =>
        t.id === threadId
          ? { ...t, messages: [...t.messages, autoMsg] }
          : t
      );
      return { ...prev, [tutorId]: { ...tutorData, threads } };
    });
  }, 2000);
};


  // eliminar hilo
  const deleteThread = (tutorId, threadId) => {
    if (!tutorId || !threadId) return;
    setChats((prev) => {
      const tutorData = prev[tutorId];
      if (!tutorData) return prev;
      const threads = tutorData.threads.filter((t) => t.id !== threadId);
      const activeThreadId = threads.length > 0 ? threads[0].id : null;
      return { ...prev, [tutorId]: { threads, activeThreadId } };
    });
  };

  // marca leídos manual (desde ChatWindow)
  const markThreadRead = (tutorId, threadId) => {
    if (!tutorId || !threadId) return;
    setChats((prev) => {
      const tutorData = prev[tutorId];
      if (!tutorData) return prev;
      const threads = tutorData.threads.map((th) =>
        th.id === threadId ? { ...th, lastRead: th.messages.length } : th
      );
      return { ...prev, [tutorId]: { ...tutorData, threads } };
    });
  };

  const tutor = tutors.find((t) => t.id === selectedTutorId) || null;
  const tutorData = selectedTutorId ? chats[selectedTutorId] : null;
  const activeThread = tutorData?.threads?.find((th) => th.id === tutorData.activeThreadId) || null;

  return (
    <div className="min-h-screen flex relative">
      {/* Toggle fijo en la esquina */}
      <div className="absolute top-4 right-4 z-50">
        <Toggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <Sidebar
        tutors={tutors}
        selectedTutorId={selectedTutorId}
        setSelectedTutorId={setSelectedTutorId}
        chats={chats}
        onCreateThread={createThread}
      />

      <main className="flex-1 flex items-stretch bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        {tutor ? (
          <ChatWindow
            tutor={tutor}
            threads={tutorData?.threads || []}
            activeThread={activeThread}
            onCreateThread={() => createThread(tutor.id)}
            onSelectThread={(threadId) => selectThread(tutor.id, threadId)}
            onSendMessage={(text) => sendMessage(tutor.id, tutorData?.activeThreadId, text)}
            onDeleteThread={(threadId) => deleteThread(tutor.id, threadId)}
            onMarkRead={() => markThreadRead(tutor.id, tutorData?.activeThreadId)}
            setSelectedTutorId={setSelectedTutorId}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-uca-blue dark:text-uca-white mb-2">
                Bienvenido al chat UCA 🚀
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Selecciona un tutor para ver sus consultas o crea una nueva.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
