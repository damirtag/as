import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuote } from "@/entities/quotes/model/useQuote";
import { useAuthStore } from "@/shared/lib";
import { QuoteCard } from "@/shared/components";
import Button from "@/shared/components/ui/button";
// import { useToast } from "@/shared/components";

export default function QuotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { toast } = useToast();
  const { user } = useAuthStore();

  const { quote, loading, error } = useQuote(id!);
  const [text] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-semibold text-zinc-100">Quote not found</h1>
          <p className="text-zinc-500">The quote you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/feed")} variant="secondary">
            Back to feed
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Quote */}
        <QuoteCard
          quote={quote}
          currentUserId={user?.id}
          className="cursor-default hover:border-zinc-800 hover:bg-black"
        />

        {/* TODO: Comments Section */}
        
      </div>
    </div>
  );
}