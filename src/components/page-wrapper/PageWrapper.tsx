import React, {FC} from 'react';
import {PageWrapperProps} from "@/components/page-wrapper/types";
import styles from "./PageWrapper.module.scss"

const PageWrapper:FC<PageWrapperProps> = ({children}) => {
    return (
        <main className={styles.wrapper}>
            {children}
        </main>
    );
};

export default PageWrapper;