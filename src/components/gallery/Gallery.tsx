"use client";

import React, { useState } from "react";
import styles from "./Gallery.module.scss";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Image from "next/image";
import {media} from "@/resources/media";

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

            {tab === 0 && (
                <div className={styles.photosGrid}>
                    {photos.map((p) => (
                        <div key={p.id} className={styles.photoItem}>
                            <Image
                                src={p.src}
                                alt="gallery photo"
                                fill
                                className={styles.photo}
                            />
                        </div>
                    ))}
                </div>
            )}

            {tab === 1 && (
                <div className={styles.reelsGrid}>
                    {photos.slice(0, 6).map((p) => (
                        <div key={`reel-${p.id}`} className={styles.reelItem}>
                            <Image
                                src={p.src}
                                alt="reel placeholder"
                                fill
                                className={styles.photo}
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
