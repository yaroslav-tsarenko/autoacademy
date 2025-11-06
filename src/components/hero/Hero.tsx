"use client";

import React, { useState } from "react";
import StoryCircle from "@/components/story-circle/StoryCircle";
import StoryWatcher from "@/components/story-watcher/StoryWatcher";
import { media } from "@/resources/media";
import styles from "./Hero.module.scss";
import { useContent } from "@/context/ContentContext";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";

export default function Hero() {
    const { stories, mainSection } = useContent();
    const [open, setOpen] = useState(false);

    const instUrl = process.env.NEXT_PUBLIC_INSTAGRAM;
    const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK;
    const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK;

    // Convert stories to watcher format
    const formattedStories = stories.map((story) => ({
        url: story.url,
        type: story.type || (story.url.match(/\.(mp4|webm|mov)$/i) ? "video" : "image"),
    }));

    return (
        <div className={styles.wrapper}>
            {/* Profile circle with click to open stories */}
            <StoryCircle
                thumbnail={media.thumbnail_main.src}
                variant="big"
                onClick={() => formattedStories.length > 0 && setOpen(true)}
            />

            {/* Profile description section */}
            <div className={styles.description}>
                <div className={styles.descriptionHeader}>
                    <h1>avtoacademykhm</h1>

                    <div className={styles.buttons}>
                        <Link href={facebookUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                            <IconButton sx={{ color: "#1877F3" }}>
                                <FaFacebookF size={32} />
                            </IconButton>
                        </Link>

                        <Link href={instUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                            <IconButton>
                                <div className={styles.instagramGradient}>
                                    <FaInstagram size={32} />
                                </div>
                            </IconButton>
                        </Link>

                        <Link href={tiktokUrl ?? "#"} target="_blank" rel="noopener noreferrer">
                            <IconButton sx={{ color: "#000" }}>
                                <FaTiktok size={32} />
                            </IconButton>
                        </Link>
                    </div>
                </div>

                {/* Profile metrics */}
                <div className={styles.metrics}>
                    <div className={styles.metricItem}>
                        <p>{mainSection?.publications ?? 0}</p>
                        Публікацій
                    </div>
                    <div className={styles.metricItem}>
                        <p>{mainSection?.followers ?? 0}</p>
                        Підписники
                    </div>
                    <div className={styles.metricItem}>
                        <p>{mainSection?.students ?? "0"}</p>
                        Учнів
                    </div>
                </div>

                {/* Bio card */}
                <div className={styles.card}>
                    <h1>{mainSection?.title || 'Автошкола "Автоакадемія" 🚖 Хмельницький'}</h1>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {mainSection?.description || "Навчаємо від А до Я!"}
                    </p>
                </div>
            </div>

            {/* Shared StoryWatcher component */}
            <StoryWatcher
                open={open}
                onClose={() => setOpen(false)}
                stories={formattedStories}
                storyDuration={5000}
            />
        </div>
    );
}
