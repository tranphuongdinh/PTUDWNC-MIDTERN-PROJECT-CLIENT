import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import styles from "./styles.module.css";

const Footer = () => {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.content}>
        <p className={styles.copyRight}>PTUWDWNC - 19120</p>
      </div>
    </div>
  );
};

export default Footer;
