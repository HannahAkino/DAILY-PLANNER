// components/tasks/AuthModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string) => void;
    onRegister: (name: string, email: string, password: string) => void;
}

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
    const [showRegister, setShowRegister] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

    // components/tasks/AuthModal.tsx (continued)
    const handleLogin = () => {
        if (!loginEmail || !loginPassword) {
            alert("Please enter both email and password");
            return;
        }

        onLogin(loginEmail, loginPassword);
        resetForm();
    };

    const handleRegister = () => {
        if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
            alert("Please fill in all fields");
            return;
        }

        if (registerPassword !== registerConfirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (registerPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        onRegister(registerName, registerEmail, registerPassword);
        resetForm();
    };

    const resetForm = () => {
        setLoginEmail("");
        setLoginPassword("");
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
    };

    const handleClose = () => {
        resetForm();
        setShowRegister(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Welcome to TaskFlow</DialogTitle>
                </DialogHeader>

                {!showRegister ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleLogin}>
                            Sign In
                        </Button>
                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Button variant="link" onClick={() => setShowRegister(true)} className="text-blue-600 p-0">
                                Sign up
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="registerName">Name</Label>
                            <Input
                                id="registerName"
                                type="text"
                                value={registerName}
                                onChange={(e) => setRegisterName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registerEmail">Email</Label>
                            <Input
                                id="registerEmail"
                                type="email"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registerPassword">Password</Label>
                            <Input
                                id="registerPassword"
                                type="password"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registerConfirmPassword">Confirm Password</Label>
                            <Input
                                id="registerConfirmPassword"
                                type="password"
                                value={registerConfirmPassword}
                                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleRegister}>
                            Create Account
                        </Button>
                        <div className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Button variant="link" onClick={() => setShowRegister(false)} className="text-blue-600 p-0">
                                Sign in
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}