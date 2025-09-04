"use client";

import React, { useRef } from "react";
import styles from "./Stories.module.scss";
import StoryCircle from "@/components/story-circle/StoryCircle";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import { media } from "@/resources/media";

export type StoryItem = {
    id: string | number;
    title: string;
    src?: string;
    thumbnail?: string;
    variant?: "small" | "big";
};

interface StoriesProps {
    items?: StoryItem[];
    itemVariant?: "small" | "big";
    title?: string;
}

const items = [
    { id: 1, title: "Курси",       thumbnail: media.thumbnail_main.src, src: "" },
    { id: 2, title: "Авто",        thumbnail: media.thumbnail_main.src, src: "" },
    { id: 3, title: "Інструктори", thumbnail: media.thumbnail_main.src, src: "" },
    { id: 4, title: "Учні",        thumbnail: media.thumbnail_main.src, src: "" },
];

const Stories: React.FC<StoriesProps> = ({ itemVariant = "small", title }) => {
    const trackRef = useRef<HTMLDivElement | null>(null);

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
                    {items.map((it, idx) => (
                        <div className={styles.item} key={`${it.id}-${idx}`}>
                            <StoryCircle
                                src={it.src}
                                thumbnail={it.thumbnail}
                                variant={itemVariant}
                            />
                            <span className={styles.caption}>{it.title}</span>
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
        </section>
    );
};

export default Stories;
