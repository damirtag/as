import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import { useAuthStore } from "@/shared/lib";
import { useUser } from "@/entities/users/model/useUser";
import { useQuoteByUserId } from "@/entities/quotes/model/useQuoteByUser";
import { QuoteCard } from "@/shared/components";
import Button from "@/shared/components/ui/button";

export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  // TODO: Implement user fetching hook
  const { user } = useUser(userId ?? "");
  const { quotes, loading } = useQuoteByUserId(user?.id ?? "");

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-semibold text-zinc-100">User not found</h1>
          <p className="text-zinc-500">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/feed")} variant="secondary">
            Back to feed
          </Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === user?.username;

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
        {/* Profile Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-zinc-950 font-bold text-2xl uppercase shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              {user.username[0]}
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-xl font-bold text-zinc-100">{user.username}</h1>
                <p className="text-zinc-500 text-sm">@{user.username.toLowerCase()}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <span>
                  <strong className="text-zinc-100">{quotes.length}</strong> quotes
                </span>
                <span>
                  <strong className="text-zinc-100">0</strong> following
                </span>
                <span>
                  <strong className="text-zinc-100">0</strong> followers
                </span>
              </div>

              {/* Bio */}
              {/* <p className="text-zinc-300 text-sm leading-relaxed">
                {user.bio || "No bio yet."}
              </p> */}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {isOwnProfile && (
              <Button variant="secondary" size="sm">
                Edit profile
              </Button>
            )}
          </div>
        </div>

        {/* User's Quotes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Quotes</h2>

          {quotes.length > 0 ? (
            <div className="space-y-3">
              {quotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  user={user}
                  currentUserId={currentUser?.id}
                  onClick={() => navigate(`/q/${quote.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="text-zinc-100 font-medium mb-2">No quotes yet</h3>
              <p className="text-zinc-500 text-sm">
                {isOwnProfile
                  ? "странно что у тебя нет цитат"
                  : `${user.username} dont't have any quotes yet.`
                }
              </p>
              {isOwnProfile && (
                <Button
                  onClick={() => navigate("/feed")}
                  variant="primary"
                  size="sm"
                  className="mt-4"
                >
                  Go to feed
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}