import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Question, FastMoneyQuestion, View } from "@/types";
import { defaultQuestions, defaultFastMoney } from "@/data/questions";
import { aiMatchAnswer, aiMatchFastMoney } from "@/services/aiMatch";
import { createBin, readBin, updateBin } from "@/services/jsonbin";

const STORAGE_KEY_API = "family-feud_jsonbin_api";
const STORAGE_KEY_BIN = "family-feud_jsonbin_bin";

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
  checking: boolean;
  faceoffFirstBuzzer: number | null;
  setFaceoffFirstBuzzer: (n: number | null) => void;
  faceoffBothMissed: boolean;
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
  checkAnswer: (guess: string) => Promise<void>;
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
  const [checking, setChecking] = useState(false);
  const [faceoffFirstBuzzer, setFaceoffFirstBuzzer] = useState<number | null>(
    null,
  );
  const [faceoffBothMissed, setFaceoffBothMissed] = useState(false);
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
    (r: number, excludeIds: number[], questionsList: Question[]) => {
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
      setChecking(false);
      setFaceoffFirstBuzzer(null);
      setFaceoffBothMissed(false);
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

  const addStrike = useCallback(() => {
    setStrikes((ns) => {
      if (ns + 1 >= 3) {
        setTimeout(() => {
          setPhase("steal");
          setCurTeam((c) => (c === 1 ? 2 : 1));
          setCurPlayer(0);
        }, 1000);
      } else {
        setCurPlayer((p) => (p + 1) % 5);
      }
      return ns + 1;
    });
  }, []);

  const checkAnswer = useCallback(
    async (guess: string) => {
      if (!guess.trim() || checking || !curQ) return;
      setChecking(true);
      setInput("");

      const availableAnswers = curQ.answers.filter(
        (_, i) => !revealed.includes(i),
      );
      const availableIndices = curQ.answers
        .map((_, i) => i)
        .filter((i) => !revealed.includes(i));
      const matchIdx = await aiMatchAnswer(
        guess,
        curQ.question,
        availableAnswers,
      );

      if (matchIdx !== -1) {
        const realIdx = availableIndices[matchIdx];
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

        setTimeout(() => {
          setFeedback(null);
          setChecking(false);
          if (newRevealed.length === curQ.answers.length) {
            const winner = ctrl ?? faceoffWin ?? curTeam;
            awardPoints(winner, newRoundScore);
            return;
          }
          if (phase === "faceoff") setPhase("choose");
          else if (phase === "play") nextPlayer();
          else if (phase === "steal")
            awardPoints(ctrl === 1 ? 2 : 1, newRoundScore);
        }, 2000);
      } else {
        setFeedback({ type: "wrong" });
        setTimeout(() => {
          setFeedback(null);
          setChecking(false);
          if (phase === "faceoff") {
            if (curTeam !== faceoffFirstBuzzer) {
              setFaceoffBothMissed(true);
              setFaceoffWin(faceoffFirstBuzzer);
              setPhase("choose");
            } else {
              setCurTeam(curTeam === 1 ? 2 : 1);
            }
          } else if (phase === "play") addStrike();
          else if (phase === "steal") awardPoints(ctrl!, roundScore);
        }, 1500);
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
      faceoffFirstBuzzer,
      checking,
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
        setCurPlayer(1);
      } else {
        setCtrl(other);
        setCurTeam(other);
        setCurPlayer(0);
      }
      setPhase("play");
    },
    [faceoffWin],
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
    setChecking(false);
  }, []);

  const resetCurrentRound = useCallback(() => {
    const idsWithoutCurrent = usedIds.filter((id) => id !== curQ?.id);
    beginRound(round, idsWithoutCurrent, questions);
  }, [usedIds, curQ?.id, round, questions, beginRound]);

  const advanceRound = useCallback(() => {
    if (round < 3) {
      const ok = beginRound(round + 1, usedIds, questions);
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
  }, [round, usedIds, questions, fmQuestions.length, beginRound, show]);

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
    checking,
    faceoffFirstBuzzer,
    setFaceoffFirstBuzzer,
    faceoffBothMissed,
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
    checkAnswer,
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
