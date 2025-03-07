import React, { useContext, useState } from "react";
import styles from "./Sidebar.module.css"; // Alteração para module CSS
import logo_uea from "../img/uea.svg";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegNewspaper, FaPeopleGroup } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import AuthContext from "../context/AuthContext";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Box, capitalize, Menu, MenuItem, Typography } from "@mui/material"; // Importe Menu e MenuItem
import MenuIcon from "@mui/icons-material/Menu";

function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { logoutContext } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  let page = "";
  switch (true) {
    case location.pathname === "/process":
      page = "process";
      break;
    case location.pathname.startsWith("/process/edit/"):
      page = "process-edit";
      break;
    case location.pathname === "/register-process":
      page = "register-process";
      break;
    case location.pathname === "/register-user":
      page = "register-user";
      break;
    case location.pathname === "/calendar-page":
      page = "calendar-page";
      break;
    default:
      break;
  }

  const logoutUser = () => {
    logoutContext();
  };

  // Função para abrir o menu ao passar o mouse
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  // Função para fechar o menu apenas quando o mouse sai do botão e do menu
  const handleMenuClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_logo}>
        <div className={styles.logo_uea_container}>
          <img src={logo_uea} alt="Logo da UEA" className={styles.logo_uea} />
        </div>
      </div>
      <ul className={styles.sidebar_ul}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "150px",
            padding: "10px",
            backgroundColor: "#17427c",
            borderRadius: "15%",
            md: { display: "none" },
          }}>
          <IconButton
            sx={{ position: "relative", margin: "auto" }}
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onMouseEnter={handleMenuOpen} // Abre o menu ao passar o mouse
          >
            <AccountCircle />
          </IconButton>

          {/* Menu de Logout */}
          <Menu
            id="logout-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              onMouseEnter: () => setMenuOpen(true), // Mantém aberto se o mouse estiver dentro
              onMouseLeave: handleMenuClose, // Fecha quando o mouse sair
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}>
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </Menu>

          <Typography variant="subtitle2">Logado como {user && capitalize(user?.user.name)}</Typography>
          <br />
          {user?.user.role === "ProcuradorEfetivo" ? (
            <Typography variant="subtitle2" fontWeight="bold" color="white">
              Procurador Efetivo
            </Typography>
          ) : user?.user.role === "ProcuradorGeral" ? (
            <Typography variant="subtitle2">Procurador Geral</Typography>
          ) : user?.user.role === "Secretario" ? (
            <Typography variant="subtitle2">Secretária</Typography>
          ) : (
            <Typography variant="subtitle2">Assessora</Typography>
          )}
        </Box>

        <li className={styles.li_content}>
          <Link to="/calendar-page">
            <button className={`${styles.button_li} ${page === "calendar-page" ? styles.active : ""}`}>
              <FaRegCalendarAlt className={`${styles.icon_li} $`} />
              <span>Calendário</span>
            </button>
          </Link>
        </li>
        <li>
          <Link to="/process">
            <button className={`${styles.button_li} ${page === "process" || page === "process-edit" ? styles.active : ""}`}>
              <FaRegNewspaper className={styles.icon_li} />
              <span>Processos</span>
            </button>
          </Link>
        </li>
        <li>
          <Link to="/user">
            <button className={styles.button_li}>
              <FaPeopleGroup className={styles.icon_li} />
              <span>Gerenciar</span>
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
