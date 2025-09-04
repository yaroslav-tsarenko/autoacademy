"use client";

import React, { useEffect, useState } from 'react';
import styles from './AboutUs.module.scss';
import Image from "next/image";
import { media } from "@/resources/media";

const slides = [
    { title: 'Сучасна автошкола', image: media.photo_1 },
    { title: 'Досвідчені інструктори', image: media.photo_1 },
    { title: 'Високий відсоток здачі', image: media.photo_1 },
    { title: 'Гнучкий графік', image: media.photo_1 },
];

const AUTO_SWITCH_MS = 4000;

const AboutUs = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, AUTO_SWITCH_MS);
        return () => clearTimeout(timer);
    }, [active]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Про Нас</h2>
            <p className={styles.description}>
                Автоакадемія — це сучасна автошкола, яка поєднує досвідчених інструкторів, новітні методики навчання та індивідуальний підхід до кожного учня. Ми допомагаємо стати впевненим водієм, забезпечуємо високий рівень підготовки та підтримку на всіх етапах навчання.
            </p>
            <div className={styles.slider}>
                {slides.map((slide, idx) => (
                    <div
                        key={idx}
                        className={`${styles.slide} ${active === idx ? styles.active : ''}`}>
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            className={styles.slideImage}
                            width={600}
                            height={400}
                            priority={active === idx}
                        />
                    </div>
                ))}
                <div className={styles.pagination}>
                    {slides.map((_, idx) => (
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