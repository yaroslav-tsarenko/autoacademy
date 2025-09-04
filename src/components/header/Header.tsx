"use client"

import React, { useState, useEffect } from 'react';
import styles from "./Header.module.scss";
import Image from "next/image";
import { media } from "@/resources/media";
import Link from "next/link";
import ButtonUI from "@/ui/button/ButtonUI";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import { FiMenu } from "react-icons/fi";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
                <div className={styles.inner}>
                    <Link href={"/"} className={styles.logoLink}>
                        <Image src={media.logo} alt="logo" width={200} height={50} />
                    </Link>
                    <nav className={styles.navList}>
                        <a>Про нас</a>
                        <a>Послуги</a>
                        <a>Переваги</a>
                        <a>Відгуки</a>
                        <a>Інструктори</a>
                        <a>Поширені запитання</a>
                    </nav>
                    <div className={styles.buttons}>
                        <ButtonUI color="primary">Подзвонити</ButtonUI>
                        <ButtonUI color="secondary">Записатись</ButtonUI>
                    </div>
                </div>
                <div className={styles.innerMobile}>
                    <Link href={"/"} className={styles.logoLink}>
                        <Image src={media.logo} alt="logo" width={150} height={40} />
                    </Link>
                    <IconButton
                        color="default"
                        onClick={() => setOpen(true)}
                        size="large"
                    >
                        <FiMenu size={32} />
                    </IconButton>
                </div>
            </header>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <div className={styles.dialogContent}>
                    <Link href={"/"} className={styles.logoLink}>
                        <Image src={media.logo} alt="logo" width={150} height={40} />
                    </Link>
                    <nav className={styles.navListMobile}>
                        <a onClick={() => setOpen(false)}>Про нас</a>
                        <a onClick={() => setOpen(false)}>Послуги</a>
                        <a onClick={() => setOpen(false)}>Переваги</a>
                        <a onClick={() => setOpen(false)}>Відгуки</a>
                        <a onClick={() => setOpen(false)}>Інструктори</a>
                        <a onClick={() => setOpen(false)}>Поширені запитання</a>
                    </nav>
                    <div className={styles.buttonsMobile}>
                        <ButtonUI color="primary">Подзвонити</ButtonUI>
                        <ButtonUI color="secondary">Записатись</ButtonUI>
                    </div>
                </div>
            </Drawer>
        </>

    );
};

export default Header;