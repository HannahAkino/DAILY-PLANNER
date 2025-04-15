// components/TrustedBy.tsx
import Image from "next/image";

interface LogoType {
    src: string;
    alt: string;
}

export default function TrustedBy() {
    const logos: LogoType[] = [
        { src: "https://logo.clearbit.com/google.com", alt: "Google" },
        { src: "https://logo.clearbit.com/airbnb.com", alt: "Airbnb" },
        { src: "https://logo.clearbit.com/shopify.com", alt: "Shopify" },
        { src: "https://logo.clearbit.com/netflix.com", alt: "Netflix" },
        { src: "https://logo.clearbit.com/spotify.com", alt: "Spotify" },
    ];

    return (
        <section className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 mb-8">Trusted by teams at</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {logos.map((logo, index) => (
                        <Image
                            key={index}
                            src={logo.src}
                            alt={logo.alt}
                            className="h-8 opacity-60"
                            width={100}
                            height={32}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}