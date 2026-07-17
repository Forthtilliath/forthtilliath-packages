import { cn } from "@/lib/utils";

export interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const CHECKS: { test: (password: string) => boolean; label: string }[] = [
  { test: (password) => password.length >= 8, label: "At least 8 characters" },
  {
    test: (password) => /[a-z]/.test(password) && /[A-Z]/.test(password),
    label: "Upper & lowercase letters",
  },
  { test: (password) => /\d/.test(password), label: "At least one number" },
  {
    test: (password) => /[^a-zA-Z0-9]/.test(password),
    label: "At least one symbol",
  },
];

const LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-amber-500 dark:bg-amber-400",
  "bg-amber-500 dark:bg-amber-400",
  "bg-green-600 dark:bg-green-400",
];

/**
 * A visual strength meter for a password, pairs with `PasswordInput` —
 * scores against four common heuristics (length, case mix, digit, symbol)
 * rather than a full password-strength library, since those checks are
 * what every reference source actually surfaces to the user anyway.
 *
 * @see https://www.rigidui.com/docs/components/strength-meter
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function PasswordStrengthMeter({
  password,
  className,
}: PasswordStrengthMeterProps) {
  const score = CHECKS.filter((check) => check.test(password)).length;
  const failedChecks = CHECKS.filter((check) => !check.test(password));

  return (
    <div
      data-slot="password-strength-meter"
      className={cn("grid gap-1.5", className)}
    >
      <div className="flex gap-1">
        {CHECKS.map((check, index) => (
          <div
            key={check.label}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              index < score ? COLORS[score] : "bg-muted",
            )}
          />
        ))}
      </div>
      {password.length > 0 && (
        <p className="text-muted-foreground text-xs">
          {LABELS[score]}
          {failedChecks.length > 0 &&
            ` — missing: ${failedChecks.map((check) => check.label).join(", ")}`}
        </p>
      )}
    </div>
  );
}
