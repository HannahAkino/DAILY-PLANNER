// components/tasks/UserGreeting.tsx
interface UserGreetingProps {
    userName: string;
    isAuthenticated: boolean;
    onLogin: () => void;
}

export default function UserGreeting({ userName, isAuthenticated, onLogin }: UserGreetingProps) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Hello, <span className="text-blue-600 dark:text-blue-400">{userName}</span>!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
                {isAuthenticated 
                    ? "Here are your tasks for today." 
                    : "Sign in to start managing your tasks."}
            </p>
        </div>
    );
}