import { Clock } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { FastMoneyReveal } from "./FastMoneyReveal";

export function FastMoneyView() {
  const {
    fmPhase,
    fmPlayer,
    fmQuestions,
    fmQIdx,
    fmTimer,
    fmActive,
    fmAnswers,
    input,
    setInput,
    handleFmAnswer,
  } = useGame();

  if (fmPhase === "reveal") {
    return <FastMoneyReveal />;
  }

  const fmQ = fmQuestions[fmQIdx];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-900 p-6"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-4xl font-bold text-yellow-300"
            style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
          >
            פאסט מאני - שחקן {fmPlayer}
          </h1>
          <div className="bg-white/20 backdrop-blur px-5 py-2 rounded-lg flex items-center gap-2">
            <Clock className="text-yellow-300" size={28} />
            <span
              className={`text-4xl font-bold ${fmTimer <= 10 ? "text-red-400" : "text-white"}`}
            >
              {fmTimer}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
          <div className="text-sm text-gray-500 mb-1 text-right">
            שאלה {fmQIdx + 1} מתוך 5
          </div>
          <h2 className="text-2xl font-bold text-blue-900 text-right mb-4">
            {fmQ.question}
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFmAnswer()}
              placeholder="הקלד תשובה..."
              className="flex-1 px-4 py-3 text-lg border-4 border-yellow-300 rounded-lg text-right"
              autoFocus
              disabled={!fmActive}
            />
            <button
              onClick={handleFmAnswer}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-yellow-700 disabled:bg-gray-400"
              disabled={!fmActive}
            >
              שלח
            </button>
          </div>
          <div className="mt-4 space-y-1">
            {Array.from({ length: 5 }, (_, i) => {
              const ans = fmAnswers[`p${fmPlayer}_q${i}`];
              return (
                <div
                  key={i}
                  className={`p-2 rounded text-right text-sm ${ans ? "bg-green-100" : "bg-gray-50"}`}
                >
                  <span className="font-semibold">שאלה {i + 1}:</span>{" "}
                  {ans || "..."}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
