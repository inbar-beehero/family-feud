import { useState } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { Toast } from "@/components/Toast";
import type { Question, FastMoneyQuestion } from "@/types";

interface AnswerRow {
  text: string;
  points: string;
}

export function AdminPanel() {
  const {
    questions,
    setQuestions,
    fmQuestions,
    setFmQuestions,
    setView,
    show,
    toast,
    storageBinId,
    persistToStorage,
  } = useGame();

  const [editQ, setEditQ] = useState("");
  const [editAs, setEditAs] = useState<AnswerRow[]>([{ text: "", points: "" }]);
  const [editRound, setEditRound] = useState(1);
  const [editMode, setEditMode] = useState<"regular" | "fastmoney">("regular");
  const [editFmQ, setEditFmQ] = useState("");
  const [editFmAs, setEditFmAs] = useState<AnswerRow[]>([
    { text: "", points: "" },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [collapsedRounds, setCollapsedRounds] = useState<Set<number>>(
    new Set(),
  );
  const [fmCollapsed, setFmCollapsed] = useState(false);

  const curAs = editMode === "regular" ? editAs : editFmAs;
  const setCurAs = editMode === "regular" ? setEditAs : setEditFmAs;

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
      let nextQuestions: Question[];
      if (editingId) {
        nextQuestions = questions.map((q) =>
          q.id === editingId
            ? { ...q, round: editRound, question: editQ, answers: valid }
            : q,
        );
        show("השאלה עודכנה!");
      } else {
        nextQuestions = [
          ...questions,
          { id: Date.now(), round: editRound, question: editQ, answers: valid },
        ];
        show("השאלה נשמרה!");
      }
      setQuestions(nextQuestions);
      persistToStorage(nextQuestions, fmQuestions);
      clearEditForm();
    } else {
      if (!editFmQ.trim() || !editFmAs.some((a) => a.text.trim())) {
        show("נא להזין שאלה ולפחות תשובה אחת", "err");
        return;
      }
      const valid = editFmAs
        .filter((a) => a.text.trim())
        .map((a) => ({ text: a.text, points: parseInt(a.points) || 0 }))
        .sort((a, b) => b.points - a.points);
      let nextFm: FastMoneyQuestion[];
      if (editingId) {
        nextFm = fmQuestions.map((q) =>
          q.id === editingId ? { ...q, question: editFmQ, answers: valid } : q,
        );
        show("שאלת פאסט מאני עודכנה!");
      } else {
        nextFm = [
          ...fmQuestions,
          { id: Date.now() + 1000, question: editFmQ, answers: valid },
        ];
        show("שאלת פאסט מאני נשמרה!");
      }
      setFmQuestions(nextFm);
      persistToStorage(questions, nextFm);
      clearEditForm();
    }
  };

  const clearEditForm = () => {
    setEditQ("");
    setEditAs([{ text: "", points: "" }]);
    setEditRound(1);
    setEditFmQ("");
    setEditFmAs([{ text: "", points: "" }]);
    setEditingId(null);
  };

  const startEditQuestion = (q: Question | FastMoneyQuestion, isFm = false) => {
    if (isFm) {
      setEditMode("fastmoney");
      setEditFmQ(q.question);
      setEditFmAs(
        q.answers.map((a) => ({ text: a.text, points: String(a.points) })),
      );
    } else {
      setEditMode("regular");
      setEditQ(q.question);
      setEditAs(
        q.answers.map((a) => ({ text: a.text, points: String(a.points) })),
      );
      setEditRound((q as Question).round ?? 1);
    }
    setEditingId(q.id);
  };

  const delQ = (id: number, isFm = false) => {
    if (isFm) {
      const next = fmQuestions.filter((q) => q.id !== id);
      setFmQuestions(next);
      persistToStorage(questions, next);
    } else {
      const next = questions.filter((q) => q.id !== id);
      setQuestions(next);
      persistToStorage(next, fmQuestions);
    }
    show("השאלה נמחקה");
  };

  const toggleRound = (r: number) => {
    setCollapsedRounds((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  };

  const questionsList = (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-800">
        {editMode === "regular" ? "שאלות קיימות" : "שאלות פאסט מאני"}
      </h2>
      {editMode === "regular" ? (
        [1, 2, 3].map((r) => {
          const rqs = questions.filter((q) => q.round === r);
          const isCollapsed = collapsedRounds.has(r);
          if (!rqs.length) return null;
          return (
            <div key={r}>
              <button
                onClick={() => toggleRound(r)}
                className="flex items-center gap-1 w-full text-right text-sm font-bold text-gray-600 hover:text-gray-800 mb-2"
              >
                {isCollapsed ? (
                  <ChevronRight size={16} className="shrink-0" />
                ) : (
                  <ChevronDown size={16} className="shrink-0" />
                )}
                סיבוב {r} (×{r}){" "}
                <span className="text-gray-400 font-normal">
                  ({rqs.length})
                </span>
              </button>
              {!isCollapsed && (
                <div className="space-y-2">
                  {rqs.map((q) => (
                    <div
                      key={q.id}
                      className={`border rounded-lg p-2 ${editingId === q.id ? "border-yellow-400 bg-yellow-50" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => delQ(q.id)}
                            className="text-red-500 hover:text-red-700 p-0.5"
                            title="מחק"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={() => startEditQuestion(q)}
                            className="text-blue-500 hover:text-blue-700 p-0.5"
                            title="ערוך"
                          >
                            ✎
                          </button>
                        </div>
                        <span className="font-medium text-gray-800 text-right text-sm line-clamp-2">
                          {q.question}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div>
          <button
            onClick={() => setFmCollapsed((c) => !c)}
            className="flex items-center gap-1 w-full text-right text-sm font-bold text-gray-600 hover:text-gray-800 mb-2"
          >
            {fmCollapsed ? (
              <ChevronRight size={16} className="shrink-0" />
            ) : (
              <ChevronDown size={16} className="shrink-0" />
            )}
            רשימת שאלות{" "}
            <span className="text-gray-400 font-normal">
              ({fmQuestions.length})
            </span>
          </button>
          {!fmCollapsed && (
            <div className="space-y-2">
              {fmQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`border rounded-lg p-2 ${editingId === q.id ? "border-yellow-400 bg-yellow-50" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => delQ(q.id, true)}
                        className="text-red-500 hover:text-red-700 p-0.5"
                        title="מחק"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => startEditQuestion(q, true)}
                        className="text-blue-500 hover:text-blue-700 p-0.5"
                        title="ערוך"
                      >
                        ✎
                      </button>
                    </div>
                    <span className="font-medium text-gray-800 text-right text-sm line-clamp-2">
                      {q.question}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-100" dir="rtl">
      {toast && <Toast {...toast} />}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="shrink-0 flex justify-between items-center p-6 pb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">פאנל ניהול</h1>
            {storageBinId && (
              <p className="text-sm text-gray-500 mt-1 font-mono">
                Bin ID: {storageBinId}
              </p>
            )}
          </div>
          <button
            onClick={() => setView("start")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            חזרה
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-gray-100 pb-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
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
                {editingId
                  ? editMode === "fastmoney"
                    ? "עריכת שאלת פאסט מאני"
                    : "עריכת שאלה"
                  : editMode === "fastmoney"
                    ? "הוספת שאלה לפאסט מאני"
                    : "הוספת שאלה חדשה"}
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
                        onClick={() =>
                          setCurAs(curAs.filter((_, j) => j !== i))
                        }
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
              <div className="flex gap-3">
                <button
                  onClick={saveQuestion}
                  className={`flex-1 ${editingId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"} text-white py-2 rounded-lg font-bold transition`}
                >
                  {editingId ? "עדכן שאלה" : "שמור שאלה"}
                </button>
                {editingId && (
                  <button
                    onClick={clearEditForm}
                    className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-400 transition"
                  >
                    ביטול
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <aside className="w-80 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        {questionsList}
      </aside>
    </div>
  );
}
