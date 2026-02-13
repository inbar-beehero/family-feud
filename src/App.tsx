import { GameProvider, useGame } from "@/context/GameContext";
import { StartScreen } from "@/views/StartScreen";
import { AdminPanel } from "@/views/AdminPanel";
import { GameView } from "@/views/GameView";
import { FastMoneyView } from "@/views/FastMoneyView";

function AppContent() {
  const { view } = useGame();

  if (view === "start") return <StartScreen />;
  if (view === "admin") return <AdminPanel />;
  if (view === "game") return <GameView />;
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
