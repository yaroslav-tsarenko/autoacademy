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
    { label: "Політика користування", link: "/terms-and-conditions" },
    { label: "Користувацька угода", link: "/user-agreement" },
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
                            <li key={link.label}>
                                {link.link ? (
                                    <a href={link.link}>
                                        {link.label}
                                    </a>
                                ) : (
                                    <a
                                        href={`#${link.id}`}
                                        onClick={e => handleScroll(e, link.id!)}
                                    >
                                        {link.label}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.footerContacts}>
                    <h4>Контакти</h4>
                    <ul>
                        <li><a href="tel:+380971234567">{process.env.NEXT_PUBLIC_PHONE}</a></li>
                        <li><a href="mailto:info@avtoakademia.ua">avtoacademy@gmail.com</a></li>
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