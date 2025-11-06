// File: `src/components/stories/Stories.tsx`
"use client";

import React, { useRef, useState } from "react";
import styles from "./Stories.module.scss";
import StoryCircle from "@/components/story-circle/StoryCircle";
import StoryWatcher from "@/components/story-watcher/StoryWatcher";
import { useContent } from "@/context/ContentContext";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function Stories() {
    const { actuals } = useContent();
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    // Scroll horizontally through story list
    const scrollByViewport = (dir: "prev" | "next") => {
        const el = trackRef.current;
        if (!el) return;
        const delta = el.clientWidth * 0.9;
        el.scrollBy({ left: dir === "next" ? delta : -delta, behavior: "smooth" });
    };

    // Handle open
    const handleOpen = (idx: number) => {
        setSelectedIdx(idx);
        setOpen(true);
    };

    // Build formatted stories for selected actual
    const formattedStories: { url: string; type?: "video" | "image" }[] =
        selectedIdx !== null && actuals[selectedIdx]
            ? actuals[selectedIdx].content.map((url) => ({
                url,
                type: url.match(/\.(mp4|webm|mov)$/i) ? ("video" as const) : ("image" as const),
            }))
            : [];

    return (
        <section className={styles.wrapper}>
            {/* Left navigation button */}
            <button
                aria-label="Previous stories"
                className={`${styles.navBtn} ${styles.prev}`}
                onClick={() => scrollByViewport("prev")}
            >
                <MdKeyboardArrowLeft />
            </button>

            {/* Horizontal scrollable story list */}
            <div className={styles.slider}>
                <div className={styles.track} ref={trackRef}>
                    {actuals.map((actual, idx) => (
                        <div
                            key={actual._id}
                            className={styles.item}
                            onClick={() => handleOpen(idx)}
                            style={{ cursor: "pointer" }}
                        >
                            <StoryCircle thumbnail={actual.thumbnail} variant="small" alt={actual.title} />
                            <span className={styles.caption}>{actual.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right navigation button */}
            <button
                aria-label="Next stories"
                className={`${styles.navBtn} ${styles.next}`}
                onClick={() => scrollByViewport("next")}
            >
                <MdKeyboardArrowRight />
            </button>

            {/* Shared StoryWatcher for current actual */}
            {open && selectedIdx !== null && (
                <StoryWatcher open={open} onClose={() => setOpen(false)} stories={formattedStories} storyDuration={5000} />
            )}
        </section>
    );
}
