"use client"

import React, { useEffect, useState } from 'react';
import styles from './Instructors.module.scss';
import { media } from "@/resources/media";
import Image from "next/image";
import { FaUserTie, FaCarSide, FaStar, FaChalkboardTeacher, FaSmileBeam } from "react-icons/fa";

const instructors = [
    {
        name: 'Олександр Іванов',
        photo: media.photo_3,
        description: 'Досвідчений інструктор з 10-річним стажем. Спеціалізується на навчанні початківців. Має сертифікати з безпечного водіння та індивідуального підходу до кожного учня. Завжди підтримує та мотивує.',
        characteristics: [
            { icon: <FaUserTie />, label: '10+ років досвіду' },
            { icon: <FaCarSide />, label: 'Експерт з безпечного водіння' },
            { icon: <FaSmileBeam />, label: 'Дружній та терплячий' },
        ],
    },
    {
        name: 'Марія Коваль',
        photo: media.photo_4,
        description: 'Професійний підхід, індивідуальні заняття для кожного учня. Володіє сучасними методиками навчання, допомагає подолати страхи за кермом. Відкрита до спілкування та завжди готова допомогти.',
        characteristics: [
            { icon: <FaChalkboardTeacher />, label: 'Сучасні методики' },
            { icon: <FaStar />, label: 'Відмінні відгуки учнів' },
            { icon: <FaSmileBeam />, label: 'Підтримка та мотивація' },
        ],
    },
    {
        name: 'Віктор Петренко',
        photo: media.photo_5,
        description: 'Великий досвід підготовки до іспитів та безпечного водіння. Допомагає учням впевнено складати іспити з першого разу. Вміє знаходити підхід до кожного.',
        characteristics: [
            { icon: <FaStar />, label: 'Високий відсоток здачі' },
            { icon: <FaCarSide />, label: 'Підготовка до іспитів' },
            { icon: <FaUserTie />, label: 'Індивідуальний підхід' },
        ],
    },
];

const Instructors = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Наші інструктори</h2>
            <div className={styles.cards}>
                {instructors.map((inst, idx) => (
                    <div
                        key={inst.name}
                        className={`${styles.block} ${idx % 2 === 1 ? styles.rowReverse : ''} ${visible ? styles.visible : ''}`}
                        style={{ transitionDelay: `${idx * 120}ms` }}
                    >
                        <div className={styles.info}>
                            <h3 className={styles.name}>{inst.name}</h3>
                            <p className={styles.desc}>{inst.description}</p>
                            <div className={styles.characteristics}>
                                {inst.characteristics.map((char, i) => (
                                    <div key={i} className={styles.characteristic}>
                                        <span className={styles.icon}>{char.icon}</span>
                                        <span className={styles.label}>{char.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Image src={inst.photo} alt={inst.name} className={styles.photo} height={650} width={500} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Instructors;