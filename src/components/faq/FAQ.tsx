"use client"

import React, { useState } from 'react';
import styles from './FAQ.module.scss';

const faqData = [
    {
        question: 'Як записатися на курси водіння?',
        answer: 'Ви можете записатися онлайн через наш сайт або особисто в офісі автошколи.',
    },
    {
        question: 'Які документи потрібні для реєстрації?',
        answer: 'Для реєстрації необхідно мати паспорт, ідентифікаційний код та медичну довідку.',
    },
    {
        question: 'Скільки триває навчання?',
        answer: 'Стандартний курс триває 2 місяці та включає теоретичні й практичні заняття.',
    },
    {
        question: 'Чи є можливість навчатися у вихідні?',
        answer: 'Так, ми пропонуємо гнучкий графік, включаючи заняття у вихідні та вечірній час.',
    },
    {
        question: 'Чи надаєте ви автомобіль для складання іспиту?',
        answer: 'Так, автошкола надає автомобіль для навчання та складання офіційного іспиту.',
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.faqContainer}>
            <h2 className={styles.title}>FAQs</h2>
            <ul className={styles.faqList}>
                {faqData.map((item, idx) => (
                    <li key={idx} className={styles.faqItem}>
                        <button
                            className={styles.question}
                            onClick={() => toggleFAQ(idx)}
                            aria-expanded={openIndex === idx}>
                            {item.question}
                            <div className={styles.arrowWrapper}>
                                <span className={`${styles.arrow} ${openIndex === idx ? styles.open : ''}`}></span>
                            </div>
                        </button>
                        <div
                            className={`${styles.answerWrapper} ${openIndex === idx ? styles.open : ''}`}
                            style={{
                                maxHeight: openIndex === idx ? '200px' : '0',
                                opacity: openIndex === idx ? 1 : 0,
                            }}
                        >
                            <div className={styles.answer}>{item.answer}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FAQ;