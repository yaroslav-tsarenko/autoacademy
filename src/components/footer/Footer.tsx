"use client";

import React from "react";
import styles from "./Footer.module.scss";
import Image from "next/image";
import { media } from "@/resources/media";

const navLinks = [
    { label: "Про нас", id: "about" },
    { label: "Послуги", id: "services" },
    { label: "Переваги", id: "benefits" },
    { label: "Відгуки", id: "reviews" },
    { label: "Інструктори", id: "instructors" },
    { label: "Поширені запитання", id: "faq" },
];

const Footer = () => {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer className={styles.footerWrapper}>
            <div className={styles.footerInner}>
                <div className={styles.footerBrand}>
                    <Image src={media.logo_white} alt="logo" width={180} height={50} />
                    <p>
                        Автоакадемія – сучасна автошкола в Україні. Ми навчаємо впевнено
                        керувати автомобілем та дбати про безпеку на дорозі.
                    </p>
                </div>
                <div className={styles.footerLinks}>
                    <h4>Навігація</h4>
                    <ul>
                        {navLinks.map(link => (
                            <li key={link.id}>
                                <a
                                    href={`#${link.id}`}
                                    onClick={e => handleScroll(e, link.id)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.footerContacts}>
                    <h4>Контакти</h4>
                    <ul>
                        <li><a href="tel:+380971234567">+38 (097) 123 45 67</a></li>
                        <li><a href="mailto:info@avtoakademia.ua">info@avtoakademia.ua</a></li>
                    </ul>
                </div>
                <div className={styles.footerAddress}>
                    <h4>Адреса</h4>
                    <ul>
                        <li>вул. Подільська, 93/1, м. Хмельницький, Хмельницька область, 29001</li>
                    </ul>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>© {new Date().getFullYear()} Автоакадемія. Всі права захищено.</p>
            </div>
        </footer>
    );
};

export default Footer;