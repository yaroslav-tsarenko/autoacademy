import React, {FC} from 'react';
import styles from './Divider.module.scss';

interface DividerProps {
    title: string;
    description: string;
}

const Divider: FC<DividerProps> = ({title, description}) => {
    return (
        <div className={styles.divider}>
            <h5>{title}</h5>
            <p>{description}</p>
        </div>
    );
};

export default Divider;