// src/components/services/Services.tsx
import React, { useState, useEffect } from 'react';
import styles from './Services.module.scss';
import ButtonUI from "@/ui/button/ButtonUI";
import BookingDialog from "@/components/booking-dialog/BookingDialog";
import { useContent } from "@/context/ContentContext";

const Services: React.FC = () => {
    const [bookingOpen, setBookingOpen] = useState(false);
    const { tariffs = [], refreshTariffs } = useContent();

    useEffect(() => {
        refreshTariffs();
    }, [refreshTariffs]);

    const formatPriceWithUAH = (price?: string) => {
        if (!price) return "";
        const normalized = price.trim();
        if (normalized.includes('₴') || normalized.toLowerCase().includes('uah')) {
            return normalized;
        }
        return `${normalized} ₴`;
    };

    return (
        <div className={styles.container} id="services">
            <h2 className={styles.title}>Ціни та Послуги</h2>
            <div className={styles.cards}>
                {tariffs.map((tariff) => (
                    <div
                        key={tariff._id}
                        className={`${styles.card} ${tariff.popular ? styles.popular : ''}`}
                    >
                        {tariff.popular && <div className={styles.popularLabel}>Популярний</div>}
                        <div className={styles.cardTitle}>{tariff.title}</div>
                        <div className={styles.price}>{formatPriceWithUAH(tariff.price)}</div>
                        <ul className={styles.features}>
                            {(tariff.features || []).map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                        <ButtonUI color="secondary" onClick={() => setBookingOpen(true)}>
                            {tariff.buttonText || 'Записатися'}
                        </ButtonUI>
                    </div>
                ))}
            </div>

            <BookingDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
        </div>
    );
};

export default Services;
