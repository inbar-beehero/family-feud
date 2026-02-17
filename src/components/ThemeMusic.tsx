import { useEffect, useRef } from "react";
import { useGame } from "@/context/GameContext";

const themeAudio = new Audio("/sounds/theme.mp3");

export function ThemeMusic() {
  const { view, phase, fmPhase, fmRevealedIndices, fmRevealingQIdx } =
    useGame();
  const faceoffStartRef = useRef(false);
  const faceoffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    themeAudio.loop = true;
    themeAudio.volume = 0.4;
    return () => {
      themeAudio.pause();
      themeAudio.currentTime = 0;
      if (faceoffTimerRef.current) clearTimeout(faceoffTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (view === "start") {
      themeAudio.play().catch(() => {});
      return () => {
        themeAudio.pause();
        themeAudio.currentTime = 0;
      };
    }

    const inGame = view === "game" || view === "host";
    if (inGame && phase === "faceoff") {
      if (!faceoffStartRef.current) {
        faceoffStartRef.current = true;
        themeAudio.play().catch(() => {});
        faceoffTimerRef.current = setTimeout(() => {
          themeAudio.pause();
          themeAudio.currentTime = 0;
          faceoffTimerRef.current = null;
        }, 5000);
      }
      return () => {
        themeAudio.pause();
        themeAudio.currentTime = 0;
        if (faceoffTimerRef.current) {
          clearTimeout(faceoffTimerRef.current);
          faceoffTimerRef.current = null;
        }
      };
    }

    if (inGame && phase === "roundEnd") {
      faceoffStartRef.current = false;
      themeAudio.play().catch(() => {});
      return () => {
        themeAudio.pause();
        themeAudio.currentTime = 0;
      };
    }

    faceoffStartRef.current = false;
    themeAudio.pause();
    themeAudio.currentTime = 0;
    if (faceoffTimerRef.current) {
      clearTimeout(faceoffTimerRef.current);
      faceoffTimerRef.current = null;
    }
  }, [view, phase]);

  useEffect(() => {
    const fmAllDone =
      view === "fastmoney" &&
      fmPhase === "reveal" &&
      fmRevealedIndices.length === 5 &&
      fmRevealingQIdx === null;
    if (fmAllDone) {
      faceoffStartRef.current = false;
      themeAudio.play().catch(() => {});
      return () => {
        themeAudio.pause();
        themeAudio.currentTime = 0;
      };
    }
  }, [view, fmPhase, fmRevealedIndices, fmRevealingQIdx]);

  return null;
}
