import React, { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat"; // el chat que moveremos

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {!user ? (
        <Login onLogin={(data) => setUser(data)} />
      ) : (
        <Chat user={user} />
      )}
    </>
  );
}
