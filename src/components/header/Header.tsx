"use client"

import React, {useState, useEffect} from 'react';
import styles from "./Header.module.scss";
import Image from "next/image";
import {media} from "@/resources/media";
import Link from "next/link";
import ButtonUI from "@/ui/button/ButtonUI";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {FiMenu} from "react-icons/fi";
import Input from "@mui/joy/Input";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {newRequest} from "@/utils/newRequest";
import {useAlert} from "@/context/AlertContext";
import {Textarea} from "@mui/joy";

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
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Записатись</DialogTitle>
                <DialogContent>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2, minWidth: 300}}>
                        <Input
                            placeholder="Повне ім'я"
                            value={form.name}
                            sx={{fontWeight: "500"}}
                            onChange={e => handleFormChange("name", e.target.value)}
                        />
                        <Input
                            placeholder="Номер телефону"
                            value={form.phone}
                            sx={{fontWeight: "500"}}
                            onChange={e => handleFormChange("phone", e.target.value)}
                        />
                        <Textarea
                            placeholder="Коментар"
                            value={form.comment}
                            sx={{ fontWeight: "500" }}
                            onChange={e => handleFormChange("comment", e.target.value)}
                            minRows={2}
                        />
                        <ButtonUI color="primary" onClick={handleSubmit}>
                            Відправити
                        </ButtonUI>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Header;