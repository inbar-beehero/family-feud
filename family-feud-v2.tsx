import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Zap,
  Clock,
  Trophy,
  RotateCcw,
  SkipForward,
  Loader,
} from "lucide-react";

const defaultQuestions = [
  {
    id: 1,
    round: 1,
    question: "משהו ספציפי במיקי מאוס שאנשים אחרים עשויים לצחוק עליו.",
    answers: [
      { text: "אוזניים עם קיות", points: 36 },
      { text: "בגדים/כפפות", points: 29 },
      { text: "קול/צחוק", points: 19 },
      { text: "רגליים עם קיות", points: 3 },
      { text: "חבר הכי טוב עם ברווז", points: 3 },
      { text: "אף גדול", points: 3 },
    ],
  },
  {
    id: 2,
    round: 1,
    question:
      "אם היית חנות שמוכרת רק בן/בת זוג, רוב האנשים היו מנסים לקנות אחד עם מה?",
    answers: [
      { text: "עבודה", points: 24 },
      { text: "אישיות/הומור", points: 15 },
      { text: "אחריות/תעודת אחריות", points: 14 },
      { text: "לב/אופי", points: 12 },
      { text: "חשבון בנק", points: 10 },
      { text: "גוף יפה", points: 9 },
      { text: "שיער על הראש", points: 3 },
      { text: "מוח", points: 2 },
    ],
  },
  {
    id: 3,
    round: 1,
    question: "שם משהו ספורטאי עשוי לשבור.",
    answers: [
      { text: "עצם/חלק גוף", points: 80 },
      { text: "שיא", points: 16 },
      { text: "מחבט/ציוד", points: 2 },
      { text: "חוקים/החוק", points: 2 },
    ],
  },
  {
    id: 4,
    round: 1,
    question: "מקום שבו אנשים נוטים לאבד את המפתחות שלהם.",
    answers: [
      { text: "בית", points: 55 },
      { text: "קניון", points: 17 },
      { text: "תיק יד", points: 10 },
      { text: "מכונית", points: 7 },
      { text: "בר", points: 6 },
      { text: "חוף ים", points: 5 },
    ],
  },
  {
    id: 5,
    round: 1,
    question: "מקום שמתגבר מתלונן שצריך ללכת אליו.",
    answers: [
      { text: "בית ספר", points: 56 },
      { text: "בית כנסת", points: 26 },
      { text: "אירוע משפחתי", points: 9 },
      { text: "רופא שיניים/רופא", points: 4 },
      { text: "סופרמרקט", points: 2 },
      { text: "עבודה", points: 2 },
    ],
  },
  {
    id: 6,
    round: 1,
    question: "משהו שרואים בחוץ שיגרום לכם לרצות להישאר בפנים.",
    answers: [
      { text: "מזג אוויר גרוע/טורנדו", points: 71 },
      { text: "דוב/חיה", points: 13 },
      { text: "זומבים", points: 3 },
      { text: "אפוקליפסה", points: 2 },
      { text: "אש/עשן", points: 2 },
    ],
  },
  {
    id: 7,
    round: 2,
    question: "שם קוסם מפורסם.",
    answers: [
      { text: "הארי פוטר", points: 37 },
      { text: "מרלין", points: 26 },
      { text: "גנדלף", points: 11 },
      { text: "דר סטריינג׳", points: 9 },
      { text: "הקוסם מארץ עוץ", points: 8 },
      { text: "וולדמורט", points: 3 },
    ],
  },
  {
    id: 8,
    round: 2,
    question: "כשנכנסים לשירותים, איזה צבע אתם ממש מקווים לא לראות באסלה?",
    answers: [
      { text: "חום", points: 61 },
      { text: "צהוב", points: 11 },
      { text: "אדום", points: 10 },
      { text: "ירוק", points: 10 },
      { text: "שחור", points: 2 },
      { text: "ורוד", points: 1 },
    ],
  },
  {
    id: 9,
    round: 2,
    question: "משהו שקברן היה שונא לגלות לגבי הגופה שהוא עומד לקבור.",
    answers: [
      { text: "שהיא חיה", points: 60 },
      { text: "שזה האדם הלא נכון", points: 18 },
      { text: "שהיא מסריחה", points: 6 },
      { text: "שהיא נעלמה", points: 5 },
      { text: "שיש בה משהו מדבק", points: 3 },
    ],
  },
  {
    id: 10,
    round: 2,
    question: "משהו שנראה שהרבה ילדים כמעט מכורים אליו.",
    answers: [
      { text: "מחשב/משחקים", points: 41 },
      { text: "ממתקים/ג׳אנק פוד", points: 29 },
      { text: "טלוויזיה", points: 20 },
      { text: "מוזיקה", points: 5 },
    ],
  },
  {
    id: 11,
    round: 2,
    question: "משהו שיכול להפוך אמבטיה רגילה לרומנטית.",
    answers: [
      { text: "נרות", points: 39 },
      { text: "קצף", points: 34 },
      { text: "עלי ורדים", points: 9 },
      { text: "עוד מישהו", points: 7 },
      { text: "מוזיקה", points: 3 },
      { text: "אלכוהול", points: 3 },
      { text: "שמן אמבט", points: 3 },
    ],
  },
  {
    id: 12,
    round: 2,
    question: "משהו שהייתם עושים מול מראה.",
    answers: [
      { text: "לצחצח שיניים", points: 26 },
      { text: "לסרק שיער", points: 23 },
      { text: "לפוצץ פצעון", points: 19 },
      { text: "לבדוק את הבגדים", points: 17 },
      { text: "לתרגל תנועות ריקוד", points: 15 },
    ],
  },
  {
    id: 13,
    round: 3,
    question: "מקום שבו לעולם לא תרצו לשמוע מישהו אומר 'אופס!'.",
    answers: [
      { text: "חדר ניתוח", points: 35 },
      { text: "במטוס", points: 25 },
      { text: "במתקן בריאותי", points: 20 },
      { text: "בגן ילדים", points: 10 },
      { text: "במהלך ראיון עבודה", points: 5 },
    ],
  },
  {
    id: 14,
    round: 3,
    question: "מי עשוי להגיד 'להרים ידיים'",
    answers: [
      { text: "שוטר", points: 63 },
      { text: "ראפר/זמר/תקליטן", points: 23 },
      { text: "שודד", points: 9 },
      { text: "מדריך כושר", points: 3 },
    ],
  },
  {
    id: 15,
    round: 3,
    question: "שם משהו שיש לו שיניים.",
    answers: [
      { text: "חיות", points: 66 },
      { text: "אנשים", points: 19 },
      { text: "מסרק", points: 8 },
      { text: "רוכסן", points: 4 },
      { text: "מסור", points: 2 },
    ],
  },
  {
    id: 16,
    round: 3,
    question: "דרכים להתעשר במהירות.",
    answers: [
      { text: "להשקיע", points: 28 },
      { text: "לחסוך כסף", points: 24 },
      { text: "לקנות ביטקוין", points: 20 },
      { text: "להמר", points: 15 },
      { text: "ללכת עבודה", points: 13 },
    ],
  },
  {
    id: 17,
    round: 3,
    question: "לאחר שרצחת מישהו, משהו ספציפי שאתה חייב להיפטר ממנו במהירות.",
    answers: [
      { text: "הנשק", points: 58 },
      { text: "הגופה", points: 27 },
      { text: "הדם", points: 6 },
      { text: "טביעות אצבע", points: 5 },
      { text: "הבגדים/הנעליים שלי", points: 4 },
    ],
  },
  {
    id: 18,
    round: 3,
    question: "משהו שהייתם שונאים שיקרה בזמן שאתם מתרחצים.",
    answers: [
      { text: "הטלפון מצלצל", points: 35 },
      { text: "אין מים חמים", points: 24 },
      { text: "פעמון הדלת מצלצל", points: 8 },
      { text: "התחשמלות", points: 6 },
      { text: "הפסקת חשמל", points: 4 },
      { text: "החלקה/נפילה", points: 4 },
      { text: "מישהו נכנס", points: 4 },
    ],
  },
];

const defaultFastMoney = [
  {
    id: 1001,
    question: "משהו שאנשים זוכים בו בתוכניות משחק.",
    answers: [
      { text: "כסף", points: 61 },
      { text: "מכונית חדשה", points: 24 },
      { text: "טיולים/חופשות", points: 9 },
      { text: "מקרר", points: 2 },
    ],
  },
  {
    id: 1002,
    question: "סיבה שהפנים של אדם עלולות להפוך לאדומות.",
    answers: [
      { text: "מבוכה", points: 75 },
      { text: "כעס", points: 12 },
      { text: "כוויית שמש", points: 6 },
      { text: "עקיצות/נשיכות של חרקים", points: 2 },
    ],
  },
  {
    id: 1003,
    question: "סיבה שבגללה אנשים רוכבים על האופניים שלהם לעבודה.",
    answers: [
      { text: "אין להם מכונית", points: 56 },
      { text: "המחיר של הדלק", points: 14 },
      { text: "רוצים להגן על הסביבה", points: 10 },
      { text: "צריכים להתעמל", points: 10 },
    ],
  },
  {
    id: 1004,
    question: "משחק קלפים מפורסם.",
    answers: [
      { text: "פוקר", points: 47 },
      { text: "סוליטר", points: 23 },
      { text: "בריג׳", points: 18 },
      { text: "בלק׳ק", points: 7 },
    ],
  },
  {
    id: 1005,
    question: "פרי שאפשר למצוא בשייק.",
    answers: [
      { text: "תות שדה", points: 35 },
      { text: "בננה", points: 30 },
      { text: "אוכמניות", points: 15 },
      { text: "מנגו", points: 10 },
      { text: "אננס", points: 10 },
    ],
  },
];

// AI-powered answer matching
async function aiMatchAnswer(guess, question, availableAnswers) {
  const answersStr = availableAnswers
    .map((a, i) => `${i}: "${a.text}"`)
    .join("\n");
  const prompt = `You are judging answers in a Hebrew Family Feud (פיוד משפחתי) game.

Question: "${question}"

Available answers on the board:
${answersStr}

Player's guess: "${guess}"

Does the player's guess match any of the available answers? Consider:
- Synonyms (e.g. "רכב" = "מכונית", "כעסני" = "כועס")
- Inflections and conjugations (e.g. "רצים" = "לרוץ", "גדולה" = "גדול")
- Slang and informal expressions (e.g. "פלאפון" = "טלפון", "תותח" = "מגניב")
- Partial matches where the core meaning is the same (e.g. "אוזניים ענקיות" matches "אוזניים עם קיות")
- Transliterations and loanwords (e.g. "פון" = "טלפון")
- The answer should genuinely refer to the same concept, not just share a word

Respond with ONLY a JSON object, no markdown:
{"match": true/false, "index": <number or null>}`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await resp.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (
      parsed.match &&
      typeof parsed.index === "number" &&
      parsed.index >= 0 &&
      parsed.index < availableAnswers.length
    ) {
      return parsed.index;
    }
    return -1;
  } catch (e) {
    console.error("AI match error:", e);
    // Fallback to simple includes match
    const g = guess.toLowerCase().trim();
    return availableAnswers.findIndex((a) => a.text.toLowerCase().includes(g));
  }
}

// AI-powered fast money matching (batch)
async function aiMatchFastMoney(fmQuestions, fmAnswers) {
  const items = [];
  for (let i = 0; i < 5; i++) {
    const q = fmQuestions[i];
    for (const p of [1, 2]) {
      const ans = fmAnswers[`p${p}_q${i}`];
      if (ans)
        items.push({
          qi: i,
          player: p,
          guess: ans,
          question: q.question,
          boardAnswers: q.answers,
        });
    }
  }
  if (!items.length) return { p1: 0, p2: 0 };

  const prompt = `You are judging answers in a Hebrew Family Feud fast money round.

For each item below, determine if the player's guess matches any board answer. Consider synonyms, inflections, slang, partial matches where the core meaning is the same.

${items
  .map(
    (it, idx) => `Item ${idx}:
  Question: "${it.question}"
  Board answers: ${it.boardAnswers.map((a, j) => `${j}:"${a.text}"(${a.points}pts)`).join(", ")}
  Player guess: "${it.guess}"`,
  )
  .join("\n\n")}

Respond with ONLY a JSON array, no markdown. Each element: {"item": <index>, "match": true/false, "answerIndex": <number or null>}`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await resp.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const results = JSON.parse(clean);

    let p1 = 0,
      p2 = 0;
    const matchDetails = {};
    for (const r of results) {
      const it = items[r.item];
      if (r.match && typeof r.answerIndex === "number") {
        const pts = it.boardAnswers[r.answerIndex]?.points || 0;
        if (it.player === 1) p1 += pts;
        else p2 += pts;
        matchDetails[`p${it.player}_q${it.qi}`] = {
          matched: true,
          answer: it.boardAnswers[r.answerIndex],
          points: pts,
        };
      } else {
        matchDetails[`p${it.player}_q${it.qi}`] = { matched: false };
      }
    }
    return { p1, p2, details: matchDetails };
  } catch (e) {
    console.error("AI FM match error:", e);
    // Fallback
    let p1 = 0,
      p2 = 0;
    const matchDetails = {};
    for (let i = 0; i < 5; i++) {
      const q = fmQuestions[i];
      for (const p of [1, 2]) {
        const ans = (fmAnswers[`p${p}_q${i}`] || "").toLowerCase().trim();
        if (ans) {
          const m = q.answers.find((a) => a.text.toLowerCase().includes(ans));
          if (m) {
            if (p === 1) p1 += m.points;
            else p2 += m.points;
            matchDetails[`p${p}_q${i}`] = {
              matched: true,
              answer: m,
              points: m.points,
            };
          } else {
            matchDetails[`p${p}_q${i}`] = { matched: false };
          }
        }
      }
    }
    return { p1, p2, details: matchDetails };
  }
}

const Toast = ({ msg, type }) => (
  <div
    className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-bold text-lg animate-bounce ${type === "ok" ? "bg-green-600" : type === "err" ? "bg-red-600" : "bg-blue-600"}`}
  >
    {msg}
  </div>
);

export default function FamilyFeud() {
  const [view, setView] = useState("start");
  const [questions, setQuestions] = useState(defaultQuestions);
  const [fmQuestions, setFmQuestions] = useState(defaultFastMoney);

  const [curQ, setCurQ] = useState(null);
  const [revealed, setRevealed] = useState([]);
  const [scores, setScores] = useState({ t1: 0, t2: 0 });
  const [strikes, setStrikes] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [ctrl, setCtrl] = useState(null);
  const [round, setRound] = useState(1);
  const [usedIds, setUsedIds] = useState([]);
  const [phase, setPhase] = useState("faceoff");
  const [curTeam, setCurTeam] = useState(1);
  const [curPlayer, setCurPlayer] = useState(0);
  const [input, setInput] = useState("");
  const [faceoffWin, setFaceoffWin] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [toast, setToast] = useState(null);
  const [curQId, setCurQId] = useState(null);
  const [checking, setChecking] = useState(false);

  const [faceoffFirstBuzzer, setFaceoffFirstBuzzer] = useState(null);
  const [faceoffBothMissed, setFaceoffBothMissed] = useState(false);

  // Fast Money
  const [fmPhase, setFmPhase] = useState("player1");
  const [fmPlayer, setFmPlayer] = useState(1);
  const [fmAnswers, setFmAnswers] = useState({});
  const [fmPoints, setFmPoints] = useState({ p1: 0, p2: 0 });
  const [fmDetails, setFmDetails] = useState({});
  const [fmQIdx, setFmQIdx] = useState(0);
  const [fmTimer, setFmTimer] = useState(60);
  const [fmActive, setFmActive] = useState(false);
  const [fmCalculating, setFmCalculating] = useState(false);

  // Admin
  const [editQ, setEditQ] = useState("");
  const [editAs, setEditAs] = useState([{ text: "", points: "" }]);
  const [editRound, setEditRound] = useState(1);
  const [editMode, setEditMode] = useState("regular");
  const [editFmQ, setEditFmQ] = useState("");
  const [editFmAs, setEditFmAs] = useState([{ text: "", points: "" }]);

  const show = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    let iv;
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
        setTimeout(() => {
          finishFastMoney(fmAnswers);
        }, 1500);
      }
    }
    return () => clearInterval(iv);
  }, [fmActive, fmTimer]);

  const finishFastMoney = async (ans) => {
    setFmPhase("reveal");
    setFmCalculating(true);
    const result = await aiMatchFastMoney(fmQuestions, ans);
    setFmPoints({ p1: result.p1, p2: result.p2 });
    setFmDetails(result.details || {});
    setFmCalculating(false);
  };

  const pickQuestion = (r, excludeIds) => {
    const avail = questions.filter(
      (q) => q.round === r && !excludeIds.includes(q.id),
    );
    if (!avail.length) return null;
    return avail[Math.floor(Math.random() * avail.length)];
  };

  const beginRound = (r, existingUsedIds) => {
    const ids = existingUsedIds || usedIds;
    const q = pickQuestion(r, ids);
    if (!q) {
      show(`אין שאלות זמינות לסיבוב ${r}!`, "err");
      return false;
    }
    setCurQ(q);
    setCurQId(q.id);
    setUsedIds([...ids, q.id]);
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
  };

  const startGame = () => {
    setScores({ t1: 0, t2: 0 });
    setUsedIds([]);
    const ok = beginRound(1, []);
    if (ok) setView("game");
  };

  const resetCurrentRound = () => {
    const idsWithoutCurrent = usedIds.filter((id) => id !== curQId);
    beginRound(round, idsWithoutCurrent);
  };

  const advanceRound = () => {
    if (round < 3) {
      const ok = beginRound(round + 1);
      if (!ok) show("אין שאלות לסיבוב הבא", "err");
    } else {
      startFastMoney();
    }
  };

  const startFastMoney = () => {
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
  };

  const checkAnswer = async (guess) => {
    if (!guess.trim() || checking) return;
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
      setRevealed(newRevealed);
      const newRoundScore = roundScore + pts;
      setRoundScore(newRoundScore);
      setFeedback({
        type: "correct",
        answer: curQ.answers[realIdx],
        points: pts,
      });
      const allRevealed = newRevealed.length === curQ.answers.length;

      setTimeout(() => {
        setFeedback(null);
        setChecking(false);
        if (allRevealed) {
          const winner = ctrl || faceoffWin || curTeam;
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
        else if (phase === "steal") awardPoints(ctrl, roundScore);
      }, 1500);
    }
  };

  const awardPoints = (team, pts) => {
    const p = pts !== undefined ? pts : roundScore;
    setScores((prev) => ({
      ...prev,
      [team === 1 ? "t1" : "t2"]: prev[team === 1 ? "t1" : "t2"] + p,
    }));
    setRoundScore(0);
    setRevealed(curQ.answers.map((_, i) => i));
    setPhase("roundEnd");
  };

  const handlePlayOrPass = (d) => {
    if (d === "play") {
      setCtrl(faceoffWin);
      setCurTeam(faceoffWin);
      setCurPlayer(1);
    } else {
      const o = faceoffWin === 1 ? 2 : 1;
      setCtrl(o);
      setCurTeam(o);
      setCurPlayer(0);
    }
    setPhase("play");
  };

  const nextPlayer = () => setCurPlayer((p) => (p + 1) % 5);

  const addStrike = () => {
    const ns = strikes + 1;
    setStrikes(ns);
    if (ns >= 3)
      setTimeout(() => {
        setPhase("steal");
        setCurTeam(ctrl === 1 ? 2 : 1);
        setCurPlayer(0);
      }, 1000);
    else nextPlayer();
  };

  const handleFmAnswer = () => {
    if (!input.trim()) return;
    const key = `p${fmPlayer}_q${fmQIdx}`;
    const newAns = { ...fmAnswers, [key]: input };
    setFmAnswers(newAns);
    setInput("");
    if (fmQIdx < 4) setFmQIdx(fmQIdx + 1);
    else {
      setFmActive(false);
      if (fmPlayer === 1)
        setTimeout(() => {
          setFmPlayer(2);
          setFmPhase("player2");
          setFmQIdx(0);
          setFmTimer(60);
          setFmActive(true);
        }, 1500);
      else
        setTimeout(() => {
          finishFastMoney(newAns);
        }, 1500);
    }
  };

  const resetGame = () => {
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
  };

  // Admin
  const saveQuestion = () => {
    if (editMode === "regular") {
      if (!editQ.trim() || !editAs.some((a) => a.text.trim())) {
        show("נא להזין שאלה ולפחות תשובה אחת", "err");
        return;
      }
      const valid = editAs
        .filter((a) => a.text.trim())
        .map((a) => ({ text: a.text, points: parseInt(a.points) || 0 }))
        .sort((a, b) => b.points - a.points);
      setQuestions((prev) => [
        ...prev,
        { id: Date.now(), round: editRound, question: editQ, answers: valid },
      ]);
      setEditQ("");
      setEditAs([{ text: "", points: "" }]);
      show("השאלה נשמרה!");
    } else {
      if (!editFmQ.trim() || !editFmAs.some((a) => a.text.trim())) {
        show("נא להזין שאלה ולפחות תשובה אחת", "err");
        return;
      }
      const valid = editFmAs
        .filter((a) => a.text.trim())
        .map((a) => ({ text: a.text, points: parseInt(a.points) || 0 }))
        .sort((a, b) => b.points - a.points);
      setFmQuestions((prev) => [
        ...prev,
        { id: Date.now() + 1000, question: editFmQ, answers: valid },
      ]);
      setEditFmQ("");
      setEditFmAs([{ text: "", points: "" }]);
      show("שאלת פאסט מאני נשמרה!");
    }
  };

  const delQ = (id, isFm = false) => {
    if (isFm) setFmQuestions((prev) => prev.filter((q) => q.id !== id));
    else setQuestions((prev) => prev.filter((q) => q.id !== id));
    show("השאלה נמחקה");
  };

  const curAs = editMode === "regular" ? editAs : editFmAs;
  const setCurAs = editMode === "regular" ? setEditAs : setEditFmAs;

  // ===================== VIEWS =====================

  if (view === "start") {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 p-8 flex items-center justify-center"
        dir="rtl"
      >
        {toast && <Toast {...toast} />}
        <div className="text-center">
          <h1
            className="text-7xl font-bold text-yellow-300 mb-4"
            style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
          >
            FAMILY FEUD
          </h1>
          <p className="text-2xl text-white mb-3">!...הסקר אומר</p>
          <p className="text-white/70 mb-10">3 סיבובים → פאסט מאני</p>
          <button
            onClick={startGame}
            className="bg-yellow-400 text-blue-900 px-14 py-6 rounded-full text-3xl font-bold hover:bg-yellow-300 transition shadow-2xl"
          >
            התחל משחק
          </button>
          <div className="mt-8">
            <button
              onClick={() => setView("admin")}
              className="bg-white/20 backdrop-blur text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/30 transition"
            >
              פאנל ניהול
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "admin") {
    return (
      <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
        {toast && <Toast {...toast} />}
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">פאנל ניהול</h1>
            <button
              onClick={() => setView("start")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              חזרה
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setEditMode("regular")}
                className={`flex-1 py-2 rounded-lg font-bold transition ${editMode === "regular" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                שאלות רגילות
              </button>
              <button
                onClick={() => setEditMode("fastmoney")}
                className={`flex-1 py-2 rounded-lg font-bold transition ${editMode === "fastmoney" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                פאסט מאני
              </button>
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              הוספת שאלה {editMode === "fastmoney" ? "לפאסט מאני" : "חדשה"}
            </h2>
            {editMode === "regular" && (
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  סיבוב
                </label>
                <select
                  value={editRound}
                  onChange={(e) => setEditRound(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                >
                  <option value={1}>סיבוב 1 (×1)</option>
                  <option value={2}>סיבוב 2 (×2)</option>
                  <option value={3}>סיבוב 3 (×3)</option>
                </select>
              </div>
            )}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                שאלה
              </label>
              <input
                type="text"
                value={editMode === "regular" ? editQ : editFmQ}
                onChange={(e) =>
                  editMode === "regular"
                    ? setEditQ(e.target.value)
                    : setEditFmQ(e.target.value)
                }
                placeholder="תן שם למשהו..."
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-right"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                תשובות
              </label>
              {curAs.map((a, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={a.text}
                    onChange={(e) => {
                      const u = [...curAs];
                      u[i] = { ...u[i], text: e.target.value };
                      setCurAs(u);
                    }}
                    placeholder="תשובה"
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-right"
                  />
                  <input
                    type="number"
                    value={a.points}
                    onChange={(e) => {
                      const u = [...curAs];
                      u[i] = { ...u[i], points: e.target.value };
                      setCurAs(u);
                    }}
                    placeholder="נק׳"
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg"
                  />
                  {curAs.length > 1 && (
                    <button
                      onClick={() => setCurAs(curAs.filter((_, j) => j !== i))}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setCurAs([...curAs, { text: "", points: "" }])}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
              >
                + הוסף תשובה
              </button>
            </div>
            <button
              onClick={saveQuestion}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition"
            >
              שמור שאלה
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              {editMode === "regular" ? "שאלות קיימות" : "שאלות פאסט מאני"}
            </h2>
            {editMode === "regular"
              ? [1, 2, 3].map((r) => {
                  const rqs = questions.filter((q) => q.round === r);
                  if (!rqs.length) return null;
                  return (
                    <div key={r} className="mb-4">
                      <h3 className="text-lg font-bold text-gray-700 mb-2">
                        סיבוב {r} (×{r})
                      </h3>
                      {rqs.map((q) => (
                        <div
                          key={q.id}
                          className="border border-gray-200 rounded-lg p-3 mb-2"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <button
                              onClick={() => delQ(q.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                            <h4 className="font-bold text-gray-800 text-right flex-1 mr-2">
                              {q.question}
                            </h4>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            {q.answers.map((a, i) => (
                              <span key={i}>
                                {a.text} ({a.points})
                                {i < q.answers.length - 1 ? " | " : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              : fmQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="border border-gray-200 rounded-lg p-3 mb-2"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <button
                        onClick={() => delQ(q.id, true)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                      <h4 className="font-bold text-gray-800 text-right flex-1 mr-2">
                        {q.question}
                      </h4>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {q.answers.map((a, i) => (
                        <span key={i}>
                          {a.text} ({a.points})
                          {i < q.answers.length - 1 ? " | " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "fastmoney") {
    if (fmPhase === "reveal") {
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
                <p className="text-xl text-gray-700 font-bold">
                  בודק תשובות...
                </p>
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
                      <h3 className="font-bold text-right mb-2">
                        {q.question}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-xs text-gray-500">שחקן 1</div>
                          <div className="font-bold">{a1 || "—"}</div>
                          {m1 && (
                            <div className="text-xs text-gray-400">
                              ← {d1.answer.text}
                            </div>
                          )}
                          <div
                            className={`font-bold ${m1 ? "text-green-600" : "text-red-500"}`}
                          >
                            {m1 ? `${d1.points} נק׳` : "X"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">שחקן 2</div>
                          <div className="font-bold">{a2 || "—"}</div>
                          {m2 && (
                            <div className="text-xs text-gray-400">
                              ← {d2.answer.text}
                            </div>
                          )}
                          <div
                            className={`font-bold ${m2 ? "text-green-600" : "text-red-500"}`}
                          >
                            {m2 ? `${d2.points} נק׳` : "X"}
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

  // ===================== GAME VIEW =====================
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
                  ? `שתי הקבוצות לא מצאו תשובה! קבוצה ${faceoffFirstBuzzer} לחצה ראשונה — לשחק או להעביר?`
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
