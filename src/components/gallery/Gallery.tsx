"use client";

import React, { useState } from "react";
import styles from "./Gallery.module.scss";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Image from "next/image";
import { media } from "@/resources/media";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useContent } from "@/context/ContentContext";

const photos = [
    { id: "p1", src: media.photo_1 },
    { id: "p2", src: media.photo_1 },
    { id: "p3", src: media.photo_1 },
    { id: "p4", src: media.photo_1 },
    { id: "p5", src: media.photo_1 },
    { id: "p6", src: media.photo_1 },
];

export default function Gallery() {
    const [tab, setTab] = useState(0);
    const { posts } = useContent();
    const [open, setOpen] = useState(false);
    const [selectedPostIdx, setSelectedPostIdx] = useState<number | null>(null);

    const handleOpenPost = (idx: number) => {
        setSelectedPostIdx(idx);
        setOpen(true);
    };

    const imagePosts = posts.filter(post => post.mediaType === "image");
    const videoPosts = posts.filter(post => post.mediaType === "video");

    const displayedPosts = tab === 0 ? imagePosts : videoPosts;

    return (
        <section className={styles.wrapper}>
            <Box sx={{ borderBottom: 0, borderColor: "#1a1a1a", mb: 3 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    aria-label="gallery tabs"
                    textColor="inherit"
                    indicatorColor="primary"
                    sx={{
                        color: "#1a1a1a",
                        "& .MuiTabs-indicator": {
                            backgroundColor: "#1a1a1a",
                        },
                        "& .MuiTab-root": {
                            color: "#1a1a1a",
                        },
                    }}
                >
                    <Tab label="Фото" />
                    <Tab label="Reels" />
                </Tabs>
            </Box>

            <div className={styles.photosGrid}>
                {displayedPosts.map((post, idx) => (
                    <div
                        key={post._id}
                        className={styles.photoItem}
                        onClick={() => handleOpenPost(idx)}
                        style={{ cursor: "pointer" }}
                    >
                        {post.mediaType === "image" ? (
                            <Image src={post.mediaUrl} alt="post" fill className={styles.photo} />
                        ) : (
                            <video
                                src={post.mediaUrl}
                                className={styles.photo}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                controls
                            />
                        )}
                    </div>
                ))}
            </div>

            {open && selectedPostIdx !== null && (
                <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ style: { background: "transparent", boxShadow: "none" } }}>
                    <div className={styles.postDialog}>
                        <div className={styles.instagramCard}>
                            <div className={styles.cardHeader}>
                                <Image
                                    src={media.logo}
                                    alt="avatar"
                                    width={48}
                                    height={48}
                                    className={styles.avatar}
                                />
                                <div className={styles.headerInfo}>
                                    <span className={styles.username}>avtoacademykhm</span>
                                    <span className={styles.date}>
                                        {new Date(displayedPosts[selectedPostIdx].createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.cardMedia}>
                                {displayedPosts[selectedPostIdx].mediaType === "image" ? (
                                    <Image
                                        src={displayedPosts[selectedPostIdx].mediaUrl}
                                        alt="post"
                                        width={450}
                                        height={800}
                                        className={styles.media}
                                    />
                                ) : (
                                    <video
                                        src={displayedPosts[selectedPostIdx].mediaUrl}
                                        controls
                                        autoPlay
                                        className={styles.media}
                                    />
                                )}
                            </div>
                            <div
                                className={styles.cardText}
                                dangerouslySetInnerHTML={{ __html: displayedPosts[selectedPostIdx].text }}
                            />
                        </div>
                    </div>
                </Dialog>
            )}
        </section>
    );
}