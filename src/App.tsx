import { GameProvider, useGame } from "@/context/GameContext";
import { StartScreen } from "@/views/StartScreen";
import { AdminPanel } from "@/views/AdminPanel";
import { GameView } from "@/views/GameView";
import { FastMoneyView } from "@/views/FastMoneyView";
import { HostView } from "@/views/HostView";

function AppContent() {
  const { view } = useGame();
  const isHost =
    new URLSearchParams(window.location.search).get("host") === "1";

  if (isHost) return <HostView />;
  if (view === "start") return <StartScreen />;
  if (view === "admin") return <AdminPanel />;
  if (view === "game") return <GameView />;
  if (view === "host") return <HostView />;
  if (view === "fastmoney") return <FastMoneyView />;

  return null;
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
