import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Compass, Lock, User, Mail, UserPlus, LogIn, Phone } from "lucide-react";
import { apiLogin, apiRegister } from "@/lib/api";
import heroImage from "@/assets/hero-india.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ── Login form ──
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  // ── Register form ──
  const [regForm, setRegForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
  });

  // ─── Login ────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      toast({ title: "Missing details", description: "Please enter username and password." });
      return;
    }
    setLoading(true);
    try {
      const { user, message } = await apiLogin({
        username: loginForm.username.trim(),
        password: loginForm.password,
      });
      // Persist user info to sessionStorage
      sessionStorage.setItem("stp_user", user.username);
      sessionStorage.setItem("stp_userId", user.id);
      sessionStorage.setItem("stp_userInfo", JSON.stringify(user));
      toast({ title: message, description: "Let's plan your next adventure." });
      navigate("/plan");
    } catch (err: unknown) {
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Register ─────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.username.trim() || !regForm.password.trim()) {
      toast({ title: "Missing details", description: "Username and password are required." });
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please re-enter your password.", variant: "destructive" });
      return;
    }
    if (regForm.password.length < 4) {
      toast({ title: "Weak password", description: "Password must be at least 4 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { user, message } = await apiRegister({
        username: regForm.username.trim(),
        password: regForm.password,
        email: regForm.email.trim(),
        fullName: regForm.fullName.trim(),
        phone: regForm.phone.trim(),
      });
      // Auto-login after register
      sessionStorage.setItem("stp_user", user.username);
      sessionStorage.setItem("stp_userId", user.id);
      sessionStorage.setItem("stp_userInfo", JSON.stringify(user));
      toast({ title: message, description: "Your account has been created. Welcome aboard!" });
      navigate("/plan");
    } catch (err: unknown) {
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Hero side */}
      <div className="relative hidden lg:block overflow-hidden">
        <img
          src={heroImage}
          alt="Scenic view of India"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <img src="/logo.png" alt="Smart Tour Planner" className="h-7 w-7 object-contain rounded-md" />
            <span>Smart Tour Planner</span>
          </div>
          <div>
            <h2 className="font-display text-5xl leading-tight">
              Discover the soul of India,<br />one journey at a time.
            </h2>
            <p className="mt-4 max-w-md text-lg opacity-90">
              From the Himalayas to Kerala's backwaters — plan your perfect trip in minutes.
            </p>
            <div className="mt-6 flex gap-6 text-sm opacity-80">
              <div><p className="text-2xl font-bold">10+</p><p>States covered</p></div>
              <div><p className="text-2xl font-bold">3</p><p>Package tiers</p></div>
              <div><p className="text-2xl font-bold">∞</p><p>Memories made</p></div>
            </div>
          </div>
          <p className="text-sm opacity-75">© {new Date().getFullYear()} Smart Tour Planner</p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <Card className="w-full max-w-md p-8 shadow-elegant border-border/50">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-warm text-primary-foreground shadow-soft">
              <img src="/logo.png" alt="Smart Tour Planner" className="h-8 w-8 object-contain" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Smart Tour Planner</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your journey is saved to the cloud ☁️</p>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="gap-2">
                <LogIn className="h-4 w-4" /> Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-2">
                <UserPlus className="h-4 w-4" /> Sign Up
              </TabsTrigger>
            </TabsList>

            {/* ── LOGIN TAB ── */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      placeholder="your_username"
                      className="pl-10"
                      maxLength={50}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="pl-10"
                      maxLength={100}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full mt-2" disabled={loading}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* ── REGISTER TAB ── */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reg-username"
                        value={regForm.username}
                        onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                        placeholder="karthik"
                        className="pl-10"
                        maxLength={50}
                        autoComplete="username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-fullname">Full name</Label>
                    <Input
                      id="reg-fullname"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      placeholder="Karthik V"
                      maxLength={80}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="you@example.com"
                      className="pl-10"
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="reg-phone"
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="pl-10"
                      maxLength={20}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reg-password"
                        type="password"
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="Min 4 chars"
                        className="pl-10"
                        maxLength={100}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm">Confirm *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="reg-confirm"
                        type="password"
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                        placeholder="Repeat"
                        className="pl-10"
                        maxLength={100}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full mt-2" disabled={loading}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {loading ? "Creating account…" : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
