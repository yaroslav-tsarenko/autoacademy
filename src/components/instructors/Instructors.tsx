"use client"

import React, { useEffect, useState } from 'react';
import styles from './Instructors.module.scss';
import Image from "next/image";
import { FaUserTie, FaCarSide, FaStar, FaChalkboardTeacher, FaSmileBeam } from "react-icons/fa";
import { useContent } from "@/context/ContentContext";

function getIconForCharacteristic(char: string) {
    if (char.includes("досвіду") || char.match(/\d+\+ років/)) return <FaUserTie />;
    if (char.toLowerCase().includes("дружн") || char.toLowerCase().includes("терпляч")) return <FaSmileBeam />;
    if (char.toLowerCase().includes("експерт") || char.toLowerCase().includes("водіння")) return <FaCarSide />;
    if (char.toLowerCase().includes("методик")) return <FaChalkboardTeacher />;
    if (char.toLowerCase().includes("відгуки") || char.toLowerCase().includes("високий відсоток")) return <FaStar />;
    return <FaUserTie />;
}

const Instructors = () => {
    const { instructors } = useContent();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    return (
        <div className={styles.container} id="instructors">
            <h2 className={styles.title}>Наші інструктори</h2>
            <div className={styles.cards}>
                {instructors.map((inst, idx) => (
                    <div
                        key={inst._id}
                        className={`${styles.block} ${idx % 2 === 1 ? styles.rowReverse : ''} ${visible ? styles.visible : ''}`}
                        style={{ transitionDelay: `${idx * 120}ms` }}
                    >
                        <div className={styles.info}>
                            <h3 className={styles.name}>{inst.fullName}</h3>
                            <p className={styles.desc}>{inst.description}</p>
                            <div className={styles.characteristics}>
                                {inst.characteristics.map((char, i) => (
                                    <div key={i} className={styles.characteristic}>
                                        <span className={styles.icon}>
                                            {getIconForCharacteristic(char)}
                                        </span>
                                        <span className={styles.label}>{char}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Image src={inst.photo} alt={inst.fullName} className={styles.photo} height={650} width={500} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Instructors;