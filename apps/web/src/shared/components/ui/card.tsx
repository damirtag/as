import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuoteReaction } from "@/entities/reactions/model/useQuoteReaction";
import { useAuthStore } from "@/shared/lib";
import { ReactionType } from "@/shared/lib/api";
import { Quote, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

import angry from '@/app/assets/emojis/angry.svg';
import handshake from '@/app/assets/emojis/handshake.svg';
import rofl from '@/app/assets/emojis/rofl.svg';
import joy from '@/app/assets/emojis/joy.svg';
import like from '@/app/assets/emojis/like.svg';
import dislike from '@/app/assets/emojis/dislike.svg';
import heart from '@/app/assets/emojis/heart.svg';
import sad from '@/app/assets/emojis/sad.svg';

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
  const [reacting, setReacting] = useState<ReactionType | null>(null);
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

  return (
    <div
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

          {/* TODO: Implement real comments data*/}
          <div className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-400 transition-colors">
            <MessageCircle size={14} />
            <span className="text-xs font-medium">
              {quote.commentsSummary?.totalCount || 0}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Share quote"
          onClick={(event) => event.stopPropagation()}
          className="text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          <Share2 size={14} />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-400/0 to-transparent group-hover:via-yellow-400/40 transition-all duration-500" />
    </div>
  );
}

export default QuoteCard;
