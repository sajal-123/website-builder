import { PriceCards } from '@/lib//constants';
import Image from 'next/image';
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import clsx from 'clsx';

export default function Page() {
    return (
        <main className="min-h-screen w-full bg-white dark:bg-black text-black dark:text-white">
            {/* Hero Section */}
            <section className="min-h-screen pt-36 relative flex flex-col items-center justify-center px-4 text-center">
                {/* Grid Background */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

                {/* Text */}
                <p className="text-lg mb-4 text-muted-foreground">
                    Run your agency in one place
                </p>

                <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold bg-gradient-to-r from-blue-600 to-black dark:from-blue-400 dark:to-white bg-clip-text text-transparent">
                    Plura
                </h1>

                {/* Hero Image */}
                <div className="flex justify-center items-center relative md:mt-[-70px] mt-10 px-4">
                    <Image
                        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
                        alt="Agency Illustration"
                        width={1200}
                        height={500}
                        className="rounded-2xl border border-muted shadow-2xl max-w-full h-auto"
                    />
                    <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="flex justify-center items-center flex-col gap-4 md:mt-20 px-4 mb-20">
                <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 dark:text-gray-100">
                    Choose What Fits You Best
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 ">
                    OUR pricing plans are designed to fit your needs, whether you're a freelancer, a small agency, or a large organization.
                </p>
                <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                    Ready to commit? You can get started for free.
                </p>

                <div className="flex flex-wrap justify-center gap-6 mt-10">
                    {PriceCards.map((card) => (
                        <div
                            key={card.title}
                            className="relative w-[300px] group"
                        >
                            {/* Moving glowing dot */}
                              <div className="absolute inset-0 h-full w-full animate-rotate rounded-full bg-[conic-gradient(#3b82f6_20deg,transparent_120deg)] scale-[1.5] blur-sm opacity-60 transition-all group-hover:scale-[2]" />

                            <Card
                                className={clsx(
                                    "relative z-10 transition-transform hover:scale-105 rounded-xl shadow-md",
                                    "bg-white dark:bg-black text-black dark:text-white",
                                    "hover:ring-2 hover:ring-blue-500"
                                )}
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl">{card.title}</CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                        {card.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="mb-4">
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            ${card.price}
                                            <span className="text-sm text-muted-foreground"> / {card.duration}</span>
                                        </p>
                                    </div>

                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-6">
                                        {card.features.map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>

                                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                        Purchase
                                    </button>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
