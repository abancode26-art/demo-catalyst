import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import loginHero from "@/assets/login-hero.jpg";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("Please enter your credentials");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = login(phone, password);
      setLoading(false);
      if (success) {
        // Navigate based on role
        const user = [
          { phone: "0700000001", path: "/dashboard" },
          { phone: "0700000002", path: "/dashboard" },
          { phone: "0700000003", path: "/admin" },
        ].find((u) => u.phone === phone);
        navigate(user?.path || "/dashboard");
      } else {
        toast.error("Invalid phone number or password");
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left hero */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, hsl(215 60% 12%) 0%, hsl(215 70% 22%) 50%, hsl(215 80% 35%) 100%)`,
        }}
      >
        <img
          src={loginHero}
          alt="Financial technology"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity"
        />
        <div className="relative z-10 text-center px-12">
          <div className="h-16 w-16 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-primary/30">
            <Landmark className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-3">Welcome Back</h2>
          <p className="text-primary-foreground/70 text-base max-w-sm mx-auto">
            Access your wallet, view transactions, and manage your finances securely.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Landmark className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AbanRemit</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">Sign In</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0700000001"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button className="text-primary font-medium hover:underline">Create Account</button>
          </p>
        </div>
      </div>
    </div>
  );
}
