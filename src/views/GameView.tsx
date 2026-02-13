import { Zap, Trophy, RotateCcw, SkipForward, Loader } from "lucide-react";
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
    input,
    setInput,
    faceoffWin,
    setFaceoffWin,
    setCurTeam,
    setFaceoffFirstBuzzer,
    feedback,
    toast,
    checking,
    faceoffBothMissed,
    checkAnswer,
    handlePlayOrPass,
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
                קבוצה 1
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
                קבוצה 2
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
            <h2 className="text-2xl font-bold text-blue-900 text-right flex-1 mr-3">
              {curQ.question}
            </h2>
          </div>

          <div className="space-y-2 mb-6">
            {curQ.answers.map((a, i) => (
              <div
                key={i}
                className={`w-full p-3 rounded-lg font-bold text-lg transition-all duration-500 ${revealed.includes(i) ? "bg-blue-600 text-white" : "bg-gray-800"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl">
                    {revealed.includes(i) ? a.text : ""}
                  </span>
                  <div className="flex items-center gap-3">
                    {revealed.includes(i) && (
                      <span className="text-yellow-300 text-xl">
                        {a.points * round}
                      </span>
                    )}
                    <span
                      className={`text-xl w-8 text-center ${revealed.includes(i) ? "text-white" : "text-gray-600"}`}
                    >
                      {i + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {phase === "faceoff" && !faceoffWin && !feedback && (
            <div className="bg-yellow-100 border-4 border-yellow-400 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold text-center text-yellow-900 mb-4">
                פנים מול פנים! מי לוחצ/ת ראשון/ה?
              </h3>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setFaceoffWin(1);
                    setCurTeam(1);
                    setFaceoffFirstBuzzer(1);
                  }}
                  className="bg-red-600 text-white px-10 py-6 rounded-lg text-xl font-bold hover:bg-red-700 flex items-center gap-2 transition"
                >
                  <Zap size={28} />
                  קבוצה 1
                </button>
                <button
                  onClick={() => {
                    setFaceoffWin(2);
                    setCurTeam(2);
                    setFaceoffFirstBuzzer(2);
                  }}
                  className="bg-blue-600 text-white px-10 py-6 rounded-lg text-xl font-bold hover:bg-blue-700 flex items-center gap-2 transition"
                >
                  <Zap size={28} />
                  קבוצה 2
                </button>
              </div>
            </div>
          )}

          {((phase === "faceoff" && faceoffWin) ||
            phase === "play" ||
            phase === "steal") &&
            !feedback &&
            !checking && (
              <div
                className={`${phase === "steal" ? "bg-gradient-to-r from-red-100 to-orange-100 border-red-400" : "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400"} border-4 rounded-lg p-6 mb-4`}
              >
                <div className="text-center mb-3">
                  <h3
                    className={`text-xl font-bold mb-1 ${phase === "steal" ? "text-red-900" : "text-purple-900"}`}
                  >
                    {phase === "faceoff" &&
                      `קבוצה ${curTeam} - שחקן 1 (פנים מול פנים)`}
                    {phase === "play" &&
                      `קבוצה ${curTeam} - שחקן ${curPlayer + 1}`}
                    {phase === "steal" &&
                      `🔥 קבוצה ${curTeam} - ניסיון גניבה! 🔥`}
                  </h3>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && input.trim() && checkAnswer(input)
                    }
                    placeholder="הקלד תשובה כאן..."
                    className={`flex-1 px-4 py-3 text-lg border-4 rounded-lg text-right ${phase === "steal" ? "border-red-300" : "border-purple-300"}`}
                    autoFocus
                  />
                  <button
                    onClick={() => input.trim() && checkAnswer(input)}
                    className={`${phase === "steal" ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"} text-white px-6 py-3 rounded-lg text-lg font-bold`}
                  >
                    שלח
                  </button>
                </div>
              </div>
            )}

          {checking && !feedback && (
            <div className="bg-blue-50 border-4 border-blue-300 rounded-lg p-6 mb-4 text-center">
              <Loader
                className="mx-auto text-blue-600 animate-spin mb-2"
                size={36}
              />
              <p className="text-lg text-blue-800 font-bold">בודק תשובה...</p>
            </div>
          )}

          {feedback && (
            <div
              className={`${feedback.type === "correct" ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"} border-4 rounded-lg p-6 mb-4 text-center`}
            >
              {feedback.type === "correct" ? (
                <div>
                  <div className="text-5xl mb-2">✔</div>
                  <div className="text-2xl font-bold text-green-900 mb-1">
                    {feedback.answer.text}
                  </div>
                  <div className="text-4xl font-bold text-green-600">
                    {feedback.points} נקודות!
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-5xl mb-2">✗</div>
                  <div className="text-2xl font-bold text-red-900">
                    לא נכון!
                  </div>
                </div>
              )}
            </div>
          )}

          {phase === "choose" && !feedback && (
            <div className="bg-orange-100 border-4 border-orange-400 rounded-lg p-6 mb-4 text-center">
              <h3 className="text-xl font-bold text-orange-900 mb-4">
                {faceoffBothMissed
                  ? `שתי הקבוצות לא מצאו תשובה! קבוצה ${faceoffWin} לחצה ראשונה — לשחק או להעביר?`
                  : `קבוצה ${faceoffWin} ניצחה בפנים מול פנים! לשחק או להעביר?`}
              </h3>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handlePlayOrPass("play")}
                  className="bg-green-600 text-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-green-700"
                >
                  לשחק ✓
                </button>
                <button
                  onClick={() => handlePlayOrPass("pass")}
                  className="bg-orange-600 text-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-orange-700"
                >
                  להעביר →
                </button>
              </div>
            </div>
          )}

          {phase === "roundEnd" && (
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-400 rounded-lg p-6 mb-4 text-center">
              <Trophy className="mx-auto text-yellow-500 mb-2" size={48} />
              <h3 className="text-2xl font-bold text-green-900 mb-1">
                סיבוב {round} הסתיים!
              </h3>
              <p className="text-green-700 mb-4">
                קבוצה 1: {scores.t1} | קבוצה 2: {scores.t2}
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
                  קבוצה {ctrl} שולטת
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
