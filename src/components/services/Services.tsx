import React from 'react';
import styles from './Services.module.scss';
import ButtonUI from "@/ui/button/ButtonUI";

const baseFeatures = [
    'Теоретичний курс',
    'Практичні заняття',
    'Навчальні матеріали',
    'Підготовка до іспиту',
];

const standardFeatures = [
    'Теоретичний курс (40 годин)',
    '15 практичних занять',
    'Автомобіль на іспит',
    'Навчальні матеріали',
];

const premiumFeatures = [
    'Теоретичний курс (50 годин)',
    '20 практичних занять',
    'Індивідуальний інструктор',
    'Підтримка 24/7',
];

const tariffs = [
    {
        title: 'Базовий',
        price: '7 500₴',
        features: [
            'Теоретичний курс (30 годин)',
            '10 практичних занять',
            baseFeatures[2],
            baseFeatures[3],
        ],
        button: 'Записатися',
    },
    {
        title: 'Стандарт',
        price: '9 500₴',
        features: standardFeatures,
        button: 'Записатися',
        popular: true,
    },
    {
        title: 'Преміум',
        price: '12 000₴',
        features: premiumFeatures,
        button: 'Записатися',
    },
];

const Services = () => (
    <div className={styles.container} id="services">
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
                    <ButtonUI color="secondary">{tariff.button}</ButtonUI>
                </div>
            ))}
        </div>
    </div>
);

export default Services;