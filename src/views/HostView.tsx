import { ArrowRight, XCircle, Zap, Eye, SkipForward } from "lucide-react";
import { useGame } from "@/context/GameContext";

export function HostView() {
  const {
    view,
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
    faceoffFirstAnswerIdx,
    faceoffAwaitingWrongTeam,
    hostFaceoffWrongTeam,
    setFaceoffWin,
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
    startFastMoney,
    fmTimeLimit,
    setFmTimeLimit,
    fmPhase,
    fmPlayer,
    fmRoundQuestions,
    fmQIdx,
    fmAnswers,
    fmMatchSelections,
    fmPoints,
    input,
    setInput,
    handleFmAnswer,
    hostFmSelectMatch,
    hostFmMatchP2AndContinue,
    hostFmAdvanceToPlayer2,
    hostFmSameAnswer,
    fmRevealedIndices,
    fmRevealingQIdx,
    fmRevealStep,
    resetGame,
    teamNames,
    teamPlayerCounts,
    teamPlayerNames,
    setTeamNames,
    setTeamPlayerCounts,
    setTeamPlayerNames,
    feedback,
  } = useGame();

  if (view === "fastmoney") {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6"
        dir="rtl"
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-amber-300">
              פאסט מאני - מסך מנחה
            </h1>
            <button
              onClick={() => setView("game")}
              className="bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-500 flex items-center gap-2"
            >
              <ArrowRight size={18} />
              חזרה למשחק
            </button>
          </div>
          {fmPhase === "reveal" ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-200 mb-4">
                בחר התאמה -{" "}
                {teamPlayerNames.t2?.[0] || teamNames.t2 || "קבוצה 2"} (המשחק
                מציג שאלה ותשובת{" "}
                {teamPlayerNames.t1?.[0] || teamNames.t1 || "קבוצה 1"}, מחכה
                להתאמה)
              </h3>
              <div className="space-y-4">
                {[0, 1, 2, 3, 4].map((i) => {
                  const key = `p2_q${i}`;
                  const ans = fmAnswers[key] || "";
                  const q = fmRoundQuestions[i];
                  const sel = fmMatchSelections[key];
                  const p2Matched = key in fmMatchSelections;
                  const revealed = fmRevealedIndices.includes(i);
                  const isCurrentAndWaiting =
                    fmRevealingQIdx === i && fmRevealStep === 1;
                  const canMatch = !p2Matched && isCurrentAndWaiting;
                  if (!q) return null;
                  return (
                    <div
                      key={i}
                      className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                    >
                      <div className="text-sm text-slate-400 mb-1">
                        שאלה {i + 1}
                      </div>
                      <div className="font-bold text-white mb-2">
                        {q.question}
                      </div>
                      <div className="text-amber-300 mb-3">
                        תשובת{" "}
                        {teamPlayerNames.t2?.[0] || teamNames.t2 || "קבוצה 2"}:{" "}
                        {ans || "—"}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {q.answers.map((a, j) => (
                          <button
                            key={j}
                            onClick={() =>
                              canMatch && hostFmMatchP2AndContinue(key, j)
                            }
                            className={`px-3 py-2 rounded-lg font-bold text-sm ${
                              p2Matched && sel === j
                                ? "bg-green-600 text-white"
                                : p2Matched
                                  ? "bg-slate-600 text-slate-400"
                                  : "bg-slate-600 hover:bg-green-600 text-white"
                            }`}
                            disabled={!canMatch}
                          >
                            {a.text} ({a.points})
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            canMatch && hostFmMatchP2AndContinue(key, null)
                          }
                          className={`px-3 py-2 rounded-lg font-bold text-sm ${
                            p2Matched && sel === null
                              ? "bg-red-600 text-white"
                              : p2Matched
                                ? "bg-slate-600 text-slate-400"
                                : "bg-red-600 hover:bg-red-500 text-white"
                          }`}
                          disabled={!canMatch}
                        >
                          לא נמצא
                        </button>
                      </div>
                      {revealed && (
                        <div className="mt-2 text-sm text-green-400">
                          ✓ הוצגה
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={resetGame}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-blue-500 mt-4"
              >
                משחק חדש
              </button>
            </div>
          ) : fmPhase === "player1_result" ? (
            <div className="bg-slate-700/50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-amber-200 mb-4">
                סיכום {teamPlayerNames.t1?.[0] || teamNames.t1 || "קבוצה 1"}
              </h3>
              <div className="text-5xl font-bold text-blue-400 mb-6">
                {fmPoints.p1} נקודות
              </div>
              <button
                onClick={hostFmAdvanceToPlayer2}
                className="bg-amber-500 text-slate-900 px-8 py-3 rounded-lg text-lg font-bold hover:bg-amber-400"
              >
                המשך ל{teamPlayerNames.t2?.[0] || teamNames.t2 || "קבוצה 2"}
              </button>
            </div>
          ) : fmPhase === "player1_match" ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-amber-200 mb-4">
                בחר התאמה לכל תשובה -{" "}
                {teamPlayerNames.t1?.[0] || teamNames.t1 || "קבוצה 1"}
              </h3>
              {[0, 1, 2, 3, 4].map((i) => {
                const key = `p1_q${i}`;
                const ans = fmAnswers[key] || "";
                const q = fmRoundQuestions[i];
                const sel = fmMatchSelections[key];
                const done = key in fmMatchSelections;
                if (!q) return null;
                return (
                  <div
                    key={key}
                    className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                  >
                    <div className="text-sm text-slate-400 mb-1">
                      שאלה {i + 1}
                    </div>
                    <div className="font-bold text-white mb-2">
                      {q.question}
                    </div>
                    <div className="text-amber-300 mb-3">
                      תשובת{" "}
                      {teamPlayerNames.t1?.[0] || teamNames.t1 || "קבוצה 1"}:{" "}
                      {ans || "—"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {q.answers.map((a, j) => (
                        <button
                          key={j}
                          onClick={() => !done && hostFmSelectMatch(key, j)}
                          className={`px-3 py-2 rounded-lg font-bold text-sm ${
                            done && sel === j
                              ? "bg-green-600 text-white"
                              : done
                                ? "bg-slate-600 text-slate-400"
                                : "bg-slate-600 hover:bg-green-600 text-white"
                          }`}
                          disabled={done}
                        >
                          {a.text} ({a.points})
                        </button>
                      ))}
                      <button
                        onClick={() => !done && hostFmSelectMatch(key, null)}
                        className={`px-3 py-2 rounded-lg font-bold text-sm ${
                          done && sel === null
                            ? "bg-red-600 text-white"
                            : done
                              ? "bg-slate-600 text-slate-400"
                              : "bg-red-600 hover:bg-red-500 text-white"
                        }`}
                        disabled={done}
                      >
                        לא נמצא
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-700/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-amber-200 mb-4">
                {fmPlayer === 1
                  ? teamPlayerNames.t1?.[0] || teamNames.t1 || "קבוצה 1"
                  : teamPlayerNames.t2?.[0] || teamNames.t2 || "קבוצה 2"}{" "}
                • שאלה {fmQIdx + 1} מתוך 5
              </h3>
              {fmPlayer === 2 && (
                <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                  <div className="text-sm text-slate-400 mb-2">
                    תשובות{" "}
                    {teamPlayerNames.t1?.[0] || teamNames.t1 || "קבוצה 1"}:
                  </div>
                  <div className="space-y-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="text-white text-sm">
                        {i + 1}. {fmAnswers[`p1_q${i}`] || "—"}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={hostFmSameAnswer}
                    className="mt-3 w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold"
                  >
                    תשובה זהה
                  </button>
                </div>
              )}
              <p className="text-2xl font-bold text-white mb-4 text-right">
                {fmRoundQuestions[fmQIdx]?.question}
              </p>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFmAnswer()}
                  placeholder="הקלד תשובה..."
                  className="flex-1 px-4 py-3 text-lg border-4 border-amber-400 rounded-lg text-right bg-slate-800 text-white"
                  autoFocus
                />
                <button
                  onClick={handleFmAnswer}
                  disabled={!input.trim()}
                  className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg text-lg font-bold hover:bg-amber-400 disabled:bg-slate-600 disabled:text-slate-400"
                >
                  הבא
                </button>
              </div>
              <div className="space-y-1 mt-4">
                {Array.from({ length: 5 }, (_, i) => {
                  const ans = fmAnswers[`p${fmPlayer}_q${i}`];
                  return (
                    <div
                      key={i}
                      className={`p-2 rounded text-right text-sm ${
                        ans
                          ? "bg-green-900/50 text-green-200"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      <span className="font-semibold">שאלה {i + 1}:</span>{" "}
                      {ans || "..."}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!curQ) {
    const updateNames = (team: "t1" | "t2", index: number, value: string) => {
      const current = teamPlayerNames[team] || [];
      const next = [...current];
      if (next.length <= index)
        next.push(...Array(index - next.length + 1).fill(""));
      next[index] = value;
      setTeamPlayerNames({ ...teamPlayerNames, [team]: next });
    };
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-8"
        dir="rtl"
      >
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-bold text-amber-300 mb-6 text-center">
            הגדרת קבוצות
          </h1>
          <div className="space-y-6 mb-8">
            <div className="bg-slate-700/50 rounded-lg p-6">
              <label className="block text-amber-200 font-bold mb-2">
                שם קבוצה 1
              </label>
              <input
                type="text"
                value={teamNames.t1}
                onChange={(e) =>
                  setTeamNames({ ...teamNames, t1: e.target.value })
                }
                placeholder="קבוצה 1"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600"
              />
              <label className="block text-amber-200 font-bold mt-4 mb-2">
                מספר שחקנים (2–5)
              </label>
              <input
                type="number"
                min={2}
                max={5}
                value={teamPlayerCounts.t1}
                onChange={(e) => {
                  const v = Math.max(
                    2,
                    Math.min(5, parseInt(e.target.value, 10) || 2),
                  );
                  setTeamPlayerCounts({ ...teamPlayerCounts, t1: v });
                  const c = teamPlayerNames.t1 || [];
                  const next =
                    c.length < v
                      ? [...c, ...Array(v - c.length).fill("")]
                      : c.slice(0, v);
                  setTeamPlayerNames({ ...teamPlayerNames, t1: next });
                }}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600"
              />
              <div className="mt-3 space-y-2">
                {Array.from({ length: teamPlayerCounts.t1 }, (_, i) => (
                  <input
                    key={i}
                    type="text"
                    value={teamPlayerNames.t1[i] || ""}
                    onChange={(e) => updateNames("t1", i, e.target.value)}
                    placeholder={`שחקן ${i + 1}`}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 text-sm"
                  />
                ))}
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6">
              <label className="block text-amber-200 font-bold mb-2">
                שם קבוצה 2
              </label>
              <input
                type="text"
                value={teamNames.t2}
                onChange={(e) =>
                  setTeamNames({ ...teamNames, t2: e.target.value })
                }
                placeholder="קבוצה 2"
                className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600"
              />
              <label className="block text-amber-200 font-bold mt-4 mb-2">
                מספר שחקנים (2–5)
              </label>
              <input
                type="number"
                min={2}
                max={5}
                value={teamPlayerCounts.t2}
                onChange={(e) => {
                  const v = Math.max(
                    2,
                    Math.min(5, parseInt(e.target.value, 10) || 2),
                  );
                  setTeamPlayerCounts({ ...teamPlayerCounts, t2: v });
                  const c = teamPlayerNames.t2 || [];
                  const next =
                    c.length < v
                      ? [...c, ...Array(v - c.length).fill("")]
                      : c.slice(0, v);
                  setTeamPlayerNames({ ...teamPlayerNames, t2: next });
                }}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600"
              />
              <div className="mt-3 space-y-2">
                {Array.from({ length: teamPlayerCounts.t2 }, (_, i) => (
                  <input
                    key={i}
                    type="text"
                    value={teamPlayerNames.t2[i] || ""}
                    onChange={(e) => updateNames("t2", i, e.target.value)}
                    placeholder={`שחקן ${i + 1}`}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 text-sm"
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              startGame();
              setView("host");
            }}
            className="w-full bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-bold hover:bg-amber-400 text-xl"
          >
            התחל משחק
          </button>
        </div>
      </div>
    );
  }

  const canSelect =
    ((phase === "faceoff" && !faceoffAwaitingWrongTeam) ||
      phase === "play" ||
      phase === "steal") &&
    !feedback;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-6"
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-amber-300">מסך מנחה</h1>
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={advanceRound}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 text-sm"
            >
              דלג לסיבוב הבא
            </button>
            <div className="flex items-center gap-2">
              <span className="text-amber-200 text-sm">מגבלת זמן:</span>
              {([30, 45, 60] as const).map((sec) => (
                <button
                  key={sec}
                  onClick={() => setFmTimeLimit(sec)}
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    fmTimeLimit === sec
                      ? "bg-amber-500 text-slate-900"
                      : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
            <button
              onClick={startFastMoney}
              className="bg-yellow-600 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 text-sm"
            >
              דלג לפאסט מאני
            </button>
            <button
              onClick={() => setView("game")}
              className="bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-500 flex items-center gap-2"
            >
              <ArrowRight size={18} />
              חזרה למשחק
            </button>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>
              {teamNames.t1 || "קבוצה 1"}: {scores.t1}
            </span>
            <span>סיבוב {round}</span>
            <span>
              {teamNames.t2 || "קבוצה 2"}: {scores.t2}
            </span>
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
                (faceoffFirstBuzzer
                  ? `פנים מול פנים - ${teamNames[curTeam === 1 ? "t1" : "t2"]} ${teamPlayerNames[curTeam === 1 ? "t1" : "t2"]?.[faceoffPlayerIndex] || `שחקן ${faceoffPlayerIndex + 1}`} - בחר תשובה או לא נמצא`
                  : faceoffFirstAnswerIdx !== null
                    ? "פנים מול פנים - בחר תשובה שנייה"
                    : "פנים מול פנים - בחר תשובה מהלוח")}
              {phase === "play" &&
                `${teamNames[curTeam === 1 ? "t1" : "t2"]} - ${teamPlayerNames[curTeam === 1 ? "t1" : "t2"]?.[curPlayer] || `שחקן ${curPlayer + 1}`}`}
              {phase === "steal" &&
                ctrl &&
                `${teamNames[ctrl === 1 ? "t2" : "t1"]} עכשיו בשליטה - מנסה לגנוב`}
            </p>
          )}
        </div>

        {phase === "choose" && (
          <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-6 mb-4">
            {faceoffWin === null ? (
              <>
                <h3 className="text-xl font-bold text-center text-orange-200 mb-4">
                  איזו קבוצה נתנה את התשובה הנכונה?
                </h3>
                <div className="flex gap-3 justify-center mb-4">
                  <button
                    onClick={() => setFaceoffWin(1)}
                    className="bg-red-600 text-white px-10 py-6 rounded-lg text-xl font-bold hover:bg-red-500 flex items-center gap-2 transition"
                  >
                    <Zap size={28} />
                    {teamNames.t1 || "קבוצה 1"}
                  </button>
                  <button
                    onClick={() => setFaceoffWin(2)}
                    className="bg-blue-600 text-white px-10 py-6 rounded-lg text-xl font-bold hover:bg-blue-500 flex items-center gap-2 transition"
                  >
                    <Zap size={28} />
                    {teamNames.t2 || "קבוצה 2"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-center text-orange-200 mb-4">
                  {teamNames[faceoffWin === 1 ? "t1" : "t2"]} ניצחה בפנים מול
                  פנים
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
              </>
            )}
          </div>
        )}

        {phase === "faceoff" && faceoffAwaitingWrongTeam && (
          <div className="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-6 mb-4">
            <h3 className="text-xl font-bold text-center text-yellow-200 mb-4">
              איזו קבוצה נתנה תשובה שלא על הלוח?
            </h3>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => hostFaceoffWrongTeam(1)}
                className="bg-red-600 text-white px-10 py-6 rounded-lg text-xl font-bold hover:bg-red-500 flex items-center gap-2 transition"
              >
                {teamNames.t1 || "קבוצה 1"}
              </button>
              <button
                onClick={() => hostFaceoffWrongTeam(2)}
                className="bg-blue-600 text-white px-10 py-6 rounded-lg text-xl font-bold hover:bg-blue-500 flex items-center gap-2 transition"
              >
                {teamNames.t2 || "קבוצה 2"}
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
              {teamNames.t1 || "קבוצה 1"}: {scores.t1} |{" "}
              {teamNames.t2 || "קבוצה 2"}: {scores.t2}
            </p>
            <div className="space-y-3">
              {round === 3 && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-green-200 text-sm">
                    מגבלת זמן פאסט מאני:
                  </span>
                  {([30, 45, 60] as const).map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setFmTimeLimit(sec)}
                      className={`px-4 py-2 rounded font-bold ${
                        fmTimeLimit === sec
                          ? "bg-amber-500 text-slate-900"
                          : "bg-white/20 text-green-200 hover:bg-white/30"
                      }`}
                    >
                      {sec} שניות
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={advanceRound}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-500 flex items-center gap-2 mx-auto"
              >
                <SkipForward size={20} />
                {round < 3 ? `המשך לסיבוב ${round + 1}` : "המשך לפאסט מאני"}
              </button>
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
