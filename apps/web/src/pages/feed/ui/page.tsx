import { Send, Loader2, RefreshCw } from "lucide-react";
import { QuoteCard } from "@/shared/components";
import Button from "@/shared/components/ui/button";
import { useFeedPage } from "@/features/feed-page/useFeedPage";

export default function FeedPage() {
  const {
    user,
    text,
    setText,
    quotes,
    loading,
    loadingMore,
    creating,
    hasNextPage,
    textareaRef,
    loaderRef,
    handleSubmit,
    refetch,
    navigate,
  } = useFeedPage();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Compose box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-zinc-950 font-bold text-xs uppercase shrink-0">
            {user?.username?.[0] ?? "?"}
          </div>
          <span className="text-sm text-zinc-400 font-medium">
            {user?.username}
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.metaKey || e.ctrlKey) && handleSubmit()
          }
          placeholder="Share a thought, quote, or idea…"
          rows={2}
          className="w-full bg-transparent resize-none text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none min-h-[52px]"
        />

        <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
          <span className="text-xs text-zinc-600">
            {text.length > 0 ? (
              <span
                className={text.length > 500 ? "text-red-400" : "text-zinc-500"}
              >
                {text.length} / 500
              </span>
            ) : (
              "⌘ + Enter to post"
            )}
          </span>
          <Button
            variant="primary"
            size="sm"
            icon={<Send size={13} />}
            loading={creating}
            disabled={!text.trim() || text.length > 500}
            onClick={handleSubmit}
          >
            Post
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Latest
        </h2>
        <button
          onClick={() => refetch()}
          className="text-zinc-600 hover:text-zinc-300"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Feed */}
      {loading && !quotes.length ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              currentUserId={user?.id}
              onClick={() => navigate(`/q/${quote.id}`)}
            />
          ))}
        </div>
      )}

      {/* Sentinel */}
      <div ref={loaderRef} className="h-8 flex items-center justify-center">
        {loadingMore && (
          <Loader2 size={18} className="animate-spin text-zinc-600" />
        )}
        {!hasNextPage && quotes.length > 0 && (
          <p className="text-xs text-zinc-700">You've reached the end</p>
        )}
      </div>
    </div>
  );
}
