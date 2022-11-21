import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import styles from "./styles.module.css";

const Header = () => {
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
          <div className="menu">
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
              <MenuItem onClick={handleCloseSubMenu}>Item 1</MenuItem>
              <MenuItem onClick={handleCloseSubMenu}>Item 2</MenuItem>
              <MenuItem onClick={handleCloseSubMenu}>Item 3</MenuItem>
            </Menu>
          </div>
          <div className="logo">LOGO</div>
        </div>

        <div className={styles.rightContent}>
          <Avatar
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
            <MenuItem onClick={handleCloseAvatar}>Profile</MenuItem>
            <MenuItem onClick={handleCloseAvatar}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;