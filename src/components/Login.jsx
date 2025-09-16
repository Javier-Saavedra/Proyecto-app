import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí luego conectamos con el backend
    if (onLogin) onLogin({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-purple-900 to-purple-700">
      <div className="flex w-[900px] h-[500px] bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Left Card */}
        <div className="w-1/2 bg-gradient-to-b from-purple-700/60 to-black/60 flex flex-col justify-center items-center p-10 text-white">
          <h1 className="text-3xl font-bold mb-8">Echat</h1>
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            {/* Username */}
            <div className="mb-5">
              <label className="block text-sm mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Username"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="********"
                required
              />
              <p className="text-xs mt-2 text-right text-purple-300 cursor-pointer hover:underline">
                Forgot Password?
              </p>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-md hover:opacity-90 transition-all"
            >
              Sign in
            </button>

            {/* Google login */}
            <div className="flex items-center my-5">
              <div className="flex-grow border-t border-white/20"></div>
              <span className="mx-2 text-xs text-gray-300">Or continue with</span>
              <div className="flex-grow border-t border-white/20"></div>
            </div>
            <button className="w-full py-2 bg-white/10 rounded-lg border border-white/20 flex justify-center items-center gap-2 hover:bg-white/20">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Google</span>
            </button>
          </form>
        </div>

        {/* Right side */}
        <div className="w-1/2 flex flex-col justify-center items-center text-white px-8 bg-gradient-to-br from-purple-700 to-black">
          <h2 className="text-3xl font-bold mb-4">Bienvenido a Echat</h2>
          <p className="text-center text-gray-200">
            Bienvenido al Software de la Universidad Católica Americana
            <br />
            Para la Comunicación Estudiante - Tutor
          </p>
        </div>
      </div>
    </div>
  );
}
