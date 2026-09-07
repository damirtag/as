import { Loader2 } from "lucide-react";

/** Full-viewport centered spinner shown while auth state is being resolved. */
export default function PageLoader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950">
      <Loader2 className="animate-spin text-yellow-400" size={28} />
    </div>
  );
}
