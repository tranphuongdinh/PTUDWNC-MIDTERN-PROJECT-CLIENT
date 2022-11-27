/* eslint-disable @next/next/no-html-link-for-pages */
import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import styles from "./styles.module.scss";

const Header = ({ logout }) => {
  const [anchorEllSubMenu, setanchorEllSubMenu] = React.useState(null);
  const openSubMenu = Boolean(anchorEllSubMenu);
  const handleClickSubMenu = (event) => {
    setanchorEllSubMenu(event.currentTarget);
  };
  const handleCloseSubMenu = () => {
    setanchorEllSubMenu(null);
  };

  const [anchorEllAvatar, setanchorEllAvatar] = React.useState(null);
  const openAvatar = Boolean(anchorEllAvatar);
  const handleClickAvatar = (event) => {
    setanchorEllAvatar(event.currentTarget);
  };
  const handleCloseAvatar = () => {
    setanchorEllAvatar(null);
  };
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.content}>
        <div className={styles.leftContent}>
          <div className={styles.menu}>
            <MenuIcon
              id="basic-button"
              aria-controls={openSubMenu ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openSubMenu ? "true" : undefined}
              onClick={handleClickSubMenu}
            />
            <Menu
              id="basic-menu"
              anchorEl={anchorEllSubMenu}
              open={openSubMenu}
              onClose={handleCloseSubMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={() => (window.location.href = "/")}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleCloseSubMenu}>Item 2</MenuItem>
              <MenuItem onClick={handleCloseSubMenu}>Item 3</MenuItem>
            </Menu>
          </div>
          <div
            className={styles.logo}
            onClick={() => (window.location.pathname = "/")}
          >
            <img src="https://th.bing.com/th/id/R.1ebd53870fb65ac9ce03ce3ce647460e?rik=Gl0QstRDjsKQow&riu=http%3a%2f%2fcdn141.picsart.com%2f270660629065211.png&ehk=Psnil56470rY7h3wnrQdN2vsRwL2axzLbbMYQV8GatE%3d&risl=&pid=ImgRaw&r=0" />
            <span>MEOW-CLASSROOM</span>
          </div>
        </div>

        <div className={styles.rightContent}>
          <Avatar
            className={styles.avatar}
            aria-controls={openAvatar ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openAvatar ? "true" : undefined}
            onClick={handleClickAvatar}
            alt="Remy Sharp"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM0SyiV-GT4K7zR_tmnf2VNu5Ypqq09u-uZg&usqp=CAU"
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEllAvatar}
            open={openAvatar}
            onClose={handleCloseAvatar}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <a href="/profile">
              <MenuItem onClick={handleCloseAvatar}>Profile</MenuItem>
            </a>
            <MenuItem
              onClick={() => {
                logout();
                handleCloseAvatar();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
