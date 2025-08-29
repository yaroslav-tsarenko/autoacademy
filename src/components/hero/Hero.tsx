import StoryCircle from "@/components/story-circle/StoryCircle";
import {media} from "@/resources/media";
import styles from "./Hero.module.scss"
import ButtonUI from "@/ui/button/ButtonUI";
import React from "react";

export default function Hero() {
    return (
        <div className={styles.wrapper}>
            <StoryCircle thumbnail={media.thumbnail_main.src} variant="big"/>
            <div className={styles.description}>
                <div className={styles.descriptionHeader}>
                    <h1>avtoacademykhm</h1>
                    <div className={styles.buttons}>
                        <ButtonUI color="tertiary">Підписатись</ButtonUI>
                        <ButtonUI color="primary">Написати</ButtonUI>
                    </div>
                </div>
                <div className={styles.metrics}>
                    <div className={styles.metricItem}>
                        <p>
                            495
                        </p>
                        Публікацій
                    </div>
                    <div className={styles.metricItem}>
                        <p>
                            4,091
                        </p>
                        Підписники
                    </div>
                    <div className={styles.metricItem}>
                        <p>
                            500+
                        </p>
                        Учнів
                    </div>
                </div>
                <div className={styles.card}>
                    <h1>Автошкола &quot;Автоакадемія&quot; 🚖 Хмельницький</h1>
                    <p>Навчаємо від А до Я!</p>
                    <p>🏁 Початок навчання 19 вересня</p>
                    <p>🚘 В наявності Toyota Corolla як на екзамені</p>
                    <p>🚘 МКПП / АКПП</p>
                    <p>⚙️ Відновлення навичок водіння</p>
                    <p className={styles.address}>
                        📍 вул. Подільська, 93/1, м. Хмельницький
                    </p>
                </div>
            </div>
        </div>
    );
}