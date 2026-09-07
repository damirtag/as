import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuote } from "@/entities/quotes/model/useQuote";
import { CREATE_COMMENT } from "@/entities/comments/model/comments.documents";
import { useAuthStore } from "@/shared/lib";
import type {
  CreateCommentMutation,
  CreateCommentMutationVariables,
} from "@/shared/lib/api";
import { QuoteCard } from "@/shared/components";
import Button from "@/shared/components/ui/button";
// import { useToast } from "@/shared/components";

export default function QuotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { toast } = useToast();
  const { user } = useAuthStore();

  const { quote, loading, error } = useQuote(id!);
  const [text, setText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [createComment, { loading: creatingComment }] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(CREATE_COMMENT, { refetchQueries: ["GetQuote"] });

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text]);

  const handleCommentSubmit = async () => {
    const trimmedText = text.trim();
    if (!id || !user?.id || !trimmedText || creatingComment) return;

    setCommentError(null);
    try {
      await createComment({
        variables: {
          input: { quoteId: id, userId: user.id, text: trimmedText },
        },
      });
      setText("");
    } catch {
      setCommentError("Unable to post comment. Please try again.");
    }
  };

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
          user={quote.user}
          currentUserId={user?.id}
          className="cursor-default hover:border-zinc-800 hover:bg-black"
        />

        <section className="w-full space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100">Comments</h2>
            <span className="text-xs text-zinc-500">
              {quote.commentsSummary?.totalCount ?? 0}
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Write a comment..."
              rows={2}
              maxLength={500}
              className="w-full bg-transparent resize-none text-left text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none"
            />
            <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
              <span className="text-xs text-zinc-600">{text.length} / 500</span>
              <Button
                size="sm"
                loading={creatingComment}
                disabled={!text.trim() || !user?.id}
                onClick={handleCommentSubmit}
              >
                Comment
              </Button>
            </div>
            {commentError && <p className="text-xs text-red-400">{commentError}</p>}
          </div>

          <div className="space-y-3">
            {quote.commentsPaginated?.items.map((comment) => (
              <article key={comment.id} className="w-full border-b border-zinc-900 pb-3 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-yellow-400">
                    {comment.user?.username ?? "Unknown user"}
                  </span>
                  <time className="text-[10px] text-zinc-600">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-left text-sm leading-relaxed text-zinc-300 break-words">{comment.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}