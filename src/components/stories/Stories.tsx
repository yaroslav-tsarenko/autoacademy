import React, { useRef, useState } from "react";
import styles from "./Stories.module.scss";
import StoryCircle from "@/components/story-circle/StoryCircle";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useContent } from "@/context/ContentContext";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

const STORY_DURATION = 5000;

const Stories: React.FC = () => {
    const { actuals } = useContent();
    const trackRef = useRef<HTMLDivElement | null>(null);

    // Dialog state
    const [open, setOpen] = useState(false);
    const [selectedActualIdx, setSelectedActualIdx] = useState<number | null>(null);
    const [currentContentIdx, setCurrentContentIdx] = useState(0);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Open dialog for actual
    const handleOpenActual = (idx: number) => {
        setSelectedActualIdx(idx);
        setCurrentContentIdx(0);
        setProgress(0);
        setOpen(true);
    };

    // Progress bar and auto-advance
    React.useEffect(() => {
        if (!open || selectedActualIdx === null) return;
        setProgress(0);

        const actual = actuals[selectedActualIdx];
        const contentUrl = actual?.content[currentContentIdx];
        if (!contentUrl) return;

        const isVideo = contentUrl.match(/\.(mp4|webm|mov)$/i);
        const duration = isVideo ? 8000 : STORY_DURATION;

        timerRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timerRef.current!);
                    if (currentContentIdx < actual.content.length - 1) setCurrentContentIdx(currentContentIdx + 1);
                    else setOpen(false);
                    return 0;
                }
                return prev + 2;
            });
        }, duration / 50);

        return () => clearInterval(timerRef.current!);
    }, [open, currentContentIdx, selectedActualIdx, actuals]);

    // Keyboard navigation
    React.useEffect(() => {
        if (!open || selectedActualIdx === null) return;
        const handleKey = (e: KeyboardEvent) => {
            const actual = actuals[selectedActualIdx];
            if (e.key === "ArrowRight" && currentContentIdx < actual.content.length - 1) setCurrentContentIdx(currentContentIdx + 1);
            if (e.key === "ArrowLeft" && currentContentIdx > 0) setCurrentContentIdx(currentContentIdx - 1);
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, currentContentIdx, selectedActualIdx, actuals]);

    // Click navigation
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (selectedActualIdx === null) return;
        const actual = actuals[selectedActualIdx];
        const x = e.nativeEvent.offsetX;
        const width = (e.target as HTMLDivElement).clientWidth;
        if (x < width / 2 && currentContentIdx > 0) setCurrentContentIdx(currentContentIdx - 1);
        else if (x > width / 2 && currentContentIdx < actual.content.length - 1) setCurrentContentIdx(currentContentIdx + 1);
    };

    const scrollByViewport = (dir: "prev" | "next") => {
        const el = trackRef.current;
        if (!el) return;
        const delta = el.clientWidth * 0.9;
        el.scrollBy({ left: dir === "next" ? delta : -delta, behavior: "smooth" });
    };

    return (
        <section className={styles.wrapper}>
            <button
                aria-label="Previous stories"
                className={`${styles.navBtn} ${styles.prev}`}
                onClick={() => scrollByViewport("prev")}
            >
                <MdKeyboardArrowLeft />
            </button>
            <div className={styles.slider}>
                <div className={styles.track} ref={trackRef}>
                    {actuals.map((actual, idx) => (
                        <div
                            className={styles.item}
                            key={actual._id}
                            onClick={() => handleOpenActual(idx)}
                            style={{ cursor: "pointer" }}
                        >
                            <StoryCircle
                                src={actual.thumbnail}
                                thumbnail={actual.thumbnail}
                                variant="small"
                                alt={actual.title}
                            />
                            <span className={styles.caption}>{actual.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <button
                aria-label="Next stories"
                className={`${styles.navBtn} ${styles.next}`}
                onClick={() => scrollByViewport("next")}
            >
                <MdKeyboardArrowRight />
            </button>
            {/* Dialog for actual content */}
            {open && selectedActualIdx !== null && (
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    fullScreen
                    PaperProps={{ style: { background: "#000" } }}
                >
                    <div className={styles.storyDialog}>
                        <div className={styles.progressBarContainer}>
                            {actuals[selectedActualIdx].content.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={styles.progressBar}
                                    style={{
                                        width: `${100 / actuals[selectedActualIdx].content.length}%`,
                                        background: idx < currentContentIdx ? "#fff" : "#888",
                                        opacity: idx === currentContentIdx ? 1 : 0.5,
                                    }}
                                >
                                    {idx === currentContentIdx && (
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${progress}%`, background: "#fff" }}
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
                                {(() => {
                                    const url = actuals[selectedActualIdx].content[currentContentIdx];
                                    const isVideo = url.match(/\.(mp4|webm|mov)$/i);
                                    return isVideo ? (
                                        <video
                                            src={url}
                                            controls
                                            autoPlay
                                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 0 }}
                                        />
                                    ) : (
                                        <Image
                                            src={url}
                                            alt="actual-content"
                                            width={450}
                                            height={800}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
        </section>
    );
};

export default Stories;