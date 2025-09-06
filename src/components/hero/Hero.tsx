import StoryCircle from "@/components/story-circle/StoryCircle";
import { media } from "@/resources/media";
import styles from "./Hero.module.scss";
import ButtonUI from "@/ui/button/ButtonUI";
import React, { useEffect, useRef, useState } from "react";
import { useContent } from "@/context/ContentContext";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

const STORY_DURATION = 5000;

export default function Hero() {
    const { stories } = useContent();
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Open dialog
    const handleOpen = () => {
        if (stories.length > 0) {
            setOpen(true);
            setCurrent(0);
            setProgress(0);
        }
    };

    // Progress bar and auto-advance
    useEffect(() => {
        if (!open) return;
        setProgress(0);

        const story = stories[current];
        if (!story) return;

        let duration = STORY_DURATION;
        if (story.type === "video") duration = 8000;

        timerRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timerRef.current!);
                    if (current < stories.length - 1) setCurrent(current + 1);
                    else setOpen(false); // Close dialog after last story
                    return 0;
                }
                return prev + 2;
            });
        }, duration / 50);

        return () => clearInterval(timerRef.current!);
    }, [open, current, stories]);

    // Keyboard navigation
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" && current < stories.length - 1) setCurrent(current + 1);
            if (e.key === "ArrowLeft" && current > 0) setCurrent(current - 1);
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, current, stories.length]);

    // Click navigation
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const x = e.nativeEvent.offsetX;
        const width = (e.target as HTMLDivElement).clientWidth;
        if (x < width / 2 && current > 0) setCurrent(current - 1);
        else if (x > width / 2 && current < stories.length - 1) setCurrent(current + 1);
    };

    return (
        <div className={styles.wrapper}>
            <StoryCircle
                thumbnail={media.thumbnail_main.src}
                variant="big"
                onClick={handleOpen}
            />
            <div className={styles.description}>
                <div className={styles.descriptionHeader}>
                    <h1>avtoacademykhm</h1>
                    <div className={styles.buttons}>
                        <ButtonUI color="tertiary">Facebook</ButtonUI>
                        <ButtonUI color="secondary">Instagram</ButtonUI>
                        <ButtonUI color="primary">TikTok</ButtonUI>
                    </div>
                </div>
                <div className={styles.metrics}>
                    <div className={styles.metricItem}>
                        <p>495</p>
                        Публікацій
                    </div>
                    <div className={styles.metricItem}>
                        <p>4,091</p>
                        Підписники
                    </div>
                    <div className={styles.metricItem}>
                        <p>500+</p>
                        Учнів
                    </div>
                </div>
                <div className={styles.card}>
                    <h1>Автошкола &quot;Автоакадемія&quot; 🚖 Хмельницький</h1>
                    <p>Навчаємо від А до Я!</p>
                    <p>🏁 Початок навчання 19 вересня</p>
                    <p>🚘 В наявності Toyota Corolla як на екзамені</p>
                    <p>🚘 МКПП / АКПП</p>
                    <p>⚙️ Відновлення навичок водіння</p>
                    <p className={styles.address}>
                        📍 вул. Подільська, 93/1, м. Хмельницький
                    </p>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullScreen
                PaperProps={{ style: { background: "#000" } }}
            >
                <div className={styles.storyDialog}>
                    {/* Instagram-like progress bar */}
                    <div className={styles.progressBarContainer}>
                        {stories.map((_, idx) => (
                            <div
                                key={idx}
                                className={styles.progressBar}
                                style={{
                                    width: `${100 / stories.length}%`,
                                    background: idx < current ? "#fff" : "#888",
                                    opacity: idx === current ? 1 : 0.5,
                                    height: "4px",
                                    margin: "0 2px",
                                    borderRadius: "2px",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {idx === current && (
                                    <div
                                        className={styles.progressFill}
                                        style={{
                                            width: `${progress}%`,
                                            background: "#fff",
                                            height: "100%",
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            borderRadius: "2px",
                                            transition: "width 0.1s linear",
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <IconButton
                        onClick={() => setOpen(false)}
                        className={styles.closeBtn}
                        sx={{ position: "absolute", top: 16, right: 16, color: "#fff", zIndex: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <div
                        className={styles.storyContent}
                        onClick={handleClick}
                        style={{
                            width: "100vw",
                            height: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <div
                            className={styles.storyMediaWrapper}
                            style={{
                                width: "450px",
                                height: "800px",
                                aspectRatio: "9 / 16",
                                maxWidth: "90vw",
                                maxHeight: "90vh",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#111",
                                borderRadius: "16px",
                                overflow: "hidden",
                            }}
                        >
                            {stories[current] ? (
                                stories[current].type === "image" ? (
                                    <Image
                                        src={stories[current].url}
                                        alt="story"
                                        width={450}
                                        height={800}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <video
                                        src={stories[current].url}
                                        controls
                                        autoPlay
                                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0 }}
                                    />
                                )
                            ) : (
                                <div style={{ color: "#fff", textAlign: "center" }}>No media available</div>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}