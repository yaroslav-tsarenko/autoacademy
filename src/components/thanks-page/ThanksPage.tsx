"use client"

import React from "react";
import Confetti from "react-confetti";
import styles from "./ThanksPage.module.scss";
import ButtonUI from "@/ui/button/ButtonUI";
import Link from "next/link";

const ThanksPage = () => {
    const [dimensions, setDimensions] = React.useState({width: 0, height: 0});

    React.useEffect(() => {
        const updateDimensions = () => {
            setDimensions({width: window.innerWidth, height: window.innerHeight});
        };
        updateDimensions(); // Set initial dimensions
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    return (
        <div className={styles.thanksContainer}>
            <Confetti width={dimensions.width} height={dimensions.height} numberOfPieces={250}/>
            <div className={styles.thanksMessage}>
                <h1>Дякуємо!</h1>
                <p>Ваша заявка прийнята.<br/>Невдовзі наш менеджер зв&#39;яжеться з Вами.</p>
                <Link href={"/"}>
                    <ButtonUI color="secondary">
                        Повернутися на головну
                    </ButtonUI>
                </Link>
            </div>
        </div>
    );
};

export default ThanksPage;