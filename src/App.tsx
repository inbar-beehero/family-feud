import { GameProvider, useGame } from "@/context/GameContext";
import { ThemeMusic } from "@/components/ThemeMusic";
import { StartScreen } from "@/views/StartScreen";
import { AdminPanel } from "@/views/AdminPanel";
import { GameView } from "@/views/GameView";
import { FastMoneyView } from "@/views/FastMoneyView";
import { HostView } from "@/views/HostView";

function AppContent() {
  const { view } = useGame();
  const isHost =
    new URLSearchParams(window.location.search).get("host") === "1";

  let content = null;
  if (isHost) content = <HostView />;
  else if (view === "start") content = <StartScreen />;
  else if (view === "admin") content = <AdminPanel />;
  else if (view === "game" || view === "host") content = <GameView />;
  else if (view === "fastmoney") content = <FastMoneyView />;

  return (
    <>
      <ThemeMusic />
      {content}
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
