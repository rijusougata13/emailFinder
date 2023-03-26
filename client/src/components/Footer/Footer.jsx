import React from "react";
import { BottomNavigation,BottomNavigationAction } from '@mui/material';
import {Coffee, GitHub, Twitter} from '@mui/icons-material';
import styles from './styles.module.scss';

const Footer=()=>{
    return (
        <BottomNavigation
            showLabels
            className={styles.wrapper}
        >
        <Twitter  className={styles.icon} onClick={e=>window.open('https://twitter.com/rijusougata13')}/>
        <GitHub className={styles.icon} onClick={e=>window.open('https://github.com/rijusougata13')}/>
        <Coffee className={styles.icon} onClick={e=>window.open('https://www.buymeacoffee.com/rijusougata13')}/>
        </BottomNavigation>
    )
}

export default Footer;
