import React, { useState, useEffect } from "react";
import { X, Zap, Clock } from "lucide-react";

const FamilyFeud = () => {
  const [view, setView] = useState("start");
  const [questions, setQuestions] = useState([]);
  const [fastMoneyQuestions, setFastMoneyQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [teamScores, setTeamScores] = useState({ team1: 0, team2: 0 });
  const [strikes, setStrikes] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [controllingTeam, setControllingTeam] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);

  // Game flow states
  const [gamePhase, setGamePhase] = useState("faceoff");
  const [currentPlayerTeam, setCurrentPlayerTeam] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState("");
  const [faceoffWinner, setFaceoffWinner] = useState(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(null);
  const [playersPerTeam] = useState(5);

  // Fast Money states
  const [fastMoneyPhase, setFastMoneyPhase] = useState("select"); // select, player1, player2, reveal
  const [fastMoneyPlayer, setFastMoneyPlayer] = useState(1);
  const [fastMoneyAnswers, setFastMoneyAnswers] = useState({});
  const [fastMoneyPoints, setFastMoneyPoints] = useState({
    player1: 0,
    player2: 0,
  });
  const [fastMoneyQuestionIndex, setFastMoneyQuestionIndex] = useState(0);
  const [fastMoneyTimer, setFastMoneyTimer] = useState(60);
  const [fastMoneyTimerActive, setFastMoneyTimerActive] = useState(false);

  // Admin state
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswers, setEditAnswers] = useState([{ text: "", points: "" }]);
  const [editRound, setEditRound] = useState(1);
  const [editMode, setEditMode] = useState("regular"); // regular or fastmoney
  const [editFastMoneyQuestion, setEditFastMoneyQuestion] = useState("");
  const [editFastMoneyAnswers, setEditFastMoneyAnswers] = useState([
    { text: "", points: "" },
  ]);

  useEffect(() => {
    const savedRegular = localStorage.getItem("familyFeudQuestions");
    const savedFastMoney = localStorage.getItem("familyFeudFastMoney");

    if (savedRegular) {
      setQuestions(JSON.parse(savedRegular));
    } else {
      loadDefaultQuestions();
    }

    if (savedFastMoney) {
      setFastMoneyQuestions(JSON.parse(savedFastMoney));
    } else {
      loadDefaultFastMoney();
    }
  }, []);

  // Timer effect for Fast Money
  useEffect(() => {
    let interval;
    if (fastMoneyTimerActive && fastMoneyTimer > 0) {
      interval = setInterval(() => {
        setFastMoneyTimer((t) => t - 1);
      }, 1000);
    } else if (fastMoneyTimer === 0) {
      setFastMoneyTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [fastMoneyTimerActive, fastMoneyTimer]);

  const loadDefaultQuestions = () => {
    const defaultQuestions = [
      // Round 1 questions from all JSON files
      {
        id: 1,
        round: 1,
        question: "משהו ספציפי במיקי מאוס שעכברים אחרים עשויים לצחוק עליו.",
        answers: [
          { text: "אוזניים ענקיות", points: 36 },
          { text: "בגדים/כפפות", points: 29 },
          { text: "קול/צחוק", points: 19 },
          { text: "רגליים ענקיות", points: 3 },
          { text: "חבר הכי טוב עם ברווז", points: 3 },
          { text: "אף גדול", points: 3 },
        ],
      },
      {
        id: 2,
        round: 1,
        question:
          "אם הייתה חנות שמוכרת רק בן/בת זוג, רוב האנשים היו מנסים לקנות אחד עם מה?",
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
        question: "שם משהו שספורטאי עשוי לשבור.",
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
        question: "מקום שמתבגר מתלונן שצריך ללכת אליו.",
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
      // Round 2 questions
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
          { text: "ממתקים/ג'אנק פוד", points: 29 },
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
      // Round 3 questions
      {
        id: 13,
        round: 3,
        question: "מקום שבו לעולם לא תרצו לשמוע מישהו אומר 'אופס!'.",
        answers: [
          { text: "חדר ניתוח", points: 35 },
          { text: "במטוס", points: 25 },
          { text: "במתקן גרעיני", points: 20 },
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
        question:
          "לאחר שרצחת מישהו, משהו ספציפי שאתה חייב להיפטר ממנו במהירות.",
        answers: [
          { text: "הנשק", points: 58 },
          { text: "הגופה", points: 27 },
          { text: "דם", points: 6 },
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
    setQuestions(defaultQuestions);
    localStorage.setItem(
      "familyFeudQuestions",
      JSON.stringify(defaultQuestions),
    );
  };

  const loadDefaultFastMoney = () => {
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
          { text: "ברידג׳", points: 18 },
          { text: "בלקג'ק", points: 7 },
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
    setFastMoneyQuestions(defaultFastMoney);
    localStorage.setItem(
      "familyFeudFastMoney",
      JSON.stringify(defaultFastMoney),
    );
  };

  const startRound = (round) => {
    const roundQuestions = questions.filter(
      (q) => q.round === round && !usedQuestionIds.includes(q.id),
    );

    if (roundQuestions.length === 0) {
      alert(`אין שאלות זמינות לסיבוב ${round}. אנא הוסף שאלות בפאנל הניהול.`);
      return;
    }

    const randomQuestion =
      roundQuestions[Math.floor(Math.random() * roundQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setUsedQuestionIds([...usedQuestionIds, randomQuestion.id]);
    setCurrentRound(round);
    setRevealedAnswers([]);
    setStrikes(0);
    setRoundScore(0);
    setControllingTeam(null);
    setGamePhase("faceoff");
    setFaceoffWinner(null);
    setCurrentPlayerTeam(1);
    setCurrentPlayerIndex(0);
    setAnswerInput("");
    setShowAnswerFeedback(null);
    setView("game");
  };

  const startFastMoney = () => {
    if (fastMoneyQuestions.length < 5) {
      alert("צריך לפחות 5 שאלות פאסט מאני. אנא הוסף שאלות בפאנל הניהול.");
      return;
    }
    setFastMoneyPhase("player1");
    setFastMoneyPlayer(1);
    setFastMoneyAnswers({});
    setFastMoneyPoints({ player1: 0, player2: 0 });
    setFastMoneyQuestionIndex(0);
    setFastMoneyTimer(60);
    setFastMoneyTimerActive(true);
    setAnswerInput("");
    setView("fastmoney");
  };

  const handleBuzzer = (team) => {
    setFaceoffWinner(team);
    setCurrentPlayerTeam(team);
  };

  const checkAnswer = (guess) => {
    const normalizedGuess = guess.toLowerCase().trim();
    const matchIndex = currentQuestion.answers.findIndex(
      (answer, idx) =>
        !revealedAnswers.includes(idx) &&
        answer.text.toLowerCase().includes(normalizedGuess),
    );

    if (matchIndex !== -1) {
      const points = currentQuestion.answers[matchIndex].points * currentRound;
      setRevealedAnswers([...revealedAnswers, matchIndex]);
      setRoundScore(roundScore + points);
      setShowAnswerFeedback({
        type: "correct",
        answer: currentQuestion.answers[matchIndex],
        points,
      });

      setTimeout(() => {
        setShowAnswerFeedback(null);
        if (gamePhase === "faceoff") {
          setGamePhase("choose");
        } else if (gamePhase === "play") {
          nextPlayer();
        } else if (gamePhase === "steal") {
          awardPoints(controllingTeam === 1 ? 2 : 1);
          setView("menu");
        }
      }, 2000);
    } else {
      setShowAnswerFeedback({ type: "wrong" });

      setTimeout(() => {
        setShowAnswerFeedback(null);
        if (gamePhase === "faceoff") {
          setCurrentPlayerTeam(currentPlayerTeam === 1 ? 2 : 1);
        } else if (gamePhase === "play") {
          addStrike();
        } else if (gamePhase === "steal") {
          awardPoints(controllingTeam);
          setView("menu");
        }
      }, 1500);
    }

    setAnswerInput("");
  };

  const handlePlayOrPass = (decision) => {
    if (decision === "play") {
      setControllingTeam(faceoffWinner);
      setCurrentPlayerTeam(faceoffWinner);
      setCurrentPlayerIndex(1);
      setGamePhase("play");
    } else {
      setControllingTeam(faceoffWinner === 1 ? 2 : 1);
      setCurrentPlayerTeam(faceoffWinner === 1 ? 2 : 1);
      setCurrentPlayerIndex(0);
      setGamePhase("play");
    }
  };

  const nextPlayer = () => {
    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex >= playersPerTeam) {
      setCurrentPlayerIndex(0);
    } else {
      setCurrentPlayerIndex(nextIndex);
    }
  };

  const addStrike = () => {
    const newStrikes = strikes + 1;
    setStrikes(newStrikes);

    if (newStrikes >= 3) {
      setTimeout(() => {
        setGamePhase("steal");
        setCurrentPlayerTeam(controllingTeam === 1 ? 2 : 1);
        setCurrentPlayerIndex(0);
        setStrikes(0);
      }, 1000);
    } else {
      nextPlayer();
    }
  };

  const awardPoints = (team) => {
    setTeamScores({
      ...teamScores,
      [team === 1 ? "team1" : "team2"]:
        teamScores[team === 1 ? "team1" : "team2"] + roundScore,
    });
    setRoundScore(0);
  };

  const handleFastMoneyAnswer = () => {
    if (!answerInput.trim()) return;

    const currentQ = fastMoneyQuestions[fastMoneyQuestionIndex];
    const playerKey = `p${fastMoneyPlayer}_q${fastMoneyQuestionIndex}`;

    const newAnswers = {
      ...fastMoneyAnswers,
      [playerKey]: answerInput,
    };

    setFastMoneyAnswers(newAnswers);
    setAnswerInput("");

    if (fastMoneyQuestionIndex < 4) {
      setFastMoneyQuestionIndex(fastMoneyQuestionIndex + 1);
    } else {
      // Player finished all 5 questions
      setFastMoneyTimerActive(false);
      if (fastMoneyPlayer === 1) {
        // Move to player 2
        setTimeout(() => {
          setFastMoneyPlayer(2);
          setFastMoneyPhase("player2");
          setFastMoneyQuestionIndex(0);
          setFastMoneyTimer(60);
          setFastMoneyTimerActive(true);
        }, 2000);
      } else {
        // Both players done, move to reveal
        setTimeout(() => {
          setFastMoneyPhase("reveal");
          // Calculate points using the updated answers
          calculateFastMoneyPointsWithAnswers(newAnswers);
        }, 2000);
      }
    }
  };

  const calculateFastMoneyPointsWithAnswers = (answers) => {
    let p1Points = 0;
    let p2Points = 0;

    for (let i = 0; i < 5; i++) {
      const q = fastMoneyQuestions[i];
      const p1Answer = answers[`p1_q${i}`]?.toLowerCase().trim() || "";
      const p2Answer = answers[`p2_q${i}`]?.toLowerCase().trim() || "";

      // Check player 1
      const p1Match = q.answers.find((a) =>
        a.text.toLowerCase().includes(p1Answer),
      );
      if (p1Match) p1Points += p1Match.points;

      // Check player 2
      const p2Match = q.answers.find((a) =>
        a.text.toLowerCase().includes(p2Answer),
      );
      if (p2Match) p2Points += p2Match.points;
    }

    setFastMoneyPoints({ player1: p1Points, player2: p2Points });
  };

  const calculateFastMoneyPoints = () => {
    calculateFastMoneyPointsWithAnswers(fastMoneyAnswers);
  };

  const resetGame = () => {
    setTeamScores({ team1: 0, team2: 0 });
    setCurrentQuestion(null);
    setRevealedAnswers([]);
    setStrikes(0);
    setRoundScore(0);
    setControllingTeam(null);
    setGamePhase("faceoff");
    setCurrentRound(1);
    setUsedQuestionIds([]);
    setFastMoneyPhase("select");
    setView("start");
  };

  // Admin functions
  const addAnswerField = () => {
    if (editMode === "regular") {
      setEditAnswers([...editAnswers, { text: "", points: "" }]);
    } else {
      setEditFastMoneyAnswers([
        ...editFastMoneyAnswers,
        { text: "", points: "" },
      ]);
    }
  };

  const updateAnswer = (index, field, value) => {
    if (editMode === "regular") {
      const updated = [...editAnswers];
      updated[index][field] = value;
      setEditAnswers(updated);
    } else {
      const updated = [...editFastMoneyAnswers];
      updated[index][field] = value;
      setEditFastMoneyAnswers(updated);
    }
  };

  const removeAnswer = (index) => {
    if (editMode === "regular") {
      setEditAnswers(editAnswers.filter((_, i) => i !== index));
    } else {
      setEditFastMoneyAnswers(
        editFastMoneyAnswers.filter((_, i) => i !== index),
      );
    }
  };

  const saveQuestion = () => {
    if (editMode === "regular") {
      if (
        !editQuestion.trim() ||
        editAnswers.filter((a) => a.text.trim()).length === 0
      ) {
        alert("אנא הזן שאלה ולפחות תשובה אחת");
        return;
      }

      const validAnswers = editAnswers
        .filter((a) => a.text.trim())
        .map((a) => ({ text: a.text, points: parseInt(a.points) || 0 }))
        .sort((a, b) => b.points - a.points);

      const newQuestion = {
        id: Date.now(),
        round: editRound,
        question: editQuestion,
        answers: validAnswers,
      };

      const updated = [...questions, newQuestion];
      setQuestions(updated);
      localStorage.setItem("familyFeudQuestions", JSON.stringify(updated));

      setEditQuestion("");
      setEditAnswers([{ text: "", points: "" }]);
      alert("השאלה נשמרה!");
    } else {
      if (
        !editFastMoneyQuestion.trim() ||
        editFastMoneyAnswers.filter((a) => a.text.trim()).length === 0
      ) {
        alert("אנא הזן שאלה ולפחות תשובה אחת");
        return;
      }

      const validAnswers = editFastMoneyAnswers
        .filter((a) => a.text.trim())
        .map((a) => ({ text: a.text, points: parseInt(a.points) || 0 }))
        .sort((a, b) => b.points - a.points);

      const newQuestion = {
        id: Date.now() + 1000,
        question: editFastMoneyQuestion,
        answers: validAnswers,
      };

      const updated = [...fastMoneyQuestions, newQuestion];
      setFastMoneyQuestions(updated);
      localStorage.setItem("familyFeudFastMoney", JSON.stringify(updated));

      setEditFastMoneyQuestion("");
      setEditFastMoneyAnswers([{ text: "", points: "" }]);
      alert("שאלת פאסט מאני נשמרה!");
    }
  };

  const deleteQuestion = (id, isFastMoney = false) => {
    if (confirm("למחוק את השאלה?")) {
      if (isFastMoney) {
        const updated = fastMoneyQuestions.filter((q) => q.id !== id);
        setFastMoneyQuestions(updated);
        localStorage.setItem("familyFeudFastMoney", JSON.stringify(updated));
      } else {
        const updated = questions.filter((q) => q.id !== id);
        setQuestions(updated);
        localStorage.setItem("familyFeudQuestions", JSON.stringify(updated));
      }
    }
  };

  // Start Screen
  if (view === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-8xl font-bold text-yellow-300 mb-8"
            style={{ textShadow: "6px 6px 0 rgba(0,0,0,0.5)" }}
          >
            FAMILY FEUD
          </h1>
          <p className="text-2xl text-white mb-12">Survey says...</p>
          <button
            onClick={() => setView("menu")}
            className="bg-yellow-400 text-blue-900 px-16 py-8 rounded-full text-3xl font-bold hover:bg-yellow-300 transform hover:scale-105 transition shadow-2xl"
          >
            התחל משחק
          </button>
          <div className="mt-12">
            <button
              onClick={() => setView("admin")}
              className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/30 transition"
            >
              פאנל ניהול
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Menu View
  if (view === "menu") {
    const round1Questions = questions.filter(
      (q) => q.round === 1 && !usedQuestionIds.includes(q.id),
    );
    const round2Questions = questions.filter(
      (q) => q.round === 2 && !usedQuestionIds.includes(q.id),
    );
    const round3Questions = questions.filter(
      (q) => q.round === 3 && !usedQuestionIds.includes(q.id),
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-6xl font-bold text-center text-yellow-300 mb-4"
            style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
          >
            FAMILY FEUD
          </h1>

          <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">בחר סיבוב</h2>

            <div className="space-y-4">
              <button
                onClick={() => startRound(1)}
                disabled={round1Questions.length === 0}
                className={`w-full p-6 rounded-lg text-right transition ${
                  round1Questions.length > 0
                    ? "bg-blue-100 hover:bg-blue-200 border-4 border-blue-400"
                    : "bg-gray-200 border-4 border-gray-300 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {round1Questions.length} שאלות זמינות
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-900">
                      סיבוב 1
                    </div>
                    <div className="text-sm text-gray-600">
                      נקודות רגילות (×1)
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => startRound(2)}
                disabled={round2Questions.length === 0}
                className={`w-full p-6 rounded-lg text-right transition ${
                  round2Questions.length > 0
                    ? "bg-purple-100 hover:bg-purple-200 border-4 border-purple-400"
                    : "bg-gray-200 border-4 border-gray-300 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {round2Questions.length} שאלות זמינות
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-900">
                      סיבוב 2
                    </div>
                    <div className="text-sm text-gray-600">
                      נקודות כפולות (×2)
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => startRound(3)}
                disabled={round3Questions.length === 0}
                className={`w-full p-6 rounded-lg text-right transition ${
                  round3Questions.length > 0
                    ? "bg-red-100 hover:bg-red-200 border-4 border-red-400"
                    : "bg-gray-200 border-4 border-gray-300 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {round3Questions.length} שאלות זמינות
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-900">
                      סיבוב 3
                    </div>
                    <div className="text-sm text-gray-600">
                      נקודות משולשות (×3)
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={startFastMoney}
                disabled={fastMoneyQuestions.length < 5}
                className={`w-full p-6 rounded-lg text-right transition ${
                  fastMoneyQuestions.length >= 5
                    ? "bg-yellow-100 hover:bg-yellow-200 border-4 border-yellow-400"
                    : "bg-gray-200 border-4 border-gray-300 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {fastMoneyQuestions.length} שאלות זמינות
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-900">
                      פאסט מאני
                    </div>
                    <div className="text-sm text-gray-600">5 שאלות מהירות</div>
                  </div>
                </div>
              </button>
            </div>

            {questions.length === 0 && (
              <p className="text-gray-600 text-center py-8 mt-4">
                אין שאלות זמינות. עבור לניהול להוספת שאלות!
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setView("admin")}
              className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg text-xl font-bold hover:bg-green-700 transition"
            >
              פאנל ניהול
            </button>
            <button
              onClick={resetGame}
              className="flex-1 bg-red-600 text-white py-4 px-6 rounded-lg text-xl font-bold hover:bg-red-700 transition"
            >
              איפוס משחק
            </button>
          </div>

          <div className="mt-8 bg-white/10 backdrop-blur rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">ניקוד נוכחי</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg mb-2">קבוצה 1</div>
                <div className="text-5xl font-bold text-yellow-300">
                  {teamScores.team1}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg mb-2">קבוצה 2</div>
                <div className="text-5xl font-bold text-yellow-300">
                  {teamScores.team2}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  if (view === "admin") {
    const currentAnswers =
      editMode === "regular" ? editAnswers : editFastMoneyAnswers;

    return (
      <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">פאנל ניהול</h1>
            <button
              onClick={() => setView("menu")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              חזרה למשחק
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setEditMode("regular")}
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  editMode === "regular"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                שאלות רגילות
              </button>
              <button
                onClick={() => setEditMode("fastmoney")}
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  editMode === "fastmoney"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                פאסט מאני
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              הוספת שאלה {editMode === "fastmoney" ? "לפאסט מאני" : "חדשה"}
            </h2>

            {editMode === "regular" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  סיבוב
                </label>
                <select
                  value={editRound}
                  onChange={(e) => setEditRound(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value={1}>סיבוב 1 - נקודות רגילות</option>
                  <option value={2}>סיבוב 2 - נקודות כפולות</option>
                  <option value={3}>סיבוב 3 - נקודות משולשות</option>
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                שאלה
              </label>
              <input
                type="text"
                value={
                  editMode === "regular" ? editQuestion : editFastMoneyQuestion
                }
                onChange={(e) =>
                  editMode === "regular"
                    ? setEditQuestion(e.target.value)
                    : setEditFastMoneyQuestion(e.target.value)
                }
                placeholder="תן שם למשהו..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-right"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                תשובות (מהגבוה לנמוך)
              </label>
              {currentAnswers.map((answer, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) =>
                      updateAnswer(index, "text", e.target.value)
                    }
                    placeholder="תשובה"
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-right"
                  />
                  <input
                    type="number"
                    value={answer.points}
                    onChange={(e) =>
                      updateAnswer(index, "points", e.target.value)
                    }
                    placeholder="נקודות"
                    className="w-24 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  {currentAnswers.length > 1 && (
                    <button
                      onClick={() => removeAnswer(index)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addAnswerField}
                className="mt-2 text-blue-600 hover:text-blue-800 font-semibold"
              >
                + הוסף תשובה
              </button>
            </div>

            <button
              onClick={saveQuestion}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              שמור שאלה
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {editMode === "regular"
                ? "שאלות קיימות"
                : "שאלות פאסט מאני קיימות"}
            </h2>
            {editMode === "regular" ? (
              questions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  אין שאלות עדיין
                </p>
              ) : (
                <div className="space-y-6">
                  {[1, 2, 3].map((round) => {
                    const roundQuestions = questions.filter(
                      (q) => q.round === round,
                    );
                    if (roundQuestions.length === 0) return null;

                    return (
                      <div key={round}>
                        <h3 className="text-xl font-bold text-gray-700 mb-3">
                          סיבוב {round}{" "}
                          {round === 1 ? "(×1)" : round === 2 ? "(×2)" : "(×3)"}
                        </h3>
                        <div className="space-y-4">
                          {roundQuestions.map((q) => (
                            <div
                              key={q.id}
                              className="border-2 border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <button
                                  onClick={() => deleteQuestion(q.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X size={20} />
                                </button>
                                <h4 className="font-bold text-lg text-gray-800 text-right flex-1">
                                  {q.question}
                                </h4>
                              </div>
                              <div className="space-y-1 text-right">
                                {q.answers.map((a, i) => (
                                  <div
                                    key={i}
                                    className="text-sm text-gray-600"
                                  >
                                    {i + 1}. {a.text} - {a.points} נקודות
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : fastMoneyQuestions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                אין שאלות פאסט מאני עדיין
              </p>
            ) : (
              <div className="space-y-4">
                {fastMoneyQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="border-2 border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <button
                        onClick={() => deleteQuestion(q.id, true)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={20} />
                      </button>
                      <h4 className="font-bold text-lg text-gray-800 text-right flex-1">
                        {q.question}
                      </h4>
                    </div>
                    <div className="space-y-1 text-right">
                      {q.answers.map((a, i) => (
                        <div key={i} className="text-sm text-gray-600">
                          {i + 1}. {a.text} - {a.points} נקודות
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fast Money View
  if (view === "fastmoney") {
    const currentQ = fastMoneyQuestions[fastMoneyQuestionIndex];

    if (fastMoneyPhase === "reveal") {
      const totalPoints = fastMoneyPoints.player1 + fastMoneyPoints.player2;

      return (
        <div
          className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-900 p-8"
          dir="rtl"
        >
          <div className="max-w-6xl mx-auto">
            <h1
              className="text-6xl font-bold text-center text-yellow-300 mb-8"
              style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
            >
              פאסט מאני - תוצאות
            </h1>

            <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
              <div className="space-y-6">
                {fastMoneyQuestions.slice(0, 5).map((q, qIndex) => {
                  const p1Answer = fastMoneyAnswers[`p1_q${qIndex}`] || "";
                  const p2Answer = fastMoneyAnswers[`p2_q${qIndex}`] || "";
                  const p1Match = q.answers.find((a) =>
                    a.text.toLowerCase().includes(p1Answer.toLowerCase()),
                  );
                  const p2Match = q.answers.find((a) =>
                    a.text.toLowerCase().includes(p2Answer.toLowerCase()),
                  );

                  return (
                    <div
                      key={qIndex}
                      className="border-2 border-gray-200 rounded-lg p-4"
                    >
                      <h3 className="font-bold text-lg mb-4 text-right">
                        {q.question}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">
                            שחקן 1
                          </div>
                          <div className="font-bold text-xl">{p1Answer}</div>
                          <div
                            className={`text-2xl font-bold ${p1Match ? "text-green-600" : "text-red-600"}`}
                          >
                            {p1Match ? `${p1Match.points} נקודות` : "X"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">
                            שחקן 2
                          </div>
                          <div className="font-bold text-xl">{p2Answer}</div>
                          <div
                            className={`text-2xl font-bold ${p2Match ? "text-green-600" : "text-red-600"}`}
                          >
                            {p2Match ? `${p2Match.points} נקודות` : "X"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">סה"כ נקודות</h2>
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <div className="text-lg text-gray-700 mb-2">שחקן 1</div>
                    <div className="text-5xl font-bold text-blue-600">
                      {fastMoneyPoints.player1}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg text-gray-700 mb-2">שחקן 2</div>
                    <div className="text-5xl font-bold text-purple-600">
                      {fastMoneyPoints.player2}
                    </div>
                  </div>
                </div>
                <div className="text-6xl font-bold text-green-600 mb-4">
                  {totalPoints}
                </div>
                {totalPoints >= 200 ? (
                  <div className="text-3xl font-bold text-green-600">
                    🎉 ניצחון! 🎉
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-red-600">
                    צריך 200 נקודות לניצחון
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setView("menu")}
              className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700"
            >
              חזרה לתפריט
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-700 to-yellow-900 p-8"
        dir="rtl"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-lg flex items-center gap-3">
              <Clock className="text-yellow-300" size={32} />
              <span className="text-5xl font-bold text-white">
                {fastMoneyTimer}
              </span>
            </div>
            <h1
              className="text-5xl font-bold text-yellow-300"
              style={{ textShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
            >
              פאסט מאני - שחקן {fastMoneyPlayer}
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2 text-right">
                שאלה {fastMoneyQuestionIndex + 1} מתוך 5
              </div>
              <h2 className="text-3xl font-bold text-blue-900 text-right">
                {currentQ.question}
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFastMoneyAnswer();
              }}
            >
              <div className="flex gap-4">
                <input
                  type="text"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="הקלד תשובה..."
                  className="flex-1 px-6 py-4 text-xl border-4 border-yellow-300 rounded-lg focus:border-yellow-500 focus:outline-none text-right"
                  autoFocus
                  disabled={!fastMoneyTimerActive}
                />
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-700 disabled:bg-gray-400"
                  disabled={!fastMoneyTimerActive}
                >
                  שלח
                </button>
              </div>
            </form>

            <div className="mt-8 space-y-2">
              {Array.from({ length: 5 }, (_, i) => {
                const playerKey = `p${fastMoneyPlayer}_q${i}`;
                const answer = fastMoneyAnswers[playerKey];
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-right ${answer ? "bg-green-100" : "bg-gray-100"}`}
                  >
                    <span className="font-semibold">שאלה {i + 1}:</span>{" "}
                    {answer || "..."}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game View
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 p-8"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <div
              className={`px-8 py-4 rounded-lg ${controllingTeam === 1 ? "bg-yellow-400" : "bg-white/20"} backdrop-blur`}
            >
              <div
                className={`text-sm mb-1 ${controllingTeam === 1 ? "text-blue-900" : "text-yellow-300"}`}
              >
                קבוצה 1
              </div>
              <div
                className={`text-3xl font-bold ${controllingTeam === 1 ? "text-blue-900" : "text-white"}`}
              >
                {teamScores.team1}
              </div>
            </div>
            <div
              className={`px-8 py-4 rounded-lg ${controllingTeam === 2 ? "bg-yellow-400" : "bg-white/20"} backdrop-blur`}
            >
              <div
                className={`text-sm mb-1 ${controllingTeam === 2 ? "text-blue-900" : "text-yellow-300"}`}
              >
                קבוצה 2
              </div>
              <div
                className={`text-3xl font-bold ${controllingTeam === 2 ? "text-blue-900" : "text-white"}`}
              >
                {teamScores.team2}
              </div>
            </div>
          </div>
          <button
            onClick={() => setView("menu")}
            className="bg-white text-blue-900 px-6 py-2 rounded-lg font-bold hover:bg-gray-100"
          >
            ← חזרה לתפריט
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="bg-blue-100 px-6 py-3 rounded-lg">
              <div className="text-sm text-blue-700 font-semibold">
                סיבוב {currentRound}{" "}
                {currentRound === 1
                  ? "(×1)"
                  : currentRound === 2
                    ? "(×2)"
                    : "(×3)"}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-blue-900 text-right flex-1 mr-4">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-3 mb-8">
            {currentQuestion.answers.map((answer, index) => (
              <div
                key={index}
                className={`w-full p-4 rounded-lg font-bold text-xl transition ${
                  revealedAnswers.includes(index)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>
                    {revealedAnswers.includes(index) ? answer.text : ""}
                  </span>
                  <div className="flex items-center gap-4">
                    {revealedAnswers.includes(index) && (
                      <span className="text-yellow-300 text-2xl">
                        {answer.points * currentRound}
                      </span>
                    )}
                    <span
                      className={`text-2xl ${revealedAnswers.includes(index) ? "text-white" : "text-gray-800"}`}
                    >
                      {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {gamePhase === "faceoff" && !faceoffWinner && (
            <div className="bg-yellow-100 border-4 border-yellow-400 rounded-lg p-8 mb-6">
              <h3 className="text-2xl font-bold text-center text-yellow-900 mb-6">
                פנים מול פנים! שחקן אחד מכל קבוצה
              </h3>
              <div className="flex gap-4 justify-center mb-6">
                <button
                  onClick={() => handleBuzzer(2)}
                  className="bg-blue-600 text-white px-12 py-8 rounded-lg text-2xl font-bold hover:bg-blue-700 flex items-center gap-3 transform hover:scale-105 transition"
                >
                  <Zap size={32} />
                  קבוצה 2 לוחצת
                </button>
                <button
                  onClick={() => handleBuzzer(1)}
                  className="bg-red-600 text-white px-12 py-8 rounded-lg text-2xl font-bold hover:bg-red-700 flex items-center gap-3 transform hover:scale-105 transition"
                >
                  <Zap size={32} />
                  קבוצה 1 לוחצת
                </button>
              </div>
            </div>
          )}

          {((gamePhase === "faceoff" && faceoffWinner) ||
            gamePhase === "play" ||
            gamePhase === "steal") &&
            !showAnswerFeedback && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-400 rounded-lg p-8 mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-purple-900 mb-2">
                    {gamePhase === "faceoff" &&
                      `קבוצה ${currentPlayerTeam} שחקן 1 (מנצח פנים מול פנים)`}
                    {gamePhase === "play" &&
                      `קבוצה ${currentPlayerTeam} - שחקן ${currentPlayerIndex + 1}`}
                    {gamePhase === "steal" &&
                      `קבוצה ${currentPlayerTeam} - ניסיון גניבה!`}
                  </h3>
                  <p className="text-purple-700">הזן את התשובה שלך:</p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (answerInput.trim()) checkAnswer(answerInput);
                  }}
                >
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-purple-700"
                    >
                      שלח
                    </button>
                    <input
                      type="text"
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      placeholder="הקלד תשובה כאן..."
                      className="flex-1 px-6 py-4 text-xl border-4 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-right"
                      autoFocus
                    />
                  </div>
                </form>
              </div>
            )}

          {showAnswerFeedback && (
            <div
              className={`${showAnswerFeedback.type === "correct" ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"} border-4 rounded-lg p-8 mb-6 text-center`}
            >
              {showAnswerFeedback.type === "correct" ? (
                <div>
                  <div className="text-6xl mb-4">✓</div>
                  <div className="text-3xl font-bold text-green-900 mb-2">
                    {showAnswerFeedback.answer.text}
                  </div>
                  <div className="text-5xl font-bold text-green-600">
                    {showAnswerFeedback.points} נקודות!
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">✗</div>
                  <div className="text-3xl font-bold text-red-900">
                    לא נכון!
                  </div>
                </div>
              )}
            </div>
          )}

          {gamePhase === "choose" && (
            <div className="bg-orange-100 border-4 border-orange-400 rounded-lg p-8 mb-6 text-center">
              <h3 className="text-2xl font-bold text-orange-900 mb-6">
                קבוצה {faceoffWinner} ניצחה בפנים מול פנים! לשחק או להעביר?
              </h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handlePlayOrPass("pass")}
                  className="bg-orange-600 text-white px-12 py-6 rounded-lg text-2xl font-bold hover:bg-orange-700"
                >
                  להעביר
                </button>
                <button
                  onClick={() => handlePlayOrPass("play")}
                  className="bg-green-600 text-white px-12 py-6 rounded-lg text-2xl font-bold hover:bg-green-700"
                >
                  לשחק
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-100 rounded-lg p-6 text-center">
              <div className="text-sm text-red-800 mb-2">טעויות</div>
              <div className="text-5xl font-bold text-red-600">
                {Array(strikes).fill("X").join(" ")}
              </div>
            </div>

            <div className="bg-green-100 rounded-lg p-6 text-center">
              <div className="text-sm text-green-800 mb-2">ניקוד הסיבוב</div>
              <div className="text-5xl font-bold text-green-600">
                {roundScore}
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-6 text-center">
              <div className="text-sm text-blue-800 mb-2">שלב</div>
              <div className="text-xl font-bold text-blue-600 uppercase">
                {gamePhase}
              </div>
              {controllingTeam && (
                <div className="text-sm text-blue-700 mt-2">
                  קבוצה {controllingTeam} שולטת
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyFeud;
