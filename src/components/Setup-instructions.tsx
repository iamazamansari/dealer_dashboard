import { AlertCircle } from "lucide-react";

// Short helper that points to the README for full setup instructions.
export function SetupInstructions() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
      <div className="flex gap-3 items-center">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
        <div className="text-sm text-amber-800 dark:text-amber-300">
          Maps setup is optional — see <a href="/README.md" className="underline">README</a> for full instructions and production recommendations.
        </div>
      </div>
    </div>
  );
}
