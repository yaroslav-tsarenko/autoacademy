"use client";

import React from "react";
import Image, {StaticImageData} from "next/image";
import styles from "./StoryCircle.module.scss";

interface StoryCircleProps {
    src?: StaticImageData | string;
    alt?: string;
    variant?: "big" | "small";
    thumbnail?: string;
}

const StoryCircle: React.FC<StoryCircleProps> = ({
                                                     src,
                                                     alt = "story",
                                                     variant = "small",
                                                     thumbnail = "/placeholder.png",
                                                 }) => {
    const size = variant === "big" ? 350 : 100;

    return (
        <div
            className={styles.storyCircle}
            style={{
                width: size,
                height: size,
                backgroundImage: `url(${thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Image
                src={src || thumbnail}
                alt={alt}
                width={size - 6}
                height={size - 6}
                className={styles.storyImage}
            />
        </div>
    );
};

export default StoryCircle;
