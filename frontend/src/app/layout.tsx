// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/context/auth';
// import MainLayout from '@/components/ui/MainLayout';
import React from "react";
import {Toaster} from "@/components/ui/Toaster";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL('https://projextnexus.com'),
    title: {
        default: "ProjextNexus | Modern Project Management Platform",
        template: "%s | ProjextNexus"
    },
    description: "ProjextNexus is a modern project management and team collaboration platform designed for efficient workflow and seamless communication.",
    keywords: [
        "project management",
        "team collaboration",
        "task management",
        "workflow automation",
        "agile",
        "scrum",
        "kanban",
        "productivity"
    ],
    authors: [
        {
            name: "ProjextNexus Team",
            url: "https://projextnexus.com",
        }
    ],
    creator: "ProjextNexus",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://projextnexus.com",
        title: "ProjextNexus | Modern Project Management Platform",
        description: "Transform the way your team collaborates with ProjextNexus - the next generation project management platform.",
        siteName: "ProjextNexus",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "ProjextNexus Platform Preview"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "ProjextNexus | Modern Project Management Platform",
        description: "Transform the way your team collaborates with ProjextNexus - the next generation project management platform.",
        images: ["/twitter-image.png"],
        creator: "@projextnexus"
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/apple-touch-icon-precomposed.png',
        },
    },
    manifest: '/site.webmanifest',
    verification: {
        google: 'your-google-site-verification-code',
        yandex: 'your-yandex-verification-code',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            {children}
        </AuthProvider>
        <Toaster />
        </body>
        </html>
    );
}
