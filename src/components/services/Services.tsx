import React from 'react';
import styles from './Services.module.scss';

const tariffs = [
    {
        title: 'Базовий',
        price: '7 500₴',
        features: [
            'Теоретичний курс (30 годин)',
            '10 практичних занять',
            'Навчальні матеріали',
            'Підготовка до іспиту',
        ],
        button: 'Записатися',
    },
    {
        title: 'Стандарт',
        price: '9 500₴',
        features: [
            'Теоретичний курс (40 годин)',
            '15 практичних занять',
            'Навчальні матеріали',
            'Підготовка до іспиту',
            'Автомобіль на іспит',
        ],
        button: 'Записатися',
        popular: true,
    },
    {
        title: 'Преміум',
        price: '12 000₴',
        features: [
            'Теоретичний курс (50 годин)',
            '20 практичних занять',
            'Індивідуальний інструктор',
            'Навчальні матеріали',
            'Підготовка до іспиту',
            'Автомобіль на іспит',
            'Підтримка 24/7',
        ],
        button: 'Записатися',
    },
];

const Services = () => (
    <div className={styles.container}>
        <h2 className={styles.title}>Ціни та Послуги</h2>
        <div className={styles.cards}>
            {tariffs.map((tariff, idx) => (
                <div key={idx} className={`${styles.card} ${tariff.popular ? styles.popular : ''}`}>
                    {tariff.popular && <div className={styles.popularLabel}>Популярний</div>}
                    <div className={styles.cardTitle}>{tariff.title}</div>
                    <div className={styles.price}>{tariff.price}</div>
                    <ul className={styles.features}>
                        {tariff.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                    <button className={styles.button}>{tariff.button}</button>
                </div>
            ))}
        </div>
    </div>
);

export default Services;