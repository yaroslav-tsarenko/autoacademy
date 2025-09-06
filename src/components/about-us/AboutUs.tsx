"use client";

import React, { useEffect, useState } from 'react';
import styles from './AboutUs.module.scss';
import Image from "next/image";
import { useContent } from "@/context/ContentContext";

const AUTO_SWITCH_MS = 4000;

const AboutUs = () => {
    const { sliderImages } = useContent();
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (sliderImages.length === 0) return;
        const timer = setTimeout(() => {
            setActive((prev) => (prev + 1) % sliderImages.length);
        }, AUTO_SWITCH_MS);
        return () => clearTimeout(timer);
    }, [active, sliderImages.length]);

    return (
        <div className={styles.container} id="about">
            <h2 className={styles.title}>Про Нас</h2>
            <p className={styles.description}>
                Автоакадемія — це сучасна автошкола, яка поєднує досвідчених інструкторів, новітні методики навчання та індивідуальний підхід до кожного учня. Ми допомагаємо стати впевненим водієм, забезпечуємо високий рівень підготовки та підтримку на всіх етапах навчання.
            </p>
            <div className={styles.slider}>
                {sliderImages.map((img, idx) => (
                    <div
                        key={idx}
                        className={`${styles.slide} ${active === idx ? styles.active : ''}`}>
                        <Image
                            src={img}
                            alt={`slide-${idx + 1}`}
                            className={styles.slideImage}
                            width={600}
                            height={400}
                            priority={active === idx}
                        />
                    </div>
                ))}
                <div className={styles.pagination}>
                    {sliderImages.map((_, idx) => (
                        <button
                            key={idx}
                            className={`${styles.dot} ${active === idx ? styles.activeDot : ''}`}
                            onClick={() => setActive(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;