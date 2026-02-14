import { ArrowRight, XCircle, Zap, Eye, SkipForward } from "lucide-react";
import { useGame } from "@/context/GameContext";

export function HostView() {
  const {
    curQ,
    revealed,
    scores,
    round,
    phase,
    ctrl,
    curTeam,
    curPlayer,
    faceoffWin,
    faceoffFirstBuzzer,
    faceoffPlayerIndex,
    faceoffBothMissed,
    questionRevealed,
    revealQuestion,
    setCurTeam,
    setFaceoffFirstBuzzer,
    setFaceoffPlayerIndex,
    hostSelectAnswer,
    handlePlayOrPass,
    setView,
    startGame,
    advanceRound,
  } = useGame();

  if (!curQ) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-8 flex flex-col items-center justify-center"
        dir="rtl"
      >
        <h1 className="text-4xl font-bold text-amber-300 mb-6">מסך מנחה</h1>
        <p className="text-slate-300 mb-6">המשחק לא התחיל</p>
        <button
          onClick={() => {
            startGame();
            setView("host");
          }}
          className="bg-amber-500 text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-amber-400"
        >
          התחל משחק
        </button>
      </div>
    );
  }

  const canSelect =
    (phase === "faceoff" && faceoffFirstBuzzer) ||
    phase === "play" ||
    phase === "steal";

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6"
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">מסך מנחה</h1>
          <button
            onClick={() => setView("game")}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-500 flex items-center gap-2"
          >
            <ArrowRight size={18} />
            חזרה למשחק
          </button>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>קבוצה 1: {scores.t1}</span>
            <span>סיבוב {round}</span>
            <span>קבוצה 2: {scores.t2}</span>
          </div>
          <p className="text-xl font-bold text-white">{curQ.question}</p>
          {!questionRevealed && (
            <button
              onClick={revealQuestion}
              className="mt-3 bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-400 flex items-center gap-2"
            >
              <Eye size={18} />
              הצג שאלה במשחק
            </button>
          )}
          {(phase === "faceoff" || phase === "play" || phase === "steal") && (
            <p className="text-amber-300/80 text-sm mt-2">
              {phase === "faceoff" &&
                `פנים מול פנים - קבוצה ${curTeam} שחקן ${faceoffPlayerIndex + 1}`}
              {phase === "play" && `קבוצה ${curTeam} - שחקן ${curPlayer + 1}`}
              {phase === "steal" &&
                ctrl &&
                `קבוצה ${ctrl === 1 ? 2 : 1} עכשיו בשליטה - מנסה לגנוב`}
            </p>
          )}
        </div>

        {phase === "choose" && (
          <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-6 mb-4">
            <h3 className="text-xl font-bold text-center text-orange-200 mb-4">
              קבוצה {faceoffWin} ניצחה בפנים מול פנים
              <br />
              <span className="text-lg font-normal">מה הקבוצה החליטה?</span>
            </h3>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handlePlayOrPass("play")}
                className="bg-green-600 text-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-green-500"
              >
                לשחק ✓
              </button>
              <button
                onClick={() => handlePlayOrPass("pass")}
                className="bg-orange-600 text-white px-10 py-4 rounded-lg text-xl font-bold hover:bg-orange-500"
              >
                להעביר →
              </button>
            </div>
          </div>
        )}

        {phase === "faceoff" && !faceoffFirstBuzzer && (
          <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-6 mb-4">
            <h3 className="text-xl font-bold text-center text-yellow-200 mb-4">
              בחר קבוצה לשליטה בלוח
            </h3>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setFaceoffFirstBuzzer(1);
                  setCurTeam(1);
                }}
                className="bg-red-600 text-white px-10 py-6 rounded-lg text-xl font-bold hover:bg-red-500 flex items-center gap-2 transition"
              >
                <Zap size={28} />
                קבוצה 1
              </button>
              <button
                onClick={() => {
                  setFaceoffFirstBuzzer(2);
                  setCurTeam(2);
                }}
                className="bg-blue-600 text-white px-10 py-6 rounded-lg text-xl font-bold hover:bg-blue-500 flex items-center gap-2 transition"
              >
                <Zap size={28} />
                קבוצה 2
              </button>
            </div>
          </div>
        )}

        {phase === "roundEnd" && (
          <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-400 rounded-lg p-6 mb-4 text-center">
            <h3 className="text-xl font-bold text-green-200 mb-4">
              סיבוב {round} הסתיים!
            </h3>
            <p className="text-green-300 mb-4">
              קבוצה 1: {scores.t1} | קבוצה 2: {scores.t2}
            </p>
            <button
              onClick={advanceRound}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-500 flex items-center gap-2 mx-auto"
            >
              <SkipForward size={20} />
              {round < 3 ? `המשך לסיבוב ${round + 1}` : "המשך לפאסט מאני"}
            </button>
          </div>
        )}

        {phase === "faceoff" && faceoffFirstBuzzer && !faceoffWin && (
          <div className="bg-yellow-500/10 border border-yellow-400/50 rounded-lg p-4 mb-4 space-y-3">
            <p className="text-center text-yellow-200/80 text-sm">
              מי עונה כעת?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setCurTeam(1)}
                className={`px-6 py-2 rounded-lg font-bold ${
                  curTeam === 1
                    ? "bg-red-600 text-white"
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                }`}
              >
                קבוצה 1
              </button>
              <button
                onClick={() => setCurTeam(2)}
                className={`px-6 py-2 rounded-lg font-bold ${
                  curTeam === 2
                    ? "bg-blue-600 text-white"
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                }`}
              >
                קבוצה 2
              </button>
            </div>
            <p className="text-center text-yellow-200/80 text-sm">
              שחקן בפנים מול פנים (הראשון בסיבוב יהיה הבא בתור)
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => setFaceoffPlayerIndex(i)}
                  className={`w-10 h-10 rounded-lg font-bold ${
                    faceoffPlayerIndex === i
                      ? "bg-amber-500 text-slate-900"
                      : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {(phase === "faceoff" ||
          phase === "choose" ||
          phase === "play" ||
          phase === "steal") && (
          <button
            onClick={() => canSelect && hostSelectAnswer(null)}
            className="w-full bg-red-600 hover:bg-red-500 text-white p-4 rounded-lg font-bold flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSelect}
          >
            <XCircle size={24} />
            לא נמצא
          </button>
        )}

        <div className="space-y-2 mb-4">
          {curQ.answers.map((a, i) => (
            <div
              key={i}
              className={`w-full p-4 rounded-lg font-bold text-lg flex justify-between items-center ${
                revealed.includes(i)
                  ? "bg-slate-600/50 text-slate-400"
                  : canSelect
                    ? "bg-slate-600 hover:bg-green-600 text-white cursor-pointer transition"
                    : "bg-slate-600/70 text-slate-400"
              }`}
              onClick={() =>
                canSelect && !revealed.includes(i) && hostSelectAnswer(i)
              }
            >
              <span>{a.text}</span>
              <span className="text-amber-400">
                {revealed.includes(i) ? "✓" : `(${a.points} pts)`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
