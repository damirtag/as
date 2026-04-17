import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFeed } from "@/entities/quotes/model/useFeed";
import { useCreateQuote } from "@/entities/quotes/model/useCreateQuote";
import { useAuthStore } from "@/shared/lib";
import { useToast } from "@/shared/components";

export function useFeedPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [text, setText] = useState("");

  const { quotes, hasNextPage, loading, loadingMore, loadMore, refetch } =
    useFeed();
  const { createQuote, loading: creating } = useCreateQuote();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !loadingMore) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, loadingMore, loadMore]);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || !user) return;
    try {
      await createQuote({
        variables: { input: { text: trimmed, userId: user.id } },
      });
      setText("");
      toast.success({
        title: "Quote posted",
        description: "Your thought is now live.",
      });
    } catch {
      toast.error({
        title: "Failed to post",
        description: "Please try again.",
      });
    }
  };

  return {
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
  };
}
