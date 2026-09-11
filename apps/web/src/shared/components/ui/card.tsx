import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toBlob } from "html-to-image";

import { useQuoteReaction } from "@/entities/reactions/model/useQuoteReaction";
import { buildShareCardMarkup } from "@/features/share-quote/lib/build-share-card-markup";
import { useAuthStore } from "@/shared/lib";
import { ReactionType } from "@/shared/lib/api";
import { Quote, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

import {
  angry,
  handshake,
  rofl,
  joy,
  like,
  dislike,
  heart,
  sad,
} from '@as/emoji-assets';


const reactionOptions: Array<{ type: ReactionType; emojiPath: string; label: string }> = [
  { type: ReactionType.Like, emojiPath: like, label: "Like" },
  { type: ReactionType.Love, emojiPath: heart, label: "Love" },
  { type: ReactionType.Laugh, emojiPath: joy, label: "Laugh" },
  { type: ReactionType.Rofl, emojiPath: rofl, label: "ROFL" },
  { type: ReactionType.Handshake, emojiPath: handshake, label: "Handshake" },
  { type: ReactionType.Sad, emojiPath: sad, label: "Sad" },
  { type: ReactionType.Angry, emojiPath: angry, label: "Angry" },
  { type: ReactionType.Dislike, emojiPath: dislike, label: "Dislike" },
];


interface QuoteCardProps {
  quote: {
    id: string;
    text: string;
    createdAt: string;
    reactionsSummary?: {
      totalCount: number;
      counts?: Array<{ type: ReactionType; count: number }>;
    };
    reactionsPaginated?: {
      items: Array<{ type: ReactionType; userId: string }>;
    } | null;
    commentsSummary?: {
      totalCount: number;
    }
  };
  user?: {
    username: string;
  } | null;
  currentUserId?: string;
  onClick?: () => void;
  className?: string;
}

export function QuoteCard({ quote, user, onClick, className }: QuoteCardProps) {
  const navigate = useNavigate();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { react } = useQuoteReaction();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [reacting, setReacting] = useState<ReactionType | null>(null);
  const [sharing, setSharing] = useState(false);
  const [sharePreview, setSharePreview] = useState<{ blob: Blob; objectUrl: string } | null>(null);

  const closeSharePreview = () => {
    if (sharePreview) {
      URL.revokeObjectURL(sharePreview.objectUrl);
    }

    setSharePreview(null);
  };

  useEffect(() => {
    if (!sharePreview) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape" || event.code === "Space") {
        event.preventDefault();
        closeSharePreview();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sharePreview]);

  const sortedReactionOptions = [...reactionOptions].sort((first, second) => {
    const firstCount = quote.reactionsSummary?.counts?.find(
      (reaction) => reaction.type === first.type,
    )?.count ?? 0;
    const secondCount = quote.reactionsSummary?.counts?.find(
      (reaction) => reaction.type === second.type,
    )?.count ?? 0;

    return secondCount - firstCount;
  });


  const handleReact = async (event: React.MouseEvent, type: ReactionType) => {
    event.stopPropagation();
    if (!currentUserId || reacting) return;

    setReacting(type);
    try {
      await react(quote.id, currentUserId, type, [
        "GetFeed",
        "GetQuote",
        "GetQuotesByUser",
      ]);
    } finally {
      setReacting(null);
    }
  };

  const handleShare = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (sharing) return;

    setSharing(true);

    try {
      const shareWidth = 1280;
      const estimatedQuoteLines = Math.max(1, Math.ceil(quote.text.trim().length / 36));
      const shareHeight = Math.max(720, 300 + estimatedQuoteLines * 36);
      const hidden = document.createElement("div");

      hidden.style.position = "fixed";
      hidden.style.left = "0";
      hidden.style.top = "0";
      hidden.style.width = `${shareWidth}px`;
      hidden.style.height = `${shareHeight}px`;
      hidden.style.display = "block";
      hidden.style.visibility = "visible";
      hidden.style.pointerEvents = "none";
      hidden.style.zIndex = "999999";
      hidden.style.overflow = "hidden";
      hidden.style.background = "#071c2d";

      const topReactions = sortedReactionOptions
        .map(({ type, emojiPath }) => ({
          type,
          emojiPath,
          count: quote.reactionsSummary?.counts?.find((reaction) => reaction.type === type)?.count ?? 0,
        }))
        .filter((reaction) => reaction.count > 0)
        .slice(0, 3);

      hidden.innerHTML = buildShareCardMarkup({
        quote,
        user,
        topReactions,
        shareWidth,
        shareHeight,
      });

      document.body.appendChild(hidden);

      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 50)));

      try {
          const blob = await toBlob(hidden, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#071c2d",
          width: shareWidth,
          height: shareHeight,
        });

        if (!blob) {
          console.error("html-to-image returned null for share export.");
          return;
        }

        const objectUrl = URL.createObjectURL(blob);
        setSharePreview({ blob, objectUrl });
      } finally {
        document.body.removeChild(hidden);
      }
    } catch (error) {
      console.error("Failed to share quote image", error);
    } finally {
      setSharing(false);
    }
  };

  const handleCopyShare = async () => {
    if (!sharePreview) return;

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": sharePreview.blob,
          }),
        ]);
      }
    } catch (error) {
      console.error("Failed to copy share preview", error);
    }
  };

  const handleDownloadShare = () => {
    if (!sharePreview) return;

    const link = document.createElement("a");
    link.href = sharePreview.objectUrl;
    link.download = `quote-${quote.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={onClick}
        className={`
          group relative bg-black border border-zinc-800 rounded-xl p-5 
          transition-all duration-200 ease-in-out
          hover:border-zinc-700 hover:bg-zinc-950/50 cursor-pointer
          ${className ?? ""}
        `}
      >
      {/* Header: User Info & Time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`View ${user?.username ?? "user"}'s profile`}
            onClick={(event) => {
              event.stopPropagation();
              if (user?.username) navigate(`/${user.username}`);
            }}
            className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-[10px] uppercase shadow-[0_0_10px_rgba(250,204,21,0.2)]"
          >
            {user?.username[0] ?? "?"}
          </button>
          <div className="flex flex-col">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (user?.username) navigate(`/${user.username}`);
              }}
              className="text-left text-sm font-medium text-zinc-100 hover:text-yellow-400 transition-colors"
            >
              {user?.username ?? "Unknown"}
            </button>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
              {new Date(quote.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Quote Content */}
      <div className="w-full relative mb-6">
        <Quote
          size={32}
          className="absolute -top-2 -left-2 text-zinc-800/50 -z-10"
        />
        <p className="text-left text-[15px] leading-relaxed text-zinc-300 font-light break-words">
          {quote.text}
        </p>
      </div>

      {/* Footer: Stats & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap items-center gap-1">
            {sortedReactionOptions.map(({ type, emojiPath, label }) => {
              const count = quote.reactionsSummary?.counts?.find(
                (reaction) => reaction.type === type,
              )?.count ?? 0;
              const active = quote.reactionsPaginated?.items.some(
                (reaction) => reaction.type === type && reaction.userId === currentUserId,
              );

              return (
                <button
                  key={type}
                  type="button"
                  aria-label={`${active ? "Remove" : "Add"} ${label} reaction`}
                  title={label}
                  disabled={!currentUserId || reacting !== null}
                  onClick={(event) => handleReact(event, type)}
                  className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs transition-colors disabled:opacity-50 ${
                    active
                      ? "bg-yellow-400/15 text-yellow-300 ring-1 ring-yellow-400/50"
                      : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
                  }`}
                >
                  <img src={emojiPath} alt="" aria-hidden="true" className="h-4 w-4" />
                  {count > 0 && <span>{count}</span>}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-400 transition-colors">
            <MessageCircle size={14} />
            <span className="text-xs font-medium">
              {quote.commentsSummary?.totalCount || 0}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label={sharing ? "Sharing quote" : "Share quote"}
          disabled={sharing}
          onClick={handleShare}
          className="text-zinc-500 hover:text-zinc-100 transition-colors disabled:opacity-50"
        >
          <Share2 size={14} />
        </button>
      </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-400/0 to-transparent group-hover:via-yellow-400/40 transition-all duration-500" />
      </div>

      {sharePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-200"
          onClick={closeSharePreview}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-[min(90vw,820px)] rounded-2xl border border-zinc-700 bg-zinc-950 p-3 shadow-2xl shadow-black/60 transition-all duration-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-2 pt-1">
              <div>
                <p className="text-sm font-semibold text-zinc-100">Share quote</p>
                <p className="text-xs text-zinc-400">Press space to close</p>
              </div>
              <button
                type="button"
                onClick={closeSharePreview}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
              >
                Close
              </button>
            </div>

            <img
              src={sharePreview.objectUrl}
              alt="Generated quote share preview"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 object-contain"
            />

            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCopyShare}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-500 hover:bg-zinc-800"
              >
                Copy image
              </button>
              <button
                type="button"
                onClick={handleDownloadShare}
                className="rounded-lg bg-yellow-400 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-yellow-300"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuoteCard;
