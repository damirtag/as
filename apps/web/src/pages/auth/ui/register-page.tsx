import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuthStore } from "@/shared/lib";
import { FormField, Input } from "@/shared/components/ui/form";
import Button from "@/shared/components/ui/button";
import { useToast } from "@/shared/components";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [email, username, password, confirmPassword, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !username.trim() || !password.trim()) return;

    if (password !== confirmPassword) {
      toast.error({ title: "Passwords don't match" });
      return;
    }

    if (password.length < 6) {
      toast.error({ title: "Password must be at least 6 characters" });
      return;
    }

    try {
      await register(email.trim(), password, username.trim());
      toast.success({ title: "Account created successfully!" });
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
          <h1 className="text-2xl font-bold text-zinc-100">Create account</h1>
          <p className="text-zinc-500 text-sm">
            Join the community and start sharing your thoughts
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField label="Username" required>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              leftIcon={<User size={16} className="text-zinc-500" />}
              autoComplete="username"
              autoFocus
            />
          </FormField>

          <FormField label="Email" error={error} required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              leftIcon={<Mail size={16} className="text-zinc-500" />}
              autoComplete="email"
            />
          </FormField>

          <FormField label="Password" required>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                leftIcon={<Lock size={16} className="text-zinc-500" />}
                autoComplete="new-password"
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

          <FormField label="Confirm Password" required>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                leftIcon={<Lock size={16} className="text-zinc-500" />}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()}
            className="w-full"
          >
            Create account
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-zinc-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}