import React from 'react';
import styles from "./Header.module.scss";
import Image from "next/image";
import {media} from "@/resources/media";
import ButtonUI from "@/ui/button/ButtonUI";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Image src={media.logo} alt="logo" width={200} height={50}/>
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
        </header>
    );
};

export default Header;