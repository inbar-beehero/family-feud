import { useGame } from "@/context/GameContext";
import { FastMoneyReveal } from "./FastMoneyReveal";

export function FastMoneyView() {
  const {
    fmPhase,
    fmPlayer,
    fmRoundQuestions,
    fmQIdx,
    fmAnswers,
    fmMatchSelections,
    fmPoints,
    fmSameAnswerError,
    fmTimeRemaining,
  } = useGame();

  if (fmPhase === "reveal") {
    return <FastMoneyReveal />;
  }

  if (fmPhase === "player1_result") {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-900 p-6 flex flex-col items-center justify-center"
        dir="rtl"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl font-bold text-yellow-300 mb-6"
            style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
          >
            פאסט מאני - שחקן 1
          </h1>
          <div className="bg-white rounded-lg shadow-2xl p-12">
            <div className="text-7xl font-bold text-blue-600">
              {fmPoints.p1} נקודות
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fmPhase === "player1_match") {
    const p = 1;
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-900 p-6"
        dir="rtl"
      >
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl font-bold text-yellow-300 mb-6"
            style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
          >
            פאסט מאני - שחקן {p}
          </h1>
          <div className="bg-white rounded-lg shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-blue-900 text-right mb-4">
              המנחה בוחר התאמות
            </h2>
            <div className="space-y-2 mt-4">
              {Array.from({ length: 5 }, (_, i) => {
                const key = `p${p}_q${i}`;
                const ans = fmAnswers[key] || "";
                const sel = fmMatchSelections[key];
                const matched = key in fmMatchSelections;
                const pts =
                  matched && sel !== null && fmRoundQuestions[i]?.answers[sel]
                    ? fmRoundQuestions[i].answers[sel].points
                    : matched
                      ? 0
                      : null;
                return (
                  <div
                    key={i}
                    className={`p-4 rounded-lg text-right flex justify-between items-center ${
                      matched
                        ? pts !== null && pts > 0
                          ? "bg-green-100 border-2 border-green-300"
                          : "bg-red-100 border-2 border-red-300"
                        : "bg-gray-100 border-2 border-gray-200"
                    }`}
                  >
                    <span className="font-bold text-xl text-blue-900">
                      {ans || "..."}
                    </span>
                    {pts !== null && (
                      <span
                        className={`font-bold text-2xl ${
                          pts > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {pts} נק׳
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentPlayer = fmPlayer;
  const showTimer = fmPhase === "player1" || fmPhase === "player2";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-900 p-6"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto">
        {showTimer && (
          <div className="mb-6 flex justify-center">
            <div
              className={`px-8 py-4 rounded-xl text-5xl font-bold ${
                fmTimeRemaining <= 10
                  ? "bg-red-600 text-white animate-pulse"
                  : fmTimeRemaining <= 20
                    ? "bg-amber-500 text-slate-900"
                    : "bg-white/90 text-yellow-900"
              }`}
            >
              {fmTimeRemaining}
            </div>
          </div>
        )}
        {fmSameAnswerError && (
          <div className="mb-6 p-6 bg-red-600 text-white rounded-lg text-center text-3xl font-bold animate-pulse">
            תשובה זהה!
          </div>
        )}
        <h1
          className="text-4xl font-bold text-yellow-300 mb-6"
          style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
        >
          פאסט מאני - שחקן {currentPlayer}
        </h1>
        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
          {fmRoundQuestions[fmQIdx] && (
            <h2 className="text-2xl font-bold text-blue-900 text-right mb-4">
              {fmRoundQuestions[fmQIdx].question}
            </h2>
          )}
          <p className="text-gray-500 text-lg mb-4 text-right">
            המנחה מקליד תשובה
          </p>
          <div className="space-y-2 mt-4">
            {Array.from({ length: 5 }, (_, i) => {
              const ans = fmAnswers[`p${currentPlayer}_q${i}`];
              return (
                <div
                  key={i}
                  className={`p-4 rounded-lg text-right ${
                    ans
                      ? "bg-green-100 border-2 border-green-300"
                      : "bg-gray-100 border-2 border-gray-200"
                  }`}
                >
                  <span className="font-bold text-xl text-blue-900">
                    {ans || "..."}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
