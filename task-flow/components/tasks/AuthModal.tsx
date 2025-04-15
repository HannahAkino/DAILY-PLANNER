// components/tasks/AuthModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

type AuthError = {
  message: string;
  status?: number;
};

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    onRegister: (name: string, email: string, password: string) => Promise<{ error: AuthError | null }>;
}

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
    const [showRegister, setShowRegister] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSuccessTransition = () => {
        console.log("AuthModal: Success transition initiated");
        setIsSubmitting(false);
        
        // Set auth session cookie to prevent redirect loops
        document.cookie = "auth_session_active=true; path=/; max-age=86400"; // 24 hours
        
        // Small delay before redirecting to allow state updates
        setTimeout(() => {
            // Use direct navigation for more reliable redirect
            window.location.href = '/tasks';
        }, 1500);
    };

    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            toast.error("Please enter both email and password");
            return;
        }
        
        try {
            setIsSubmitting(true);
            const { error } = await onLogin(loginEmail, loginPassword);
            
            if (error) {
                console.error("Login error:", error);
                setIsSubmitting(false);
                toast.error(`Login failed: ${error.message || 'An error occurred'}`);
                return;
            }
            
            console.log("Login successful, redirecting to /tasks");
            toast.success("Login successful! Redirecting to your tasks...");
            
            // Set auth cookies to ensure middleware recognizes the user
            document.cookie = "auth_session_active=true; path=/; max-age=86400"; // 24 hours
            document.cookie = "no_redirect=true; path=/; max-age=10"; // 10 seconds to prevent immediate redirects
            
            // Use the success transition handler
            handleSuccessTransition();
        } catch (err) {
            console.error("Unexpected login error:", err);
            setIsSubmitting(false);
            toast.error("An unexpected error occurred during login");
        }
    };

    const handleRegister = async () => {
        if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (registerPassword !== registerConfirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (registerPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        // Email validation using regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(registerEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setIsSubmitting(true);
            console.log("Attempting registration with:", registerEmail, registerName);
            const { error } = await onRegister(registerName, registerEmail, registerPassword);
            
            if (error) {
                console.error("Registration error:", error);
                setIsSubmitting(false);
                toast.error(`Registration failed: ${error.message || 'An error occurred'}`);
                return;
            }
            
            console.log("Registration successful");
            setRegistrationComplete(true);
        } catch (err) {
            console.error("Unexpected registration error:", err);
            setIsSubmitting(false);
            toast.error("An unexpected error occurred during registration");
        }
    };

    const resetForm = () => {
        setLoginEmail("");
        setLoginPassword("");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
        setRegistrationComplete(false);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        resetForm();
        setShowRegister(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
                    <DialogHeader className="text-left">
                        <DialogTitle className="text-2xl font-bold">
                            {showRegister ? "Create your account" : "Welcome back"}
                        </DialogTitle>
                        <p className="text-indigo-100 mt-1">
                            {showRegister 
                                ? "Join TaskFlow to boost your productivity" 
                                : "Sign in to continue managing your tasks"}
                        </p>
                    </DialogHeader>
                </div>

                {registrationComplete ? (
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle className="h-16 w-16 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold">Registration Successful!</h3>
                            <p className="text-gray-500 max-w-sm">
                                We&apos;ve sent a confirmation email to <span className="font-semibold">{registerEmail}</span>. 
                                Please check your inbox and verify your email to activate your account.
                            </p>
                            <Button 
                                onClick={() => {
                                    setRegistrationComplete(false);
                                    setShowRegister(false);
                                }}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2"
                            >
                                Go to Sign In
                            </Button>
                        </div>
                    </div>
                ) : !showRegister ? (
                    <div className="p-6 space-y-4">
                        <div className="space-y-3">
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email address"
                                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <a href="#" className="text-sm text-indigo-600 hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <Button 
                            onClick={handleLogin} 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 py-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                        
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or</span>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don&apos;t have an account?
                            </p>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowRegister(true)} 
                                className="mt-2 w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                            >
                                Create Account
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        <div className="space-y-3">
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <Input
                                    id="registerName"
                                    type="text"
                                    placeholder="Full name"
                                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <Input
                                    id="registerEmail"
                                    type="email"
                                    placeholder="Email address"
                                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Input
                                    id="registerPassword"
                                    type="password"
                                    placeholder="Password (min. 6 characters)"
                                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <Input
                                    id="registerConfirmPassword"
                                    type="password"
                                    placeholder="Confirm password"
                                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                    value={registerConfirmPassword}
                                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                By signing up, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                            </p>
                            
                            <Button 
                                onClick={handleRegister} 
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 py-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        Create Account <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                            
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or</span>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Already have an account?
                                </p>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setShowRegister(false)} 
                                    className="mt-2 w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                                >
                                    Sign In
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}