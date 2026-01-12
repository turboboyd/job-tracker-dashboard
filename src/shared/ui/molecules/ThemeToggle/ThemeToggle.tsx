import { useTheme } from "src/app/providers/ThemeProvider";
import { Button } from "src/shared/ui";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      size="sm"
      shape="pill"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </Button>
  );
}
