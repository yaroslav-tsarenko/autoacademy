"use client"

import React from 'react';
import GoogleItemReview from '../google-item-review/GoogleItemReview';
import styles from './Reviews.module.scss';
import {useContent} from "@/context/ContentContext";

const Reviews = () => {
    const {reviews} = useContent();

    return (
        <div className={styles.reviewsContainer} id="reviews">
            <h2 className={styles.title}>Відгуки Наших Учнів</h2>
            <div className={styles.list}>
                {reviews.length === 0 ? (
                    <div className={styles.noReviews}>Відгуків ще немає</div>
                ) : (
                    reviews.map((review) => (
                        <GoogleItemReview key={review._id} {...review} avatar={review.avatar}/>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reviews;