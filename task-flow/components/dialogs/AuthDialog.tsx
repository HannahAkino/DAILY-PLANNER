// components/dialogs/AuthDialog.tsx
"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtSign, KeyRound, User, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export default function AuthDialog({ isOpen, onClose, onAuthSuccess }: AuthDialogProps) {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      
      const { error } = await signIn(loginEmail, loginPassword);

      if (error) throw error;
      
      onAuthSuccess();
      resetForm();
      onClose();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (registerPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      
      const { error } = await signUp(registerEmail, registerPassword, registerName);

      if (error) throw error;
      
      // Switch to login tab if registration is successful
      setActiveTab("login");
      resetForm();
      setErrorMessage("Registration successful! Please check your email to confirm your account.");
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setErrorMessage("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader className="bg-primary/5 p-4 -mx-6 -mt-6 rounded-t-lg border-b">
          <DialogTitle className="text-2xl font-semibold">Welcome to TaskFlow</DialogTitle>
          <DialogDescription>
            Manage your tasks efficiently and stay organized
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Register
            </TabsTrigger>
          </TabsList>

          {errorMessage && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          <TabsContent value="login" className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 font-medium">
                <AtSign className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="your@email.com"
                className="border-input focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 font-medium">
                <KeyRound className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="border-input focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button 
              className="w-full flex items-center justify-center gap-2 mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="registerName" className="flex items-center gap-2 font-medium">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                id="registerName"
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="John Doe"
                className="border-input focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerEmail" className="flex items-center gap-2 font-medium">
                <AtSign className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="registerEmail"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="your@email.com"
                className="border-input focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerPassword" className="flex items-center gap-2 font-medium">
                <KeyRound className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="registerPassword"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="••••••••"
                className="border-input focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerConfirmPassword" className="flex items-center gap-2 font-medium">
                <Shield className="h-4 w-4" />
                Confirm Password
              </Label>
              <Input
                id="registerConfirmPassword"
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="border-input focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button 
              className="w-full flex items-center justify-center gap-2 mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="text-center text-xs text-muted-foreground mt-4 flex flex-col">
          <p>By using this service, you agree to our Terms of Service and Privacy Policy.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
