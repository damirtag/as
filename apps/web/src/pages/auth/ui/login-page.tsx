import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/shared/lib";
import { FormField, Input } from "@/shared/components/ui/form";
import Button from "@/shared/components/ui/button";
import { useToast } from "@/shared/components";

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [email, password, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      await login(email.trim(), password);
      toast.success({ title: "Welcome back!" });
      navigate("/feed", { replace: true });
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-zinc-100">Welcome back</h1>
          <p className="text-zinc-500 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Email" error={error} required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              leftIcon={<Mail size={16} className="text-zinc-500" />}
              autoComplete="email"
              autoFocus
            />
          </FormField>

          <FormField label="Password" required>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                leftIcon={<Lock size={16} className="text-zinc-500" />}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={!email.trim() || !password.trim()}
            className="w-full"
          >
            Sign in
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-zinc-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}