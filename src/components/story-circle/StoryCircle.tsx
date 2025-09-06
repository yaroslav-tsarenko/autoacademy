import React from "react";
import Image from "next/image";
import styles from "./StoryCircle.module.scss";

interface StoryCircleProps {
    src?: string;
    alt?: string;
    variant?: "big" | "small";
    thumbnail?: string;
    onClick?: () => void;
}

const useResponsiveSize = (variant: "big" | "small") => {
    const [size, setSize] = React.useState(variant === "big" ? 350 : 170);
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1028) {
                setSize(variant === "big" ? 170 : 100);
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
                                                     onClick,
                                                 }) => {
    const size = useResponsiveSize(variant);

    return (
        <div
            className={styles.storyCircle}
            style={{ width: size, height: size }}
            onClick={onClick}
        >
            <Image
                src={src || thumbnail}
                alt={alt}
                width={size - 5}
                height={size - 11}
                className={styles.storyImage}
            />
        </div>
    );
};

export default StoryCircle;