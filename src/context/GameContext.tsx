import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Question, FastMoneyQuestion, View } from "@/types";
import { defaultQuestions, defaultFastMoney } from "@/data/questions";
import { aiMatchFastMoney } from "@/services/aiMatch";
import { createBin, readBin, updateBin } from "@/services/jsonbin";

const STORAGE_KEY_API = "family-feud_jsonbin_api";
const STORAGE_KEY_BIN = "family-feud_jsonbin_bin";
const STORAGE_KEY_SYNC = "family-feud_sync";

type Phase = "faceoff" | "choose" | "play" | "steal" | "roundEnd";

interface GameContextValue {
  view: View;
  setView: (v: View) => void;
  storageConnected: boolean;
  storageBinId: string | null;
  storageConnecting: boolean;
  storageError: string | null;
  connectToStorage: (apiKey: string, binId?: string) => Promise<void>;
  disconnectStorage: () => void;
  persistToStorage: (
    questions: Question[],
    fmQuestions: FastMoneyQuestion[],
  ) => Promise<void>;
  questions: Question[];
  setQuestions: (q: Question[] | ((p: Question[]) => Question[])) => void;
  fmQuestions: FastMoneyQuestion[];
  setFmQuestions: (
    q: FastMoneyQuestion[] | ((p: FastMoneyQuestion[]) => FastMoneyQuestion[]),
  ) => void;
  curQ: Question | null;
  revealed: number[];
  scores: { t1: number; t2: number };
  strikes: number;
  roundScore: number;
  ctrl: number | null;
  round: number;
  phase: Phase;
  curTeam: number;
  curPlayer: number;
  input: string;
  setInput: (v: string) => void;
  faceoffWin: number | null;
  setFaceoffWin: (n: number | null) => void;
  setCurTeam: (n: number) => void;
  feedback:
    | {
        type: "correct";
        answer: { text: string; points: number };
        points: number;
      }
    | { type: "wrong" }
    | null;
  toast: { msg: string; type: "ok" | "err" | "info" } | null;
  faceoffFirstBuzzer: number | null;
  setFaceoffFirstBuzzer: (n: number | null) => void;
  faceoffPlayerIndex: number;
  setFaceoffPlayerIndex: (n: number) => void;
  faceoffBothMissed: boolean;
  faceoffFirstAnswerIdx: number | null;
  questionRevealed: boolean;
  revealQuestion: () => void;
  fmPhase: "player1" | "player2" | "reveal";
  fmPlayer: number;
  fmAnswers: Record<string, string>;
  fmPoints: { p1: number; p2: number };
  fmDetails: Record<
    string,
    {
      matched: boolean;
      answer?: { text: string; points: number };
      points?: number;
    }
  >;
  fmQIdx: number;
  fmTimer: number;
  fmActive: boolean;
  fmCalculating: boolean;
  show: (msg: string, type?: "ok" | "err" | "info") => void;
  startGame: () => void;
  resetGame: () => void;
  resetCurrentRound: () => void;
  advanceRound: () => void;
  hostSelectAnswer: (realIdx: number | null) => void;
  handlePlayOrPass: (d: "play" | "pass") => void;
  handleFmAnswer: () => void;
  startFastMoney: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function pickQuestion(
  questions: Question[],
  r: number,
  excludeIds: number[],
): Question | null {
  const avail = questions.filter(
    (q) => q.round === r && !excludeIds.includes(q.id),
  );
  if (!avail.length) return null;
  return avail[Math.floor(Math.random() * avail.length)];
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("start");
  const [storageApiKey, setStorageApiKey] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY_API) || "",
  );
  const [storageBinId, setStorageBinId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY_BIN),
  );
  const [storageConnecting, setStorageConnecting] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [fmQuestions, setFmQuestions] =
    useState<FastMoneyQuestion[]>(defaultFastMoney);
  const storageConnected = !!storageBinId && !!storageApiKey;
  const [curQ, setCurQ] = useState<Question | null>(null);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [scores, setScores] = useState({ t1: 0, t2: 0 });
  const [strikes, setStrikes] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [ctrl, setCtrl] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("faceoff");
  const [curTeam, setCurTeam] = useState(1);
  const [curPlayer, setCurPlayer] = useState(0);
  const [input, setInput] = useState("");
  const [faceoffWin, setFaceoffWin] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<
    | {
        type: "correct";
        answer: { text: string; points: number };
        points: number;
      }
    | { type: "wrong" }
    | null
  >(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err" | "info";
  } | null>(null);
  const [faceoffFirstBuzzer, setFaceoffFirstBuzzer] = useState<number | null>(
    null,
  );
  const [faceoffPlayerIndex, setFaceoffPlayerIndex] = useState(0);
  const [faceoffBothMissed, setFaceoffBothMissed] = useState(false);
  const [faceoffFirstAnswerIdx, setFaceoffFirstAnswerIdx] = useState<
    number | null
  >(null);
  const [questionRevealed, setQuestionRevealed] = useState(false);
  const [fmPhase, setFmPhase] = useState<"player1" | "player2" | "reveal">(
    "player1",
  );
  const [fmPlayer, setFmPlayer] = useState(1);
  const [fmAnswers, setFmAnswers] = useState<Record<string, string>>({});
  const [fmPoints, setFmPoints] = useState({ p1: 0, p2: 0 });
  const [fmDetails, setFmDetails] = useState<
    Record<
      string,
      {
        matched: boolean;
        answer?: { text: string; points: number };
        points?: number;
      }
    >
  >({});
  const [fmQIdx, setFmQIdx] = useState(0);
  const [fmTimer, setFmTimer] = useState(60);
  const [fmActive, setFmActive] = useState(false);
  const [fmCalculating, setFmCalculating] = useState(false);
  const fromSyncRef = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.curQ !== undefined) setCurQ(data.curQ);
        if (Array.isArray(data.revealed)) setRevealed(data.revealed);
        if (data.scores) setScores(data.scores);
        if (typeof data.strikes === "number") setStrikes(data.strikes);
        if (typeof data.roundScore === "number") setRoundScore(data.roundScore);
        if (data.ctrl !== undefined) setCtrl(data.ctrl);
        if (typeof data.round === "number") setRound(data.round);
        if (Array.isArray(data.usedIds)) setUsedIds(data.usedIds);
        if (data.phase) setPhase(data.phase);
        if (typeof data.curTeam === "number") setCurTeam(data.curTeam);
        if (typeof data.curPlayer === "number") setCurPlayer(data.curPlayer);
        if (data.faceoffWin !== undefined) setFaceoffWin(data.faceoffWin);
        if (data.faceoffFirstBuzzer !== undefined)
          setFaceoffFirstBuzzer(data.faceoffFirstBuzzer);
        if (typeof data.faceoffPlayerIndex === "number")
          setFaceoffPlayerIndex(data.faceoffPlayerIndex);
        if (typeof data.faceoffBothMissed === "boolean")
          setFaceoffBothMissed(data.faceoffBothMissed);
        if (
          typeof data.faceoffFirstAnswerIdx === "number" ||
          data.faceoffFirstAnswerIdx === null
        )
          setFaceoffFirstAnswerIdx(data.faceoffFirstAnswerIdx);
        if (typeof data.questionRevealed === "boolean")
          setQuestionRevealed(data.questionRevealed);
        if (data.feedback !== undefined) setFeedback(data.feedback ?? null);
        if (data.view) setView(data.view);
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY_SYNC || !e.newValue) return;
      fromSyncRef.current = true;
      try {
        const data = JSON.parse(e.newValue);
        if (data.curQ !== undefined) setCurQ(data.curQ);
        if (Array.isArray(data.revealed)) setRevealed(data.revealed);
        if (data.scores) setScores(data.scores);
        if (typeof data.strikes === "number") setStrikes(data.strikes);
        if (typeof data.roundScore === "number") setRoundScore(data.roundScore);
        if (data.ctrl !== undefined) setCtrl(data.ctrl);
        if (typeof data.round === "number") setRound(data.round);
        if (Array.isArray(data.usedIds)) setUsedIds(data.usedIds);
        if (data.phase) setPhase(data.phase);
        if (typeof data.curTeam === "number") setCurTeam(data.curTeam);
        if (typeof data.curPlayer === "number") setCurPlayer(data.curPlayer);
        if (data.faceoffWin !== undefined) setFaceoffWin(data.faceoffWin);
        if (data.faceoffFirstBuzzer !== undefined)
          setFaceoffFirstBuzzer(data.faceoffFirstBuzzer);
        if (typeof data.faceoffPlayerIndex === "number")
          setFaceoffPlayerIndex(data.faceoffPlayerIndex);
        if (typeof data.faceoffBothMissed === "boolean")
          setFaceoffBothMissed(data.faceoffBothMissed);
        if (
          typeof data.faceoffFirstAnswerIdx === "number" ||
          data.faceoffFirstAnswerIdx === null
        )
          setFaceoffFirstAnswerIdx(data.faceoffFirstAnswerIdx);
        if (typeof data.questionRevealed === "boolean")
          setQuestionRevealed(data.questionRevealed);
        if (data.feedback !== undefined) setFeedback(data.feedback ?? null);
        if (data.view) setView(data.view);
      } catch (_) {}
      setTimeout(() => {
        fromSyncRef.current = false;
      }, 0);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    if (fromSyncRef.current) return;
    const payload = {
      curQ,
      revealed,
      scores,
      strikes,
      roundScore,
      ctrl,
      round,
      usedIds,
      phase,
      curTeam,
      curPlayer,
      faceoffWin,
      faceoffFirstBuzzer,
      faceoffPlayerIndex,
      faceoffBothMissed,
      faceoffFirstAnswerIdx,
      questionRevealed,
      feedback,
      view,
    };
    localStorage.setItem(STORAGE_KEY_SYNC, JSON.stringify(payload));
  }, [
    curQ,
    revealed,
    scores,
    strikes,
    roundScore,
    ctrl,
    round,
    usedIds,
    phase,
    curTeam,
    curPlayer,
    faceoffWin,
    faceoffFirstBuzzer,
    faceoffPlayerIndex,
    faceoffBothMissed,
    faceoffFirstAnswerIdx,
    questionRevealed,
    feedback,
    view,
  ]);

  const show = useCallback(
    (msg: string, type: "ok" | "err" | "info" = "ok") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 2500);
    },
    [],
  );

  const connectToStorage = useCallback(
    async (apiKey: string, binId?: string) => {
      setStorageError(null);
      setStorageConnecting(true);
      try {
        const key = apiKey.trim();
        if (!key) throw new Error("API key required");
        if (binId?.trim()) {
          const data = await readBin(key, binId.trim());
          setQuestions(
            data.questions.length ? data.questions : defaultQuestions,
          );
          setFmQuestions(
            data.fmQuestions.length ? data.fmQuestions : defaultFastMoney,
          );
          const bid = binId.trim();
          setStorageBinId(bid);
          localStorage.setItem(STORAGE_KEY_BIN, bid);
        } else {
          const newBinId = await createBin(key, {
            questions: defaultQuestions,
            fmQuestions: defaultFastMoney,
          });
          setStorageBinId(newBinId);
          setQuestions(defaultQuestions);
          setFmQuestions(defaultFastMoney);
          localStorage.setItem(STORAGE_KEY_BIN, newBinId);
        }
        setStorageApiKey(key);
        localStorage.setItem(STORAGE_KEY_API, key);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Connection failed";
        setStorageError(msg);
        show(msg, "err");
      } finally {
        setStorageConnecting(false);
      }
    },
    [show],
  );

  useEffect(() => {
    const api = localStorage.getItem(STORAGE_KEY_API);
    const bin = localStorage.getItem(STORAGE_KEY_BIN);
    if (api && bin) {
      readBin(api, bin)
        .then((data) => {
          setQuestions(
            data.questions.length ? data.questions : defaultQuestions,
          );
          setFmQuestions(
            data.fmQuestions.length ? data.fmQuestions : defaultFastMoney,
          );
        })
        .catch(() => {});
    }
  }, []);

  const disconnectStorage = useCallback(() => {
    setStorageApiKey("");
    setStorageBinId(null);
    setStorageError(null);
    localStorage.removeItem(STORAGE_KEY_API);
    localStorage.removeItem(STORAGE_KEY_BIN);
    setQuestions(defaultQuestions);
    setFmQuestions(defaultFastMoney);
  }, []);

  const persistToStorage = useCallback(
    async (q: Question[], fm: FastMoneyQuestion[]) => {
      if (!storageApiKey || !storageBinId) return;
      try {
        await updateBin(storageApiKey, storageBinId, {
          questions: q,
          fmQuestions: fm,
        });
      } catch (e) {
        show(e instanceof Error ? e.message : "Failed to save", "err");
      }
    },
    [storageApiKey, storageBinId, show],
  );

  const beginRound = useCallback(
    (
      r: number,
      excludeIds: number[],
      questionsList: Question[],
      initialFaceoffPlayerIndex = 0,
    ) => {
      const q = pickQuestion(questionsList, r, excludeIds);
      if (!q) {
        show(`אין שאלות זמינות לסיבוב ${r}!`, "err");
        return false;
      }
      setCurQ(q);
      setUsedIds([...excludeIds, q.id]);
      setRound(r);
      setRevealed([]);
      setStrikes(0);
      setRoundScore(0);
      setCtrl(null);
      setPhase("faceoff");
      setFaceoffWin(null);
      setCurTeam(1);
      setCurPlayer(0);
      setInput("");
      setFeedback(null);
      setFaceoffFirstBuzzer(null);
      setFaceoffPlayerIndex(initialFaceoffPlayerIndex);
      setFaceoffBothMissed(false);
      setFaceoffFirstAnswerIdx(null);
      setQuestionRevealed(false);
      return true;
    },
    [show],
  );

  const startGameFixed = useCallback(() => {
    setScores({ t1: 0, t2: 0 });
    setUsedIds([]);
    const ok = beginRound(1, [], questions);
    if (ok) setView("game");
  }, [beginRound, questions]);

  const finishFastMoney = useCallback(
    async (ans: Record<string, string>) => {
      setFmPhase("reveal");
      setFmCalculating(true);
      const result = await aiMatchFastMoney(fmQuestions, ans);
      setFmPoints({ p1: result.p1, p2: result.p2 });
      setFmDetails(result.details ?? {});
      setFmCalculating(false);
    },
    [fmQuestions],
  );

  const awardPoints = useCallback(
    (team: number, pts?: number) => {
      const p = pts ?? roundScore;
      setScores((prev) => ({
        ...prev,
        [team === 1 ? "t1" : "t2"]: prev[team === 1 ? "t1" : "t2"] + p,
      }));
      setRoundScore(0);
      setRevealed(curQ ? curQ.answers.map((_, i) => i) : []);
      setPhase("roundEnd");
    },
    [roundScore, curQ],
  );

  const nextPlayer = useCallback(() => {
    setCurPlayer((p) => (p + 1) % 5);
  }, []);

  const revealQuestion = useCallback(() => setQuestionRevealed(true), []);

  const addStrike = useCallback((currentStrikes: number) => {
    setStrikes((ns) => {
      if (ns + 1 >= 3) {
        setTimeout(() => {
          setPhase("steal");
          setCurTeam((c) => (c === 1 ? 2 : 1));
          setCurPlayer(0);
        }, 1000);
      }
      return ns + 1;
    });
    if (currentStrikes + 1 < 3) {
      setCurPlayer((p) => (p + 1) % 5);
    }
  }, []);

  const hostSelectAnswer = useCallback(
    (realIdx: number | null) => {
      if (!curQ) return;

      const availableIndices = curQ.answers
        .map((_, i) => i)
        .filter((i) => !revealed.includes(i));

      if (realIdx !== null && availableIndices.includes(realIdx)) {
        const pts = curQ.answers[realIdx].points * round;
        const newRevealed = [...revealed, realIdx];
        const newRoundScore = roundScore + pts;
        setRevealed(newRevealed);
        setRoundScore(newRoundScore);
        setFeedback({
          type: "correct",
          answer: curQ.answers[realIdx],
          points: pts,
        });
        if (phase === "faceoff" && !questionRevealed) setQuestionRevealed(true);

        setTimeout(() => {
          setFeedback(null);
          if (newRevealed.length === curQ.answers.length) {
            const winner = ctrl ?? faceoffWin ?? curTeam;
            awardPoints(winner, newRoundScore);
            return;
          }
          if (phase === "faceoff") {
            if (curTeam === faceoffFirstBuzzer) {
              if (realIdx === 0) {
                setFaceoffWin(curTeam);
                setPhase("choose");
              } else {
                setFaceoffFirstAnswerIdx(realIdx);
                setCurTeam(faceoffFirstBuzzer === 1 ? 2 : 1);
              }
            } else {
              const firstIdx =
                faceoffFirstAnswerIdx !== null ? faceoffFirstAnswerIdx : 999;
              if (realIdx < firstIdx) {
                setFaceoffWin(curTeam);
                setPhase("choose");
              } else {
                setFaceoffWin(faceoffFirstBuzzer);
                setPhase("choose");
              }
            }
          } else if (phase === "play") nextPlayer();
          else if (phase === "steal")
            awardPoints(ctrl === 1 ? 2 : 1, newRoundScore);
        }, 3000);
      } else {
        setFeedback({ type: "wrong" });
        if (phase === "faceoff" && !questionRevealed) setQuestionRevealed(true);
        setTimeout(() => {
          setFeedback(null);
          if (phase === "faceoff") {
            if (curTeam !== faceoffFirstBuzzer) {
              setFaceoffBothMissed(true);
              setFaceoffWin(faceoffFirstBuzzer);
              setCtrl(faceoffFirstBuzzer);
              setCurTeam(faceoffFirstBuzzer);
              setCurPlayer((faceoffPlayerIndex + 1) % 5);
              setPhase("play");
            } else {
              setCurTeam(curTeam === 1 ? 2 : 1);
            }
          } else if (phase === "play") addStrike(strikes);
          else if (phase === "steal") awardPoints(ctrl!, roundScore);
        }, 3000);
      }
    },
    [
      curQ,
      revealed,
      round,
      roundScore,
      ctrl,
      faceoffWin,
      curTeam,
      phase,
      strikes,
      questionRevealed,
      faceoffFirstBuzzer,
      faceoffFirstAnswerIdx,
      faceoffPlayerIndex,
      awardPoints,
      nextPlayer,
      addStrike,
    ],
  );

  const handlePlayOrPass = useCallback(
    (d: "play" | "pass") => {
      const win = faceoffWin ?? 1;
      const other = win === 1 ? 2 : 1;
      if (d === "play") {
        setCtrl(win);
        setCurTeam(win);
        setCurPlayer((faceoffPlayerIndex + 1) % 5);
      } else {
        setCtrl(other);
        setCurTeam(other);
        setCurPlayer(0);
      }
      setPhase("play");
    },
    [faceoffWin, faceoffPlayerIndex],
  );

  const handleFmAnswer = useCallback(() => {
    if (!input.trim()) return;
    const key = `p${fmPlayer}_q${fmQIdx}`;
    const newAns = { ...fmAnswers, [key]: input };
    setFmAnswers(newAns);
    setInput("");
    if (fmQIdx < 4) {
      setFmQIdx(fmQIdx + 1);
    } else {
      setFmActive(false);
      if (fmPlayer === 1) {
        setTimeout(() => {
          setFmPlayer(2);
          setFmPhase("player2");
          setFmQIdx(0);
          setFmTimer(60);
          setFmActive(true);
        }, 1500);
      } else {
        setTimeout(() => finishFastMoney(newAns), 1500);
      }
    }
  }, [input, fmPlayer, fmQIdx, fmAnswers, finishFastMoney]);

  const resetGame = useCallback(() => {
    setScores({ t1: 0, t2: 0 });
    setCurQ(null);
    setRevealed([]);
    setStrikes(0);
    setRoundScore(0);
    setCtrl(null);
    setPhase("faceoff");
    setRound(1);
    setUsedIds([]);
    setView("start");
    localStorage.removeItem(STORAGE_KEY_SYNC);
  }, []);

  const resetCurrentRound = useCallback(() => {
    const idsWithoutCurrent = usedIds.filter((id) => id !== curQ?.id);
    beginRound(round, idsWithoutCurrent, questions);
  }, [usedIds, curQ?.id, round, questions, beginRound]);

  const advanceRound = useCallback(() => {
    if (round < 3) {
      const nextFaceoff = (faceoffPlayerIndex + 1) % 5;
      const ok = beginRound(round + 1, usedIds, questions, nextFaceoff);
      if (!ok) show("אין שאלות לסיבוב הבא", "err");
    } else {
      if (fmQuestions.length < 5) {
        show("צריך לפחות 5 שאלות פאסט מאני", "err");
        return;
      }
      setFmPhase("player1");
      setFmPlayer(1);
      setFmAnswers({});
      setFmPoints({ p1: 0, p2: 0 });
      setFmDetails({});
      setFmQIdx(0);
      setFmTimer(60);
      setFmActive(true);
      setInput("");
      setFmCalculating(false);
      setView("fastmoney");
    }
  }, [
    round,
    usedIds,
    questions,
    fmQuestions.length,
    faceoffPlayerIndex,
    beginRound,
    show,
  ]);

  const startFastMoney = useCallback(() => {
    if (fmQuestions.length < 5) {
      show("צריך לפחות 5 שאלות פאסט מאני", "err");
      return;
    }
    setFmPhase("player1");
    setFmPlayer(1);
    setFmAnswers({});
    setFmPoints({ p1: 0, p2: 0 });
    setFmDetails({});
    setFmQIdx(0);
    setFmTimer(60);
    setFmActive(true);
    setInput("");
    setFmCalculating(false);
    setView("fastmoney");
  }, [fmQuestions.length, show]);

  const setQuestionsWrapper = useCallback(
    (q: Question[] | ((p: Question[]) => Question[])) => {
      setQuestions(q);
    },
    [],
  );

  const setFmQuestionsWrapper = useCallback(
    (
      q:
        | FastMoneyQuestion[]
        | ((p: FastMoneyQuestion[]) => FastMoneyQuestion[]),
    ) => {
      setFmQuestions(q);
    },
    [],
  );

  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    if (fmActive && fmTimer > 0) {
      iv = setInterval(() => setFmTimer((t) => t - 1), 1000);
    } else if (fmTimer === 0 && fmActive) {
      setFmActive(false);
      if (fmPlayer === 1) {
        setTimeout(() => {
          setFmPlayer(2);
          setFmPhase("player2");
          setFmQIdx(0);
          setFmTimer(60);
          setFmActive(true);
        }, 1500);
      } else {
        finishFastMoney(fmAnswers);
      }
    }
    return () => clearInterval(iv!);
  }, [fmActive, fmTimer, fmPlayer, fmAnswers, finishFastMoney]);

  const value: GameContextValue = {
    view,
    setView,
    storageConnected,
    storageBinId,
    storageConnecting,
    storageError,
    connectToStorage,
    disconnectStorage,
    persistToStorage,
    questions,
    setQuestions: setQuestionsWrapper,
    fmQuestions,
    setFmQuestions: setFmQuestionsWrapper,
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
    feedback,
    toast,
    faceoffFirstBuzzer,
    setFaceoffFirstBuzzer,
    faceoffPlayerIndex,
    setFaceoffPlayerIndex,
    faceoffBothMissed,
    questionRevealed,
    revealQuestion,
    fmPhase,
    fmPlayer,
    fmAnswers,
    fmPoints,
    fmDetails,
    fmQIdx,
    fmTimer,
    fmActive,
    fmCalculating,
    show,
    startGame: startGameFixed,
    resetGame,
    resetCurrentRound,
    advanceRound,
    hostSelectAnswer,
    handlePlayOrPass,
    handleFmAnswer,
    startFastMoney,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
