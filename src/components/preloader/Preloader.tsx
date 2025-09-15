"use client";

import React, { useEffect, useState } from "react";
import styles from "./Preloader.module.scss";
import logo from "@/assets/logo/logo.svg"
import Image from "next/image";

const Preloader = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`${styles.preloader} ${!visible ? styles.fadeOut : ""}`}>
            <div className={styles.logoWrapper}>
                <Image
                    src={logo}
                    alt="Logo"
                    className={styles.shine}
                    width={140}
                    height={80}
                />
            </div>
        </div>
    );
};

export default Preloader;