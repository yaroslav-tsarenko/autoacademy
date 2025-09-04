"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./StoryCircle.module.scss";

interface StoryCircleProps {
    src?: StaticImageData | string;
    alt?: string;
    variant?: "big" | "small";
    thumbnail?: string;
}

const useResponsiveSize = (variant: "big" | "small") => {
    const [size, setSize] = useState(variant === "big" ? 350 : 100);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1028) {
                setSize(variant === "big" ? 130 : 100);
            } else {
                setSize(variant === "big" ? 350 : 100);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [variant]);

    return size;
};

const StoryCircle: React.FC<StoryCircleProps> = ({
                                                     src,
                                                     alt = "story",
                                                     variant = "small",
                                                     thumbnail = "/placeholder.png",
                                                 }) => {
    const size = useResponsiveSize(variant);

    return (
        <div
            className={styles.storyCircle}
            style={{
                width: size,
                height: size,
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