import { useEffect, useRef, useState } from "react";
import { GripVertical, Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "stp_theme_toggle_position";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const { theme, setTheme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          setPosition(parsed);
        }
      } catch {
        // ignore invalid saved position
      }
    }
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      const deltaX = event.clientX - pointerStart.current.x;
      const deltaY = event.clientY - pointerStart.current.y;
      const wrapper = wrapperRef.current;
      const width = wrapper?.offsetWidth ?? 250;
      const height = wrapper?.offsetHeight ?? 50;
      const maxX = window.innerWidth - width - 12;
      const maxY = window.innerHeight - height - 12;

      let nextX = dragStart.current.x + deltaX;
      let nextY = dragStart.current.y + deltaY;
      nextX = Math.max(8, Math.min(nextX, maxX));
      nextY = Math.max(8, Math.min(nextY, maxY));

      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      setDragging(false);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, position]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }
    event.preventDefault();
    setDragging(true);
    pointerStart.current = { x: event.clientX, y: event.clientY };
    dragStart.current = { x: position.x, y: position.y };
  };

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "dark" ? "dark" : "light";

  return (
    <div
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        touchAction: "none",
        cursor: dragging ? "grabbing" : "grab",
      }}
      className="flex items-center gap-2 rounded-full border border-input bg-background/90 p-1 shadow-soft backdrop-blur-md dark:bg-slate-950/80"
    >
      <div className="flex h-9 w-9 cursor-grab items-center justify-center rounded-full border border-input bg-muted text-muted-foreground">
        <GripVertical className="h-4 w-4" />
      </div>
      <Button
        variant={currentTheme === "light" ? "secondary" : "outline"}
        size="sm"
        onClick={() => setTheme("light")}
        aria-label="Switch to bright mode"
      >
        <SunMedium className="h-4 w-4" />
        Bright
      </Button>
      <Button
        variant={currentTheme === "dark" ? "secondary" : "outline"}
        size="sm"
        onClick={() => setTheme("dark")}
        aria-label="Switch to dark mode"
      >
        <Moon className="h-4 w-4" />
        Dark
      </Button>
    </div>
  );
};

export default ThemeToggle;
