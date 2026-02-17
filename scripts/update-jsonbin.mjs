const BIN_ID = "698f2df1d0ea881f40b79e92";
const JSONBIN_BASE = "https://api.jsonbin.io/v3";

const newFmQuestions = [
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
  {
    id: 1006,
    question: "אירוע שבו ההורים מכריחים את הילדים שלהם ללבוש בגדים מיוחדים.",
    answers: [
      { text: "חתונה", points: 26 },
      { text: "פסח", points: 23 },
      { text: "פורים", points: 20 },
      { text: "בית כנסת", points: 15 },
      { text: "ראש השנה", points: 4 },
      { text: "יום צילום בבית הספר", points: 4 },
    ],
  },
  {
    id: 1007,
    question: "אם תחיו עד גיל 100, מה לדעתכם תעשו בליל שישי?",
    answers: [
      { text: "שינה", points: 37 },
      { text: "צפייה בטלוויזיה", points: 28 },
      { text: "אהבה", points: 5 },
      { text: "ריקוד", points: 4 },
      { text: "שתייה", points: 4 },
      { text: "אכילה", points: 3 },
      { text: "הימורים", points: 3 },
    ],
  },
  {
    id: 1008,
    question: "כלי נגינה שאנשים פורטים עליו.",
    answers: [
      { text: "גיטרה", points: 69 },
      { text: "בנג׳ו", points: 21 },
      { text: "בוזוקי", points: 4 },
      { text: "נבל", points: 2 },
    ],
  },
  {
    id: 1009,
    question: "פחד נפוץ שיש לרבים.",
    answers: [
      { text: "גובה", points: 50 },
      { text: "עכבישים", points: 25 },
      { text: "דיבור בפני קהל", points: 15 },
      { text: "טיסה", points: 10 },
    ],
  },
  {
    id: 1010,
    question: "מקצוע שכרוך בלהירטב.",
    answers: [
      { text: "צוללן/שחיין", points: 50 },
      { text: "מציל", points: 27 },
      { text: "כבאי", points: 9 },
      { text: "אינסטלטור", points: 5 },
    ],
  },
  {
    id: 1011,
    question: "משהו שמקושר לערפדים.",
    answers: [
      { text: "דמדומים", points: 33 },
      { text: "דם/מנוצת דם", points: 29 },
      { text: "שום", points: 9 },
      { text: "עטלף", points: 7 },
      { text: "מעיל", points: 7 },
      { text: "דרקולה", points: 5 },
      { text: "ניבים", points: 4 },
      { text: "הלוואין", points: 4 },
    ],
  },
  {
    id: 1012,
    question: "תכונה של בוס גרוע.",
    answers: [
      { text: "מיקרו-מנג׳ר", points: 29 },
      { text: "חסר יכולת", points: 24 },
      { text: "עצבני", points: 20 },
      { text: "לא אחראי", points: 14 },
      { text: "חסר מודעות", points: 13 },
    ],
  },
  {
    id: 1013,
    question: "משהו שאולי תלקק.",
    answers: [
      { text: "גלידה", points: 40 },
      { text: "סוכרייה על מקל", points: 25 },
      { text: "בול", points: 16 },
      { text: "קרחון", points: 11 },
      { text: "מעטפה", points: 8 },
    ],
  },
  {
    id: 1014,
    question: "דברים חמים.",
    answers: [
      { text: "מדורה/אש", points: 26 },
      { text: "קפה", points: 24 },
      { text: "תה", points: 21 },
      { text: "תנור", points: 16 },
      { text: "אח/רדיאטור", points: 13 },
    ],
  },
  {
    id: 1015,
    question: "דברים שהיית מפרסם ברשתות החברתיות.",
    answers: [
      { text: "סלפי", points: 31 },
      { text: "תמונות מחופשה", points: 24 },
      { text: "תמונות של חברים", points: 19 },
      { text: "הארוחה שלך", points: 15 },
      { text: "הקפה שלך", points: 11 },
    ],
  },
  {
    id: 1016,
    question: "משהו שעלול לצאת מהאף כשאתה צוחק.",
    answers: [
      { text: "נזלת", points: 48 },
      { text: "חלב", points: 32 },
      { text: "מים", points: 5 },
      { text: "סודה", points: 4 },
      { text: "נשימה", points: 3 },
    ],
  },
  {
    id: 1017,
    question: "משהו שאנשים רוכבים עליו וגורם להם להקיא.",
    answers: [
      { text: "רכבת הרים", points: 56 },
      { text: "סירה/אונייה", points: 13 },
      { text: "מכונית", points: 10 },
      { text: "גלגל ענק", points: 9 },
    ],
  },
  {
    id: 1018,
    question: "סיבה שאנשים עלולים לתת כשמאחרים לעבודה.",
    answers: [
      { text: "נרדמתי", points: 52 },
      { text: "פקקים", points: 25 },
      { text: "בעיות ברכב", points: 17 },
      { text: "מחלה", points: 6 },
    ],
  },
  {
    id: 1019,
    question: "מקום שמלא באנשים שלא רוצים להיות שם.",
    answers: [
      { text: "כלא/בית סוהר", points: 36 },
      { text: "גהינום", points: 10 },
      { text: "עבודה/פגישות", points: 10 },
      { text: "בית קברות", points: 8 },
      { text: "כנסייה", points: 8 },
    ],
  },
  {
    id: 1020,
    question: "משהו ספציפי שאתה מקפיד לנקות לפני שהאורחים מגיעים.",
    answers: [
      { text: "שירותים/אמבטיה", points: 59 },
      { text: "מטבח", points: 18 },
      { text: "שטיח/רצפה", points: 11 },
      { text: "סלון", points: 3 },
      { text: "את עצמי", points: 3 },
    ],
  },
  {
    id: 1021,
    question: "איזה משבעת הגמדים מתאר איך אתה מרגיש אחרי כמה כוסות יין?",
    answers: [
      { text: "עליזי", points: 56 },
      { text: "טיפשון/שטייא", points: 25 },
      { text: "ישנוני", points: 10 },
      { text: "ביישני", points: 5 },
      { text: "רגזני", points: 3 },
    ],
  },
  {
    id: 1022,
    question: "הדבר האהוב עליכם לעשות במסיבות.",
    answers: [
      { text: "לרקוד", points: 45 },
      { text: "להתרועע/לדבר", points: 21 },
      { text: "לשתות", points: 18 },
      { text: "לאכול", points: 8 },
      { text: "לשיר/קריוקי", points: 6 },
    ],
  },
  {
    id: 1023,
    question: "חיה שקל לחקות.",
    answers: [
      { text: "קוף/שימפנזה", points: 32 },
      { text: "כלב", points: 21 },
      { text: "חתול", points: 16 },
      { text: "ציפור", points: 14 },
      { text: "פיל", points: 4 },
      { text: "קנגורו", points: 4 },
      { text: "ארנב", points: 4 },
    ],
  },
  {
    id: 1024,
    question: "מילה שכלב מבין.",
    answers: [
      { text: "שב", points: 54 },
      { text: "בוא", points: 11 },
      { text: "טיול", points: 6 },
      { text: "אוכל", points: 6 },
      { text: "השם שלו", points: 5 },
      { text: "שב במקומך", points: 4 },
      { text: "תביא", points: 3 },
      { text: "חטיף", points: 2 },
    ],
  },
  {
    id: 1025,
    question: "מקום שאתה מפסיק ללכת אליו כשאתה מרושש.",
    answers: [
      { text: "מסעדות", points: 32 },
      { text: "חנות/קניון", points: 16 },
      { text: "בר/מועדון לילה", points: 16 },
      { text: "קזינו", points: 15 },
      { text: "קולנוע", points: 8 },
      { text: "הבנק", points: 4 },
      { text: "מרוץ סוסים", points: 3 },
      { text: "משחק כדורגל", points: 2 },
    ],
  },
  {
    id: 1026,
    question: "משהו שאנשים עושים בו שליחויות לפרנסתם.",
    answers: [
      { text: "עיתונים", points: 33 },
      { text: "דואר", points: 28 },
      { text: "פיצה/אוכל", points: 20 },
      { text: "פרחים", points: 6 },
      { text: "חבילות", points: 3 },
      { text: "רהיטים", points: 2 },
    ],
  },
  {
    id: 1027,
    question: "משהו ששומרים ברכב.",
    answers: [
      { text: "כסף/מטבעות", points: 19 },
      { text: "אוכל/מים", points: 18 },
      { text: "ערכת עזרה ראשונה", points: 18 },
      { text: "גלגל רזרבי", points: 15 },
      { text: "מפה", points: 7 },
      { text: "כבלי התנעה", points: 7 },
      { text: "בגדים/נעליים רזרביים", points: 5 },
    ],
  },
  {
    id: 1028,
    question: "משהו שאנשים עושים אולי רק פעם בשבוע.",
    answers: [
      { text: "כביסה", points: 27 },
      { text: "קניות במכולת", points: 25 },
      { text: "התעמלות", points: 21 },
      { text: "ללכת לבית כנסת", points: 15 },
    ],
  },
  {
    id: 1029,
    question: "מטלת בית שאף אחד לא אוהב לעשות.",
    answers: [
      { text: "ניקוי חדר האמבטיה", points: 45 },
      { text: "שטיפת כלים", points: 25 },
      { text: "שאיבת אבק", points: 20 },
      { text: "כביסה", points: 10 },
    ],
  },
  {
    id: 1030,
    question: "מלבד אנשים אחרים, משהו שאנשים מחבקים.",
    answers: [
      { text: "חיות מחמד", points: 53 },
      { text: "כרית", points: 25 },
      { text: "דובי", points: 13 },
      { text: "עצים", points: 7 },
    ],
  },
];

const apiKey = process.env.JSONBIN_API_KEY;
if (!apiKey) {
  console.error(
    "Set JSONBIN_API_KEY environment variable with your JSONBin API key",
  );
  process.exit(1);
}
const useAccessKey = apiKey.includes("$2a$");
const keyHeader = useAccessKey ? "X-Access-Key" : "X-Master-Key";

async function readBin() {
  const res = await fetch(`${JSONBIN_BASE}/b/${BIN_ID}/latest?meta=false`, {
    headers: { [keyHeader]: apiKey },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Read failed: ${res.status}`);
  }
  return res.json();
}

async function updateBin(data) {
  const res = await fetch(`${JSONBIN_BASE}/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      [keyHeader]: apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Update failed: ${res.status}`);
  }
}

async function main() {
  const existing = await readBin();
  const questions = Array.isArray(existing.questions) ? existing.questions : [];
  const existingFm = Array.isArray(existing.fmQuestions)
    ? existing.fmQuestions
    : [];
  const existingQuestions = new Set(existingFm.map((q) => q.question?.trim()));
  const toAdd = newFmQuestions.filter(
    (q) => !existingQuestions.has(q.question.trim()),
  );
  const mergedFm = [...existingFm];
  for (const q of toAdd) {
    mergedFm.push({ ...q });
  }
  const usedQuestionHistory = Array.isArray(existing.usedQuestionHistory)
    ? existing.usedQuestionHistory
    : [];
  await updateBin({ questions, fmQuestions: mergedFm, usedQuestionHistory });
  console.log(
    `Updated bin ${BIN_ID}: added ${toAdd.length} new Fast Money questions (total: ${mergedFm.length})`,
  );
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
