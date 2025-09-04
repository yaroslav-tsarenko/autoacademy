import React from 'react';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import styles from './GoogleItemReview.module.scss';
import Image, {StaticImageData} from "next/image";

export interface GoogleItemReviewProps {
    fullName: string;
    avatar: string;
    rating: number;
    reviews: string;
    ago: string;
    role: string;
    text: string;
    photo: StaticImageData | string;
}

const GoogleItemReview: React.FC<GoogleItemReviewProps> = ({
                                                               fullName,
                                                               avatar,
                                                               rating,
                                                               reviews,
                                                               ago,
                                                               role,
                                                               text,
                                                               photo,
                                                           }) => {
    return (
        <div className={styles.wrapper}>
            <Image src={photo} alt="image" height={500} width={400} className={styles.bgImage}/>
            <div className={styles.reviewItem}>
                <div className={styles.header}>
                    <Avatar src={avatar} alt={fullName} className={styles.avatar} />
                    <div>
                        <div className={styles.name}>{fullName}</div>
                        <div className={styles.meta}>
                            <span>{role}</span>
                            <span className={styles.dot}>•</span>
                            <span>{ago}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.ratingRow}>
                    <Rating value={rating} precision={0.1} readOnly size="small" />
                    <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
                    <span className={styles.reviews}>({reviews} reviews)</span>
                </div>
                <div className={styles.text}>{text}</div>
            </div>
        </div>
    );
};

export default GoogleItemReview;