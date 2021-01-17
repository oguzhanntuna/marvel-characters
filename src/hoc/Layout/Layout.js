import React from 'react';

import styles from './Layout.module.scss';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

const layout = props => {
    return (
        <div className={styles.Layout}>
            <header>
                <Toolbar />
            </header>
            <main>
                {props.children}
            </main>
        </div>
    );
}

export default layout;