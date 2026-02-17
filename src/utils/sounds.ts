const correctAudio = new Audio("/sounds/correct.mp3");
const wrongAudio = new Audio("/sounds/wrong.mp3");

export function playCorrectAnswer() {
  try {
    correctAudio.currentTime = 0;
    correctAudio.play().catch(() => {});
  } catch {}
}

export function playWrongAnswer() {
  try {
    wrongAudio.currentTime = 0;
    wrongAudio.play().catch(() => {});
  } catch {}
}
