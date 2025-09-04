import React from 'react';
import { FaCar, FaUserShield, FaClock, FaBookOpen, FaStar, FaMoneyCheckAlt } from 'react-icons/fa';
import styles from './Benefits.module.scss';

const benefitsData = [
    {
        icon: <FaCar />,
        title: 'Сучасний автопарк',
        desc: 'Навчання на нових та безпечних автомобілях різних типів.',
    },
    {
        icon: <FaUserShield />,
        title: 'Досвідчені інструктори',
        desc: 'Професійна команда з багаторічним досвідом навчання.',
    },
    {
        icon: <FaClock />,
        title: 'Гнучкий графік',
        desc: 'Можливість обрати зручний час занять, включаючи вечірні та вихідні.',
    },
    {
        icon: <FaBookOpen />,
        title: 'Сучасна теорія',
        desc: 'Актуальні навчальні матеріали та інтерактивні заняття.',
    },
    {
        icon: <FaStar />,
        title: 'Високий відсоток здачі',
        desc: 'Більшість наших учнів успішно складають іспит з першого разу.',
    },
    {
        icon: <FaMoneyCheckAlt />,
        title: 'Доступна вартість',
        desc: 'Прозорі ціни та вигідні умови оплати.',
    },
];

const Benefits = () => (
    <div className={styles.container}>
        <h2 className={styles.title}>Переваги Автоакадемії</h2>
        <div className={styles.cards}>
            {benefitsData.map((item, idx) => (
                <div key={idx} className={styles.card}>
                    <div className={styles.icon}>{item.icon}</div>
                    <div className={styles.cardTitle}>{item.title}</div>
                    <div className={styles.desc}>{item.desc}</div>
                </div>
            ))}
        </div>
    </div>
);

export default Benefits;