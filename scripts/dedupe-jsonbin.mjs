const BIN_ID = "698f2df1d0ea881f40b79e92";
const JSONBIN_BASE = "https://api.jsonbin.io/v3";

const apiKey = process.env.JSONBIN_API_KEY;
if (!apiKey) {
  console.error("Set JSONBIN_API_KEY environment variable");
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

function norm(q) {
  return (q?.question ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.،,;:!?]+$/, "");
}

function dedupeQuestions(arr) {
  const seen = new Set();
  const kept = [];
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    const key = norm(arr[i]);
    if (!key) continue;
    if (seen.has(key)) {
      duplicates.push({ index: i, question: arr[i].question, id: arr[i].id });
    } else {
      seen.add(key);
      kept.push(arr[i]);
    }
  }
  return { kept, duplicates };
}

async function main() {
  const data = await readBin();
  const questions = Array.isArray(data.questions) ? data.questions : [];
  const fmQuestions = Array.isArray(data.fmQuestions) ? data.fmQuestions : [];

  const { kept: qKept, duplicates: qDupes } = dedupeQuestions(questions);
  const { kept: fmKept, duplicates: fmDupes } = dedupeQuestions(fmQuestions);

  let nextId = 1;
  const qDeduped = qKept.map((q) => ({ ...q, id: nextId++ }));
  const fmStart = 1001;
  let fmNext = fmStart;
  const fmDeduped = fmKept.map((q) => ({ ...q, id: fmNext++ }));

  if (qDupes.length > 0) {
    console.log("Regular question duplicates removed:");
    qDupes.forEach((d) => console.log(`  - [${d.id}] ${d.question}`));
  }
  if (fmDupes.length > 0) {
    console.log("Fast Money duplicates removed:");
    fmDupes.forEach((d) => console.log(`  - [${d.id}] ${d.question}`));
  }

  const totalRemoved = qDupes.length + fmDupes.length;
  if (totalRemoved === 0) {
    console.log("No duplicates found.");
    return;
  }

  await updateBin({ questions: qDeduped, fmQuestions: fmDeduped });
  console.log(
    `\nRemoved ${totalRemoved} duplicates. Questions: ${qDeduped.length}, Fast Money: ${fmDeduped.length}`,
  );
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
