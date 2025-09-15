"use client"

import React, {useState, useEffect} from 'react';
import styles from "./Header.module.scss";
import Image from "next/image";
import {media} from "@/resources/media";
import Link from "next/link";
import ButtonUI from "@/ui/button/ButtonUI";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import {FiMenu} from "react-icons/fi";
import {newRequest} from "@/utils/newRequest";
import {useAlert} from "@/context/AlertContext";

import BookingDialog from "@/components/booking-dialog/BookingDialog";

const PHONE_NUMBER = "+380971234567";

const Header = () => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({name: "", phone: "", comment: ""});
    const {showAlert} = useAlert();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleFormChange = (field: string, value: string) => {
        setForm(prev => ({...prev, [field]: value}));
    };

    const handleNavigateToThanksPage = () => {
        window.location.href = "/thanks-page";
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({behavior: "smooth"});
        }
        setOpen(false); // For mobile drawer
    };

    const handleSubmit = async () => {
        try {
            await newRequest.post("/content/telegram/send", {
                name: form.name,
                phone: form.phone,
                comment: form.comment,
            });
            showAlert("Заявка успішно надіслана!", "Дякуємо!", "success");
            setDialogOpen(false);
            handleNavigateToThanksPage();
        } catch (err) {
            showAlert("Не вдалося надіслати заявку. Спробуйте ще раз.", "Помилка", "error");
        }
    };

    return (
        <>
            <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
                <div className={styles.inner}>
                    <Link href={"/"} className={styles.logoLink}>
                        <Image src={media.logo} alt="logo" width={200} height={50}/>
                    </Link>
                    <nav className={styles.navList}>
                        <a href="#about" onClick={e => handleNavClick(e, "about")}>Про нас</a>
                        <a href="#services" onClick={e => handleNavClick(e, "services")}>Послуги</a>
                        <a href="#advantages" onClick={e => handleNavClick(e, "advantages")}>Переваги</a>
                        <a href="#reviews" onClick={e => handleNavClick(e, "reviews")}>Відгуки</a>
                        <a href="#instructors" onClick={e => handleNavClick(e, "instructors")}>Інструктори</a>
                        <a href="#faq" onClick={e => handleNavClick(e, "faq")}>Поширені запитання</a>
                    </nav>
                    <div className={styles.buttons}>
                        <a href={`tel:${PHONE_NUMBER}`}>
                            <ButtonUI color="primary">Подзвонити</ButtonUI>
                        </a>
                        <ButtonUI color="secondary" onClick={() => setDialogOpen(true)}>
                            Записатись
                        </ButtonUI>
                    </div>
                </div>
                <div className={styles.innerMobile}>
                    <Link href={"/"} className={styles.logoLink}>
                        <Image src={media.logo} alt="logo" width={150} height={40}/>
                    </Link>
                    <IconButton
                        color="default"
                        onClick={() => setOpen(true)}
                        size="large"
                    >
                        <FiMenu size={32}/>
                    </IconButton>
                </div>
            </header>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <div className={styles.dialogContent}>
                    <Link href={"/"} className={styles.logoLink}>
                        <Image src={media.logo} alt="logo" width={150} height={40}/>
                    </Link>
                    <nav className={styles.navListMobile}>
                        <a href="#about" onClick={e => handleNavClick(e, "about")}>Про нас</a>
                        <a href="#services" onClick={e => handleNavClick(e, "services")}>Послуги</a>
                        <a href="#advantages" onClick={e => handleNavClick(e, "advantages")}>Переваги</a>
                        <a href="#reviews" onClick={e => handleNavClick(e, "reviews")}>Відгуки</a>
                        <a href="#instructors" onClick={e => handleNavClick(e, "instructors")}>Інструктори</a>
                        <a href="#faq" onClick={e => handleNavClick(e, "faq")}>Поширені запитання</a>
                    </nav>
                    <div className={styles.buttonsMobile}>
                        <a href={`tel:${PHONE_NUMBER}`}>
                            <ButtonUI color="primary">Подзвонити</ButtonUI>
                        </a>
                        <ButtonUI color="secondary" onClick={() => {
                            setDialogOpen(true);
                            setOpen(false);
                        }}>
                            Записатись
                        </ButtonUI>
                    </div>
                </div>
            </Drawer>
            <BookingDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                />
        </>
    );
};

export default Header;