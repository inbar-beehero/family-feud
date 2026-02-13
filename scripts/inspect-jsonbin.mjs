const BIN_ID = "698f2df1d0ea881f40b79e92";
const JSONBIN_BASE = "https://api.jsonbin.io/v3";

const apiKey = process.env.JSONBIN_API_KEY;
if (!apiKey) {
  console.error("Set JSONBIN_API_KEY environment variable");
  process.exit(1);
}
const useAccessKey = apiKey.includes("$2a$");
const keyHeader = useAccessKey ? "X-Access-Key" : "X-Master-Key";

async function main() {
  const res = await fetch(`${JSONBIN_BASE}/b/${BIN_ID}/latest?meta=false`, {
    headers: { [keyHeader]: apiKey },
  });
  const data = await res.json();
  const fm = data.fmQuestions || [];
  console.log(`Total fmQuestions: ${fm.length}`);
  const byQuestion = {};
  fm.forEach((q, i) => {
    const key = (q.question || "").trim();
    if (!byQuestion[key]) byQuestion[key] = [];
    byQuestion[key].push({ i, id: q.id });
  });
  const dupes = Object.entries(byQuestion).filter(([, arr]) => arr.length > 1);
  if (dupes.length > 0) {
    console.log("\nDuplicates (same question text):");
    dupes.forEach(([q, arr]) => {
      console.log(
        `  "${q.slice(0, 50)}..." (${arr.length}x): ids=${arr.map((a) => a.id).join(", ")}`,
      );
    });
  }
  const byId = {};
  fm.forEach((q) => {
    const id = q.id;
    if (!byId[id]) byId[id] = [];
    byId[id].push(q.question);
  });
  const idDupes = Object.entries(byId).filter(([, arr]) => arr.length > 1);
  if (idDupes.length > 0) {
    console.log("\nDuplicate IDs:", idDupes);
  }
}

main().catch(console.error);
