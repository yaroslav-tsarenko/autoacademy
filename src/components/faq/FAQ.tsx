"use client"

import React, { useState } from 'react';
import styles from './FAQ.module.scss';
import { useContent } from "@/context/ContentContext";

const FAQ = () => {
    const { faqs = [] } = useContent();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.faqContainer} id="faq">
            <h2 className={styles.title}>FAQs</h2>
            <ul className={styles.faqList}>
                {(faqs || []).map((item, idx) => (
                    <li key={item._id ?? idx} className={styles.faqItem}>
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
