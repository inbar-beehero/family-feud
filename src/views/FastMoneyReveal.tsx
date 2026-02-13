import { Loader } from "lucide-react";
import { useGame } from "@/context/GameContext";

export function FastMoneyReveal() {
  const {
    fmQuestions,
    fmAnswers,
    fmPoints,
    fmDetails,
    fmCalculating,
    resetGame,
  } = useGame();

  const total = fmPoints.p1 + fmPoints.p2;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-900 p-6"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-5xl font-bold text-center text-yellow-300 mb-6"
          style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
        >
          פאסט מאני - תוצאות
        </h1>
        {fmCalculating ? (
          <div className="bg-white rounded-lg shadow-2xl p-12 mb-6 text-center">
            <Loader
              className="mx-auto text-yellow-600 animate-spin mb-4"
              size={48}
            />
            <p className="text-xl text-gray-700 font-bold">בודק תשובות...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
            {fmQuestions.slice(0, 5).map((q, i) => {
              const a1 = fmAnswers[`p1_q${i}`] || "";
              const a2 = fmAnswers[`p2_q${i}`] || "";
              const d1 = fmDetails[`p1_q${i}`];
              const d2 = fmDetails[`p2_q${i}`];
              const m1 = d1?.matched;
              const m2 = d2?.matched;
              return (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-3 mb-3"
                >
                  <h3 className="font-bold text-right mb-2">{q.question}</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xs text-gray-500">שחקן 1</div>
                      <div className="font-bold">{a1 || "—"}</div>
                      {m1 && d1?.answer && (
                        <div className="text-xs text-gray-400">
                          ← {d1.answer.text}
                        </div>
                      )}
                      <div
                        className={`font-bold ${m1 ? "text-green-600" : "text-red-500"}`}
                      >
                        {m1 ? `${d1?.points} נק׳` : "X"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">שחקן 2</div>
                      <div className="font-bold">{a2 || "—"}</div>
                      {m2 && d2?.answer && (
                        <div className="text-xs text-gray-400">
                          ← {d2.answer.text}
                        </div>
                      )}
                      <div
                        className={`font-bold ${m2 ? "text-green-600" : "text-red-500"}`}
                      >
                        {m2 ? `${d2?.points} נק׳` : "X"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="mt-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-6 text-center">
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="text-gray-700">שחקן 1</div>
                  <div className="text-4xl font-bold text-blue-600">
                    {fmPoints.p1}
                  </div>
                </div>
                <div>
                  <div className="text-gray-700">שחקן 2</div>
                  <div className="text-4xl font-bold text-purple-600">
                    {fmPoints.p2}
                  </div>
                </div>
              </div>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {total}
              </div>
              {total >= 200 ? (
                <div className="text-2xl font-bold text-green-600">
                  🎉 ניצחון! 🎉
                </div>
              ) : (
                <div className="text-xl font-bold text-red-600">
                  צריך 200 נקודות לניצחון ({200 - total} חסרות)
                </div>
              )}
            </div>
          </div>
        )}
        <button
          onClick={resetGame}
          disabled={fmCalculating}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          משחק חדש
        </button>
      </div>
    </div>
  );
}
