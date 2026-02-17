import { Trophy, RotateCcw, SkipForward } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { Toast } from "@/components/Toast";

export function GameView() {
  const {
    curQ,
    revealed,
    scores,
    strikes,
    roundScore,
    ctrl,
    round,
    phase,
    curTeam,
    curPlayer,
    faceoffWin,
    faceoffFirstBuzzer,
    faceoffFirstAnswerIdx,
    faceoffPlayerIndex,
    questionRevealed,
    feedback,
    toast,
    teamNames,
    teamPlayerNames,
    setView,
    resetCurrentRound,
    resetGame,
    advanceRound,
  } = useGame();

  if (!curQ) return null;

  const roundLabel =
    round === 1
      ? "סיבוב 1 (×1)"
      : round === 2
        ? "סיבוב 2 (×2)"
        : "סיבוב 3 (×3)";
  const roundColors =
    round === 1
      ? "bg-blue-100 text-blue-700"
      : round === 2
        ? "bg-purple-100 text-purple-700"
        : "bg-red-100 text-red-700";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 p-6"
      dir="rtl"
    >
      {toast && <Toast {...toast} />}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <div
              className={`px-6 py-3 rounded-lg ${ctrl === 1 ? "bg-yellow-400" : "bg-white/20"} backdrop-blur`}
            >
              <div
                className={`text-xs mb-1 ${ctrl === 1 ? "text-blue-900" : "text-yellow-300"}`}
              >
                {teamNames.t1 || "קבוצה 1"}
              </div>
              <div
                className={`text-3xl font-bold ${ctrl === 1 ? "text-blue-900" : "text-white"}`}
              >
                {scores.t1}
              </div>
            </div>
            <div
              className={`px-6 py-3 rounded-lg ${ctrl === 2 ? "bg-yellow-400" : "bg-white/20"} backdrop-blur`}
            >
              <div
                className={`text-xs mb-1 ${ctrl === 2 ? "text-blue-900" : "text-yellow-300"}`}
              >
                {teamNames.t2 || "קבוצה 2"}
              </div>
              <div
                className={`text-3xl font-bold ${ctrl === 2 ? "text-blue-900" : "text-white"}`}
              >
                {scores.t2}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetCurrentRound}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 flex items-center gap-1 text-sm"
            >
              <RotateCcw size={16} />
              איפוס סיבוב
            </button>
            <button
              onClick={() => setView("host")}
              className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-400 text-sm"
            >
              מסך מנחה
            </button>
            <button
              onClick={resetGame}
              className="bg-white text-blue-900 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 text-sm"
            >
              ✕ יציאה
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-4">
          {[1, 2, 3].map((r) => (
            <div
              key={r}
              className={`flex-1 h-2 rounded-full ${r < round ? "bg-green-400" : r === round ? "bg-yellow-400" : "bg-white/20"}`}
            />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div
              className={`${roundColors} px-4 py-2 rounded-lg text-sm font-semibold`}
            >
              {roundLabel}
            </div>
            {questionRevealed ? (
              <h2 className="text-2xl font-bold text-blue-900 text-right flex-1 mr-3">
                {curQ.question}
              </h2>
            ) : (
              <div className="flex-1 mr-3 text-slate-400 text-right text-lg">
                ההמנחה יציג את השאלה
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {curQ.answers.map((a, i) => (
              <div
                key={i}
                className={`min-h-[4rem] p-3 rounded-lg font-bold text-lg transition-all duration-500 flex items-center justify-between ${
                  revealed.includes(i)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800"
                }`}
              >
                {revealed.includes(i) ? (
                  <>
                    <span className="text-xl">{a.text}</span>
                    <span className="text-yellow-300 text-xl">{a.points}</span>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white text-white text-xl">
                      {i + 1}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {phase !== "roundEnd" && (
            <div
              className={`min-h-[8rem] rounded-lg p-6 mb-4 border-4 text-center flex flex-col items-center justify-center ${
                feedback
                  ? feedback.type === "correct"
                    ? "bg-green-100 border-green-400"
                    : "bg-red-100 border-red-400"
                  : phase === "faceoff" && !faceoffFirstBuzzer
                    ? "bg-yellow-100 border-yellow-400"
                    : phase === "choose"
                      ? "bg-orange-100 border-orange-400"
                      : phase === "steal"
                        ? "bg-red-100 border-red-400"
                        : "bg-purple-100 border-purple-400"
              }`}
            >
              {feedback ? (
                <div className="w-full">
                  {feedback.type === "correct" ? (
                    <>
                      <div className="text-5xl mb-2">✔</div>
                      <div className="text-2xl font-bold mb-1">
                        {feedback.answer.text}
                      </div>
                      <div className="text-4xl font-bold text-green-600">
                        {feedback.points} נקודות!
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl mb-2">✗</div>
                      <div className="text-2xl font-bold">לא נמצא</div>
                    </>
                  )}
                </div>
              ) : phase === "faceoff" && !faceoffFirstBuzzer ? (
                <h3 className="text-xl font-bold text-yellow-900">
                  {faceoffFirstAnswerIdx !== null
                    ? "פנים מול פנים – המתן לתשובה השנייה"
                    : "פנים מול פנים – המתן לבחירת המנחה"}
                </h3>
              ) : phase === "faceoff" && faceoffFirstBuzzer && !faceoffWin ? (
                <h3 className="text-xl font-bold text-purple-900">
                  {teamNames[curTeam === 1 ? "t1" : "t2"]} -{" "}
                  {teamPlayerNames[curTeam === 1 ? "t1" : "t2"]?.[
                    faceoffPlayerIndex
                  ] || `שחקן ${faceoffPlayerIndex + 1}`}{" "}
                  (פנים מול פנים)
                </h3>
              ) : phase === "choose" ? (
                <h3 className="text-xl font-bold text-orange-900">
                  {faceoffWin === null
                    ? "המנחה בוחר איזו קבוצה נתנה את התשובה הנכונה"
                    : `${teamNames[faceoffWin === 1 ? "t1" : "t2"]} ניצחה בפנים מול פנים!`}
                  <br />
                  <span className="text-lg text-orange-700 font-normal">
                    {faceoffWin === null
                      ? "ולאחר מכן לשחק או להעביר"
                      : "המנחה יבחר – לשחק או להעביר"}
                  </span>
                </h3>
              ) : phase === "play" || phase === "steal" ? (
                <h3
                  className={`text-xl font-bold ${phase === "steal" ? "text-red-900" : "text-purple-900"}`}
                >
                  {phase === "play" &&
                    `${teamNames[curTeam === 1 ? "t1" : "t2"]} - ${teamPlayerNames[curTeam === 1 ? "t1" : "t2"]?.[curPlayer] || `שחקן ${curPlayer + 1}`}`}
                  {phase === "steal" &&
                    ctrl &&
                    `${teamNames[ctrl === 1 ? "t2" : "t1"]} עכשיו בשליטה - מנסה לגנוב! 🔥`}
                </h3>
              ) : null}
            </div>
          )}

          {phase === "roundEnd" && (
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-400 rounded-lg p-6 mb-4 text-center">
              <Trophy className="mx-auto text-yellow-500 mb-2" size={48} />
              <h3 className="text-2xl font-bold text-green-900 mb-1">
                סיבוב {round} הסתיים!
              </h3>
              <p className="text-green-700 mb-4">
                {teamNames.t1 || "קבוצה 1"}: {scores.t1} |{" "}
                {teamNames.t2 || "קבוצה 2"}: {scores.t2}
              </p>
              <button
                onClick={advanceRound}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <SkipForward size={20} />
                {round < 3 ? `המשך לסיבוב ${round + 1}` : "המשך לפאסט מאני"}
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-100 rounded-lg p-4 text-center">
              <div className="text-xs text-red-800 mb-1">טעויות</div>
              <div className="text-4xl font-bold text-red-600">
                {strikes > 0 ? Array(strikes).fill("X").join(" ") : "—"}
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-xs text-green-800 mb-1">ניקוד הסיבוב</div>
              <div className="text-4xl font-bold text-green-600">
                {roundScore}
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-xs text-blue-800 mb-1">שלב</div>
              <div className="text-lg font-bold text-blue-600">
                {phase === "faceoff" && "פנים מול פנים"}
                {phase === "choose" && "בחירה"}
                {phase === "play" && "משחק"}
                {phase === "steal" && "גניבה!"}
                {phase === "roundEnd" && "סיום"}
              </div>
              {ctrl && phase !== "roundEnd" && (
                <div className="text-xs text-blue-700 mt-1">
                  {teamNames[ctrl === 1 ? "t1" : "t2"]} שולטת
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
