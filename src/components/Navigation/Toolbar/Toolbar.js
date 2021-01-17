import React from 'react';

import styles from './Toolbar.module.scss';

const toolbar = props => {
    return (
        <div className={styles.Toolbar}>
            <span className={styles.Marvel}>Marvel</span>
            <span className={styles.Characters}>/Characters</span>
        </div>
    );
}

export default toolbar;