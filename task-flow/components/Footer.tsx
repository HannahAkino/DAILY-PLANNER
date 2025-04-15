// components/Footer.tsx
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin, Instagram, Send, ListChecks } from "lucide-react";

interface FooterLinkSection {
    title: string;
    links: { text: string, href: string }[];
}

export default function Footer() {
    const linkSections: FooterLinkSection[] = [
        {
            title: "Product",
            links: [
                { text: "Features", href: "#features" },
                { text: "Pricing", href: "#pricing" },
                { text: "Integrations", href: "#howitworks" },
                { text: "Updates", href: "#testimonials" }
            ]
        },
        {
            title: "Company",
            links: [
                { text: "About", href: "#hero" },
                { text: "Careers", href: "#" },
                { text: "Blog", href: "#" },
                { text: "Press", href: "#" }
            ]
        },
        {
            title: "Support",
            links: [
                { text: "Help Center", href: "#cta" },
                { text: "Community", href: "#" },
                { text: "Tutorials", href: "#" },
                { text: "Contact Us", href: "#footer" }
            ]
        }
    ];

    const socialLinks = [
        { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/" },
        { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com/" },
        { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com/" },
        { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/" },
    ];

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.href} className="text-gray-400 hover:text-white">
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4 mb-4">
                            {socialLinks.map((link, index) => (
                                <a key={index} href={link.href} className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                        <p className="text-gray-400">Subscribe to our newsletter</p>
                        <div className="mt-2 flex">
                            <Input
                                type="email"
                                placeholder="Your email"
                                className="px-4 py-2 rounded-l-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border-0"
                            />
                            <Button className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition duration-300">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <ListChecks className="text-indigo-600 w-7 h-7 mr-2" />
                        <span className="text-xl font-bold text-white">Task Flow</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                        <p>&copy; 2023 Task Flow. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}