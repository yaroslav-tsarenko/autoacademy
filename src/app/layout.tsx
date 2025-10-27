import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import PageWrapper from "@/components/page-wrapper/PageWrapper";
import {AlertProvider} from "@/context/AlertContext";
import {ContentProvider} from "@/context/ContentContext";
import {GoogleOAuthProvider} from "@react-oauth/google";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Автоакадемія – автошкола в Україні | Навчання водінню легко",
    description:
        "Автоакадемія – сучасна автошкола в Україні. Курси водіння, підготовка до іспитів, досвідчені інструктори та доступні ціни. Навчання водінню легко та безпечно.",
    keywords: [
        "автошкола",
        "автоакадемія",
        "курси водіння",
        "навчання водінню",
        "водійські курси",
        "права категорія B",
        "екзамен з ПДР",
        "водійські права Україна",
        "навчальний автомобіль",
        "інструктор з водіння",
        "дорожні правила",
        "школа водіїв",
        "уроки водіння",
        "водійські курси Київ",
        "водійські курси Львів",
        "водійські курси Україна",
    ],
    authors: [{ name: "Автоакадемія" }],
    openGraph: {
        title: "Автоакадемія – сучасна автошкола в Україні",
        description:
            "Легке та якісне навчання водінню. Досвідчені інструктори, доступні курси, підготовка до іспитів. Автоакадемія – твій шлях до впевненого водіння.",
        url: "https://www.avtoacademy.com",
        siteName: "Автоакадемія",
        images: [
            {
                url: "/og/og.png",
                width: 1200,
                height: 630,
                alt: "Автоакадемія – автошкола в Україні",
            },
        ],
        locale: "uk_UA",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Автоакадемія – автошкола в Україні",
        description:
            "Сучасна автошкола в Україні. Курси водіння, підготовка до іспитів та досвідчені інструктори.",
        images: ["/og/og.png"],
        creator: "@avtoakademia",
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    metadataBase: new URL("https://www.avtoacademy.com"),
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "https://www.avtoacademy.com",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uk">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                rel="stylesheet"
            />

            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-RSDWH1SZBD"
                strategy="afterInteractive"
                async
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-RSDWH1SZBD');
                        `,
                }}
            />
        </head>
        <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}>
            <AlertProvider>
                <ContentProvider>
                    <Header />
                    <PageWrapper>{children}</PageWrapper>
                    <Footer />
                </ContentProvider>
            </AlertProvider>
        </GoogleOAuthProvider>
        </body>
        </html>
    );
}
