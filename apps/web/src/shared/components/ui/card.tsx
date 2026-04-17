import { Quote, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

interface QuoteCardProps {
  quote: {
    id: string;
    text: string;
    createdAt: string;
    user: {
      username: string;
      avatarColor?: string;
    };
    reactionsSummary?: {
      totalCount: number;
    };
  };
  currentUserId?: string;
  onClick?: () => void;
  className?: string;
}

export function QuoteCard({ quote, onClick, className }: QuoteCardProps) {
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
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-[10px] uppercase shadow-[0_0_10px_rgba(250,204,21,0.2)]">
            {quote.user.username[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-100 group-hover:text-yellow-400 transition-colors">
              {quote.user.username}
            </span>
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
      <div className="relative mb-6">
        <Quote
          size={32}
          className="absolute -top-2 -left-2 text-zinc-800/50 -z-10"
        />
        <p className="text-[15px] leading-relaxed text-zinc-300 font-light break-words">
          {quote.text}
        </p>
      </div>

      {/* Footer: Stats & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
        <div className="flex items-center gap-4">
          {/* Reactions Stat */}
          <div className="flex items-center gap-1.5 text-zinc-500 hover:text-yellow-400 transition-colors">
            <div className="flex -space-x-1">
              <span className="text-xs">👍</span>
            </div>
            <span className="text-xs font-medium">
              {quote.reactionsSummary?.totalCount || 0}
            </span>
          </div>

          {/* TODO: Implement real comments data*/}
          <div className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-400 transition-colors">
            <MessageCircle size={14} />
            <span className="text-xs font-medium">12</span>
          </div>
        </div>

        <button className="text-zinc-500 hover:text-zinc-100 transition-colors">
          <Share2 size={14} />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-400/0 to-transparent group-hover:via-yellow-400/40 transition-all duration-500" />
    </div>
  );
}

export default QuoteCard;
