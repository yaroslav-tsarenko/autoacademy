"use client"

import React, { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = "/";
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#1e293b",
                fontFamily: "Montserrat, Arial, sans-serif",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "48px 32px",
                    borderRadius: "24px",
                    boxShadow: "0 8px 32px rgba(30,41,59,0.12)",
                    textAlign: "center",
                    maxWidth: "400px",
                }}
            >
                <h1 style={{ fontSize: "3rem", marginBottom: "16px", color: "#6366f1" }}>404</h1>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Сторінку не знайдено</h2>
                <p style={{ fontSize: "1rem", marginBottom: "24px" }}>
                    Вибачте, такої сторінки не існує.<br />
                    Ви будете перенаправлені на головну через 5 секунд.
                </p>
                <Link href="/">Go Home</Link>
            </div>
        </div>
    );
}