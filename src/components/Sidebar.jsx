import React from "react";
import { motion } from "framer-motion";

export default function Sidebar({
  tutors,
  selectedTutorId,
  setSelectedTutorId,
  chats,
  onCreateThread,
}) {
  const truncate = (str, n = 36) => (str && str.length > n ? str.slice(0, n) + "..." : str || "—");
  const gradients = [
    "from-blue-500 to-blue-700",
    "from-indigo-500 to-purple-600",
    "from-green-400 to-teal-500",
    "from-pink-500 to-rose-500",
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-72 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-r shadow-lg transition-colors duration-300">
      <div className="p-4 text-xl font-bold text-uca-blue dark:text-uca-white">Tutores</div>

      <nav className="flex-1 overflow-y-auto space-y-1 p-2">
        {tutors.map((tutor, idx) => {
          const tutorData = chats?.[tutor.id];
          const lastThread = tutorData?.threads?.[tutorData.threads.length - 1];
          const lastMsg = lastThread?.messages?.[lastThread.messages.length - 1]?.text || "";
          const unread = tutorData?.threads?.reduce(
            (acc, th) => acc + Math.max(0, (th.messages?.length || 0) - (th.lastRead || 0)),
            0
          ) || 0;
          const initials = tutor.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("");

          return (
            <motion.button
              layout
              key={tutor.id}
              onClick={() => setSelectedTutorId(tutor.id)}
              whileHover={{ scale: 1.02 }}
              className={`w-full text-left px-3 py-2 flex items-start gap-3 rounded-lg transition ${
                selectedTutorId === tutor.id ? "bg-uca-blue/20 dark:bg-uca-blue/40" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-r ${
                    gradients[idx % gradients.length]
                  }`}
                >
                  {initials}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{tutor.name}</div>
                  {unread > 0 && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs"
                    >
                      {unread}
                    </motion.span>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                  {truncate(lastMsg)}
                </div>
              </div>

              <div className="self-start">
                <span
                  className={`w-3 h-3 rounded-full mt-1 ${
                    tutor.status === "online" ? "bg-green-400" : tutor.status === "busy" ? "bg-yellow-400" : "bg-gray-400"
                  }`}
                />
              </div>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => {
            if (!selectedTutorId) return;
            onCreateThread(selectedTutorId);
          }}
          disabled={!selectedTutorId}
          className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Nueva consulta
        </button>
      </div>
    </aside>
  );
}
