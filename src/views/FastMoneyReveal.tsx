import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";

const CELEBRATION_DURATION_MS = 5000;
const CONFETTI_COLORS = [
  "#fbbf24",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
];

function CelebrationOverlay({ onEnd }: { onEnd: () => void }) {
  useEffect(() => {
    const t = setTimeout(onEnd, CELEBRATION_DURATION_MS);
    return () => clearTimeout(t);
  }, [onEnd]);

  const fromTop = Array.from({ length: 50 }, (_, i) => ({
    id: `t-${i}`,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 4 + Math.random() * 2,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 10 + Math.random() * 14,
    rotation: Math.random() * 360,
  }));
  const fromSides = Array.from({ length: 40 }, (_, i) => ({
    id: `s-${i}`,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    color: CONFETTI_COLORS[(i + 2) % CONFETTI_COLORS.length],
    size: 8 + Math.random() * 10,
    rotation: Math.random() * 360,
    fromLeft: i % 2 === 0,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {fromTop.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.left}%`,
            top: "-30px",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animation: `celebrate-fall ${p.duration}s linear ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      {fromSides.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: p.fromLeft ? "-30px" : "auto",
            right: p.fromLeft ? "auto" : "-30px",
            top: `${p.top}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animation: `${p.fromLeft ? "celebrate-right" : "celebrate-left"} ${p.duration}s linear ${p.delay}s forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function FastMoneyReveal() {
  const {
    fmRoundQuestions,
    fmAnswers,
    fmDetails,
    fmRevealedIndices,
    fmRevealingQIdx,
    fmRevealStep,
    resetGame,
    fmPoints,
  } = useGame();

  const [celebration, setCelebration] = useState(false);

  const getPts = (key: string) => {
    const d = fmDetails[key];
    if (!d) return null;
    return d.matched && d.points !== undefined ? d.points : 0;
  };

  const getRowData = (i: number) => {
    const isRevealing = fmRevealingQIdx === i;
    const isRevealed = fmRevealedIndices.includes(i);
    const showP1 = isRevealed || (isRevealing && fmRevealStep >= 1);
    const showP2 = isRevealed || (isRevealing && fmRevealStep >= 2);
    const a1 = fmAnswers[`p1_q${i}`] || "";
    const a2 = fmAnswers[`p2_q${i}`] || "";
    const d1 = fmDetails[`p1_q${i}`];
    const d2 = fmDetails[`p2_q${i}`];
    const pp1 = d1 && d1.matched && d1.points !== undefined ? d1.points : 0;
    const pp2 = d2 && d2.matched && d2.points !== undefined ? d2.points : 0;
    return {
      p1: showP1 ? { text: a1 || "—", pts: pp1 } : null,
      p2: showP2 ? { text: a2 || "—", pts: pp2 } : null,
    };
  };

  let accumulatedTotal = 0;
  for (const i of fmRevealedIndices) {
    const p1 = getPts(`p1_q${i}`);
    const p2 = getPts(`p2_q${i}`);
    if (p1 !== null) accumulatedTotal += p1;
    if (p2 !== null) accumulatedTotal += p2;
  }
  if (fmRevealingQIdx !== null && fmRevealStep >= 1) {
    const p1 = getPts(`p1_q${fmRevealingQIdx}`);
    if (p1 !== null) accumulatedTotal += p1;
  }
  if (fmRevealingQIdx !== null && fmRevealStep >= 2) {
    const p2 = getPts(`p2_q${fmRevealingQIdx}`);
    if (p2 !== null) accumulatedTotal += p2;
  }

  const allDone = fmRevealedIndices.length === 5 && fmRevealingQIdx === null;
  const total = allDone ? fmPoints.p1 + fmPoints.p2 : accumulatedTotal;
  const won = allDone && total >= 200;

  useEffect(() => {
    if (allDone && won && !celebration) {
      setCelebration(true);
    }
  }, [allDone, won, celebration]);

  const currentQ =
    fmRevealingQIdx !== null ? fmRoundQuestions[fmRevealingQIdx] : null;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-900 p-6"
      dir="rtl"
    >
      <style>{`
        @keyframes celebrate-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes celebrate-right {
          0% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(100vw) rotate(360deg); opacity: 0; }
        }
        @keyframes celebrate-left {
          0% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(-100vw) rotate(-360deg); opacity: 0; }
        }
      `}</style>
      {celebration && (
        <CelebrationOverlay onEnd={() => setCelebration(false)} />
      )}
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-400/30 rounded-lg p-4 mb-4 text-center">
          <div className="text-xl font-bold text-yellow-200">סכום מצטבר</div>
          <div className="text-5xl font-bold text-white">
            {accumulatedTotal}
          </div>
        </div>

        {currentQ && (
          <div className="bg-white rounded-lg p-6 mb-4 border-4 border-yellow-400 shadow-xl">
            <h3 className="font-bold text-right text-2xl mb-4">
              {currentQ.question}
            </h3>
            {fmRevealStep >= 1 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">שחקן 1</div>
                  {fmRevealStep >= 1 ? (
                    <>
                      <div className="font-bold">
                        {fmAnswers[`p1_q${fmRevealingQIdx}`] || "—"}
                      </div>
                      <div className="font-bold text-green-600">
                        {fmDetails[`p1_q${fmRevealingQIdx}`]?.matched &&
                        fmDetails[`p1_q${fmRevealingQIdx}`]?.points !==
                          undefined
                          ? fmDetails[`p1_q${fmRevealingQIdx}`]!.points!
                          : 0}{" "}
                        נק׳
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">...</div>
                  )}
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">שחקן 2</div>
                  {fmRevealStep >= 2 ? (
                    <>
                      <div className="font-bold">
                        {fmAnswers[`p2_q${fmRevealingQIdx}`] || "—"}
                      </div>
                      <div className="font-bold text-green-600">
                        {fmDetails[`p2_q${fmRevealingQIdx}`]?.matched &&
                        fmDetails[`p2_q${fmRevealingQIdx}`]?.points !==
                          undefined
                          ? fmDetails[`p2_q${fmRevealingQIdx}`]!.points!
                          : 0}{" "}
                        נק׳
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">...</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!currentQ && fmRevealedIndices.length === 0 && (
          <div className="bg-white/20 rounded-lg p-6 mb-4 text-center text-yellow-200 text-xl">
            המנחה יבחר שאלה להתאמה
          </div>
        )}

        {!currentQ && fmRevealedIndices.length > 0 && !allDone && (
          <div className="bg-white/20 rounded-lg p-4 mb-4 text-center text-yellow-200">
            המנחה יבחר שאלה הבאה
          </div>
        )}

        {currentQ && (
          <div className="bg-white/90 rounded-t-lg px-6 py-4 border-x-2 border-t-2 border-yellow-300">
            <h3 className="font-bold text-right text-xl">
              {currentQ.question}
            </h3>
          </div>
        )}

        <div
          className={`bg-white overflow-hidden border-2 border-yellow-300 mb-4 rounded-lg ${
            currentQ ? "rounded-t-none border-t-0" : ""
          }`}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-yellow-100 border-b-2 border-yellow-300">
                <th className="p-3 text-right font-bold w-12">#</th>
                <th className="p-3 text-right font-bold border-r border-yellow-300">
                  שחקן 1
                </th>
                <th className="p-3 text-right font-bold">שחקן 2</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map((i) => {
                const { p1, p2 } = getRowData(i);
                const isCurrent = fmRevealingQIdx === i;
                return (
                  <tr
                    key={i}
                    className={`border-b border-yellow-200 ${
                      isCurrent ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="p-2 text-center font-bold text-gray-500">
                      {i + 1}
                    </td>
                    <td className="p-2 border-r border-yellow-200">
                      {p1 ? (
                        <span>
                          {p1.text}{" "}
                          <span className="text-green-600 font-bold">
                            ({p1.pts} נק׳)
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-400">...</span>
                      )}
                    </td>
                    <td className="p-2">
                      {p2 ? (
                        <span>
                          {p2.text}{" "}
                          <span className="text-green-600 font-bold">
                            ({p2.pts} נק׳)
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-400">...</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {currentQ && fmRevealStep >= 3 && currentQ.answers[0] && (
          <div className="bg-amber-100 border-2 border-amber-400 rounded-lg p-4 mb-4 text-center animate-pulse">
            <div className="text-sm text-amber-800 mb-1">תשובה מובילה</div>
            <div className="text-xl font-bold text-amber-900">
              {currentQ.answers[0].text}{" "}
              <span className="text-amber-700">
                ({currentQ.answers[0].points} נק׳)
              </span>
            </div>
          </div>
        )}

        {allDone && (
          <div className="bg-white rounded-lg p-6 mb-4 border-2 border-yellow-400">
            <h3 className="text-2xl font-bold text-center mb-4">תוצאה סופית</h3>
            <div className="text-4xl font-bold text-center text-yellow-600 mb-4">
              {total} נקודות
            </div>
            <div
              className={`text-2xl font-bold text-center p-4 rounded-lg ${
                won
                  ? "bg-green-100 text-green-800 border-2 border-green-500"
                  : "bg-red-50 text-red-700 border-2 border-red-300"
              }`}
            >
              {won
                ? "מזל טוב! הגעתם ל-200 נקודות! 🎉"
                : "לא הגעתם ל-200 נקודות"}
            </div>
          </div>
        )}

        <button
          onClick={resetGame}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-blue-700"
        >
          משחק חדש
        </button>
      </div>
    </div>
  );
}
