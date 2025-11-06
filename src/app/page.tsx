"use client"

import React, { useEffect, useRef, useState } from 'react';
import Preloader from "@/components/preloader/Preloader";
import Home from "@/pages/home/Home";
import { useContent } from "@/context/ContentContext";

const MIN_PRELOADER_MS = 2000;

const Page: React.FC = () => {
    const { contentLoaded } = useContent();
    const [showPreloader, setShowPreloader] = useState(true);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (contentLoaded) {
            // keep preloader visible at least MIN_PRELOADER_MS after content loaded
            timerRef.current = window.setTimeout(() => {
                setShowPreloader(false);
                timerRef.current = null;
            }, MIN_PRELOADER_MS);
        } else {
            // if content is not loaded (e.g. refresh started), show preloader immediately
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setShowPreloader(true);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [contentLoaded]);

    return (
        <>
            <Home />
            {showPreloader && <Preloader />}
        </>
    );
};

export default Page;
