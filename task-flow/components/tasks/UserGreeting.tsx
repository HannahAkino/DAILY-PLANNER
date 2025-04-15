// components/tasks/UserGreeting.tsx
interface UserGreetingProps {
    name: string;
}

export default function UserGreeting({ name }: UserGreetingProps) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
                Hello, <span className="text-blue-600">{name}</span>!
            </h2>
            <p className="text-gray-600">Here's what you need to do today.</p>
        </div>
    );
}