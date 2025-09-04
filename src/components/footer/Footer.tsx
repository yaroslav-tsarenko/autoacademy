"use client";

import React from "react";
import styles from "./Footer.module.scss";
import Image from "next/image";
import { media } from "@/resources/media";

const Footer = () => {
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
                        <li><a href="#">Про нас</a></li>
                        <li><a href="#">Курси</a></li>
                        <li><a href="#">Контакти</a></li>
                        <li><a href="#">Ціни</a></li>
                        <li><a href="#">Ше шось</a></li>
                        <li><a href="#">Ше шось</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>
                <div className={styles.footerLinks}>
                    <h4>Юридичні документи</h4>
                    <ul>
                        <li><a href="#">Політика конфіденційності</a></li>
                        <li><a href="#">Політика cookie</a></li>
                        <li><a href="#">Умови користування</a></li>
                        <li><a href="#">Користувацька угода</a></li>
                    </ul>
                </div>
                <div className={styles.footerContacts}>
                    <h4>Контакти</h4>
                    <ul>
                        <li><a href="tel:+380971234567">+38 (097) 123 45 67</a></li>
                        <li><a href="mailto:info@avtoakademia.ua">info@avtoakademia.ua</a></li>
                    </ul>
                </div>

                {/* Addresses */}
                <div className={styles.footerAddress}>
                    <h4>Адреса</h4>
                    <ul>
                        <li>вул. Подільська, 93/1, м. Хмельницький, Хмельницька область, 29001</li>
                    </ul>
                </div>
            </div>

            {/* Bottom */}
            <div className={styles.footerBottom}>
                <p>© {new Date().getFullYear()} Автоакадемія. Всі права захищено.</p>
            </div>
        </footer>
    );
};

export default Footer;
