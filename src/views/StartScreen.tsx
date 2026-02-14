import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Toast } from "@/components/Toast";

export function StartScreen() {
  const {
    startGame,
    setView,
    toast,
    storageConnected,
    storageConnecting,
    storageError,
    connectToStorage,
    disconnectStorage,
  } = useGame();
  const [apiKey, setApiKey] = useState("");
  const [binId, setBinId] = useState("");

  const handleConnect = () => {
    connectToStorage(apiKey.trim(), binId.trim() || undefined);
  };

  if (!storageConnected) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 p-8 flex items-center justify-center"
        dir="rtl"
      >
        {toast && <Toast {...toast} />}
        <div className="w-full max-w-md">
          <h1
            className="text-5xl font-bold text-yellow-300 mb-6 text-center"
            style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
          >
            FAMILY FEUD
          </h1>
          <p className="text-white/80 mb-6 text-center">
            חבר ל-JSONBin לאחסון שאלות
          </p>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-yellow-200 text-sm font-semibold mb-1">
                מפתח API (חובה)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="הדבק מפתח מ-jsonbin.io"
                className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/50"
              />
            </div>
            <div>
              <label className="block text-yellow-200 text-sm font-semibold mb-1">
                מזהה Bin (אופציונלי)
              </label>
              <input
                type="text"
                value={binId}
                onChange={(e) => setBinId(e.target.value)}
                placeholder="ריק = יצירת bin חדש"
                className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/50"
              />
            </div>
            {storageError && (
              <p className="text-red-300 text-sm">{storageError}</p>
            )}
            <button
              onClick={handleConnect}
              disabled={storageConnecting || !apiKey.trim()}
              className="w-full bg-yellow-400 text-blue-900 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {storageConnecting ? "מתחבר..." : "התחבר"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 p-8 flex items-center justify-center"
      dir="rtl"
    >
      {toast && <Toast {...toast} />}
      <div className="text-center">
        <h1
          className="text-7xl font-bold text-yellow-300 mb-4"
          style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
        >
          FAMILY FEUD
        </h1>
        <p className="text-2xl text-white mb-3">!...הסקר אומר</p>
        <p className="text-white/70 mb-10">3 סיבובים → פאסט מאני</p>
        <button
          onClick={startGame}
          className="bg-yellow-400 text-blue-900 px-14 py-6 rounded-full text-3xl font-bold hover:bg-yellow-300 transition shadow-2xl"
        >
          התחל משחק
        </button>
        <div className="mt-8 flex flex-col items-center gap-2">
          <a
            href="?host=1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500/80 text-slate-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-400 transition"
          >
            פתח מסך מנחה
          </a>
          <button
            onClick={() => setView("admin")}
            className="bg-white/20 backdrop-blur text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/30 transition"
          >
            פאנל ניהול
          </button>
          <button
            onClick={disconnectStorage}
            className="text-white/60 hover:text-white text-sm"
          >
            התנתק מ-JSONBin
          </button>
        </div>
      </div>
    </div>
  );
}
