import React from 'react';
import GoogleItemReview from '../google-item-review/GoogleItemReview';
import styles from './Reviews.module.scss';
import {media} from "@/resources/media";

const reviewsData = [
    {
        fullName: 'Іван Петренко',
        avatar: media.photo_1,
        photo: media.review_1,
        rating: 4.8,
        reviews: '12',
        ago: '2 дні тому',
        role: 'Учень',
        text: 'Дуже задоволений навчанням! Інструктори професійні та уважні.',
    },
    {
        fullName: 'Олена Коваль',
        avatar: media.photo_1,
        photo: media.review_2,
        rating: 5.0,
        reviews: '8',
        ago: '1 тиждень тому',
        role: 'Учениця',
        text: 'Чудова автошкола, рекомендую всім друзям!',
    },
    {
        fullName: 'Сергій Мельник',
        avatar: media.photo_1,
        photo: media.review_3,
        rating: 4.7,
        reviews: '5',
        ago: '3 тижні тому',
        role: 'Учень',
        text: 'Гарний підхід до навчання, все доступно пояснюють.',
    },

];

const Reviews = () => {
    return (
        <div className={styles.reviewsContainer}>
            <h2 className={styles.title}>Відгуки Наших Учнів</h2>
            <div className={styles.list}>
                {reviewsData.map((review, idx) => (
                    <GoogleItemReview key={idx} {...review} avatar={review.avatar.src} />
                ))}
            </div>
        </div>
    );
};

export default Reviews;