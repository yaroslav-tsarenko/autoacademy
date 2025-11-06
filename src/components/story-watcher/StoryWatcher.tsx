"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import styles from "./StoryWatcher.module.scss";

export interface StoryWatcherProps {
    open: boolean;
    onClose: () => void;
    stories?: { url: string; type?: "image" | "video" }[];
    startIndex?: number;
    storyDuration?: number;
}

const StoryWatcher: React.FC<StoryWatcherProps> = ({
                                                       open,
                                                       onClose,
                                                       stories = [],
                                                       startIndex = 0,
                                                       storyDuration = 5000,
                                                   }) => {
    const orderedStories = Array.isArray(stories) ? [...stories].reverse() : [];
    const [current, setCurrent] = useState(startIndex);
    const [paused, setPaused] = useState(false);
    const [animKey, setAnimKey] = useState(0); // restart CSS animation

    // 🧹 Reset when opened
    useEffect(() => {
        if (open) {
            setCurrent(startIndex);
            setPaused(false);
            setAnimKey((k) => k + 1);
        }
    }, [open, startIndex]);

    // ⏭️ Move to next story
    const goNext = useCallback(() => {
        if (current < orderedStories.length - 1) {
            setCurrent((c) => c + 1);
            setAnimKey((k) => k + 1);
        } else {
            onClose();
        }
    }, [current, orderedStories.length, onClose]);

    // ⏮️ Move to prev story
    const goPrev = () => {
        if (current > 0) {
            setCurrent((c) => c - 1);
            setAnimKey((k) => k + 1);
        }
    };

    // ✋ Hold to pause
    const handleHoldStart = () => setPaused(true);
    const handleHoldEnd = () => setPaused(false);

    // 🖱️ Click navigation
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) goPrev();
        else goNext();
    };

    if (!open || orderedStories.length === 0) return null;
    const story = orderedStories[current];
    if (!story) return null;

    return (
        <Dialog open={open} onClose={onClose} fullScreen PaperProps={{ style: { background: "#000" } }}>
            <div className={styles.storyDialog} onContextMenu={(e) => e.preventDefault()}>
                {/* 🟩 Progress Bar */}
                <div className={styles.progressBarContainer}>
                    {orderedStories.map((_, i) => (
                        <div key={i} className={styles.progressBar}>
                            {i < current && <div className={`${styles.progressFill} ${styles.completed}`} />}
                            {i === current && (
                                <div
                                    key={animKey}
                                    className={`${styles.progressFill} ${paused ? styles.paused : ""}`}
                                    style={{ animationDuration: `${storyDuration}ms` }}
                                    onAnimationEnd={goNext} // ✅ коли анімація завершується → наступна сторіс
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* ❌ Close button */}
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 16, right: 16, color: "#fff" }}
                >
                    <CloseIcon />
                </IconButton>

                {/* 📸 Story Content */}
                <div
                    className={styles.storyContent}
                    onClick={handleClick}
                    onMouseDown={handleHoldStart}
                    onMouseUp={handleHoldEnd}
                    onTouchStart={handleHoldStart}
                    onTouchEnd={handleHoldEnd}
                >
                    <div className={styles.storyMediaWrapper}>
                        {story.url.match(/\.(mp4|webm|mov)$/i) ? (
                            <video
                                key={story.url}
                                src={story.url}
                                autoPlay
                                playsInline
                                muted
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <Image
                                key={story.url}
                                src={story.url}
                                alt="story"
                                width={450}
                                height={800}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default StoryWatcher;
