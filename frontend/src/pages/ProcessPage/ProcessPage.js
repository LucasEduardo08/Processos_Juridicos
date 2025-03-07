import React, { useContext, useEffect, useState } from "react";
import ProcessTable from "./ProcessTable";
import styles from "./ProcessPage.module.css"; // Alterado para importar o módulo CSS
import { FaCircle, FaSearch, FaFilter } from "react-icons/fa";
import { getAllProcess, getProcessesByAttorney, updateProcess } from "../../services/processService";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Button, IconButton, Menu, MenuItem, Badge, Typography, Stack } from "@mui/material";
import ModalExchangeProcesses from "./ModalExchangeProcesses";
import { getAttorneys } from "../../services/usersService";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { acceptTransfer, getProcessesInTransfer, getTransferNotifications } from "../../services/transferService";
import { formatDateBR } from "../../utils/utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const ProcessPage = () => {
  const [processes, setProcesses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCLoseModal = () => setModalOpen(false);
  const [selectedProcessCount, setSelectedProcessCount] = useState(0);
  const [attorneys, setAttorneys] = useState([]);
  console.log("selectedprocesscount", selectedProcessCount);
  const [selectedProcesses, setSelectedProcesses] = useState([]); // Lista de processos selecionados
  const handleSelectedProcessesChange = (selected) => {
    setSelectedProcesses(selected);
    console.log(selected);
    console.log("selectedprocesses", selectedProcesses); // Atualizando os processos selecionados
  };
  const [notifications, setNotifications] = useState([]); // Lista de notificações
  const [anchorEl, setAnchorEl] = useState(null); // Estado do menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [processesInTransfer, setProcessesInTransfer] = useState([]);
  // console.log("quantidade de processos", notifications[0].processos.leng)
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const searchedProcesses = search.length > 0 ? processes.filter((process) => process.Pcss_NumeroProcesso.includes(search)) : [];

  const handleFilteredProcesses = (e) => {
    // console.log(1);
  };

  const fetchAttorneys = async () => {
    const response = await getAttorneys();
    setAttorneys(response);
  };

  useEffect(() => {
    if (modalOpen) fetchAttorneys();
  }, [modalOpen]);

  console.log(attorneys);

  const fetchProcesses = async () => {
    try {
      if (user.user.role === "ProcuradorEfetivo") {
        const response = await getProcessesByAttorney(user.user.id);
        // console.log("Dados retornados da API", response);
        setProcesses(response);
      } else {
        const response = await getAllProcess(user.user.id);
        setProcesses(response);
      }
    } catch (error) {
      console.log("erro", error);
    }
  };

  const fetchProcessesInTransfer = async () => {
    try {
      const response = await getProcessesInTransfer(user.user.id);
      setProcessesInTransfer(response);
    } catch (error) {
      console.log(error);
    }
  };
  // const handleSelectedProcessesChange = (count) => {
  //   setSelectedProcessCount(count);
  // };

  const fetchNotifications = async () => {
    try {
      const response = await getTransferNotifications(user.user.id);
      setNotifications(response);
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    fetchProcesses();
    fetchNotifications();
    fetchProcessesInTransfer();
  }, []);

  console.log("processos em transferencia", processesInTransfer);
  console.log("notifications", notifications);
  const updateStatus = async (id, status) => {
    try {
      await updateProcess(id, { Pcss_Status: status });
      setProcesses((prevProcesses) =>
        prevProcesses.map((process) => (process.id === id ? { ...process, Pcss_Status: status } : process))
      );
    } catch (error) {
      // console.log(error);
    }
  };

  const calculatePrazo = (date, id) => {
    const dateToday = new Date();
    // console.log(dateToday);
    const dateVencimento = new Date(date);
    dateVencimento.setHours(dateVencimento.getHours() + 4 + 23, 59, 59);
    // console.log(dateVencimento);

    const diffTime = dateVencimento - dateToday;
    // console.log("difftime", diffTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      const process = processes.find((p) => p.id === id);
      if (process && process.Pcss_Status !== "Vencido") {
        updateStatus(id, "Vencido");
      }
    }
    // console.log(diffDays);
    return diffDays;
  };

  const handleAcceptTransfer = async (notificationId) => {
    
    try {
      const response = await acceptTransfer(notificationId)
      console.log(response);
      // fetchProcesses();
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleRejectTransfer = async (notificationId) => {
    return;
  };

  return (
    <div className={styles.page_content}>
      <div className={styles.main_container}>
        {/* Ícone de notificações com contador */}
        <IconButton color="inherit" onClick={handleMenuOpen} sx={{ marginLeft: "auto" }}>
          <Badge badgeContent={notifications?.length} color="error">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>

        {/* Menu dropdown de notificações */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ width: "100vw" }}>
          {notifications?.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                // onClick={handleMenuClose}
                sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography>
                  O(a) Procurador {notification.usuarioOrigem.Usua_Nome} solicitou a troca de {notification.processos?.length}{" "}
                  processos no dia {formatDateBR(notification.Tran_Data)}
                </Typography>
                {/* Botões de Aceitar e Recusar em Linha */}
                <Stack direction="row" spacing={1} sx={{ marginTop: "0.5rem", marginLeft: "auto" }}>
                  <IconButton color="success" onClick={() => handleAcceptTransfer(notification.id)}>
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleRejectTransfer(notification.id)}>
                    <CancelIcon />
                  </IconButton>
                </Stack>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Nenhuma notificação</MenuItem>
          )}
        </Menu>
        <div className={styles.filter_section_bar}>
          <label>Selecionar Status: </label>
          <button onClick={handleFilteredProcesses}>
            <FaCircle color="#2871A7" />
            Emitidos
          </button>
          <button>
            <FaCircle color="#19D109" />
            Concluídos
          </button>
          <button>
            <FaCircle color="#FF0000" />
            Vencidos
          </button>
          <div className={styles.search_input_container}>
            <input type="text" className={styles.input} value={search} onChange={(e) => setSearch(e.target.value)}></input>
            <FaSearch className={styles.icon_search} />
          </div>
          <FaFilter className={styles.icon_filter} />
        </div>
        <div className={styles.content}>
          <div className={styles.title_container}>
            <h3>Listagem de processos cadastrados</h3>
            <IoAddOutline className={styles.add_icon} onClick={() => navigate("/register-process")} />
          </div>
          <ProcessTable
            processes={search.length > 0 ? searchedProcesses : processes}
            calculatePrazo={calculatePrazo}
            handleSelectedProcessesChange={handleSelectedProcessesChange}
            processesInTransfer={processesInTransfer}
          />
        </div>
        <Button
          onClick={handleOpenModal}
          variant="contained"
          sx={{ width: "10rem", height: "3rem", marginLeft: "auto", marginTop: "1rem" }}
          disabled={selectedProcesses.length === 0}>
          Trocar Processos
        </Button>
      </div>
      <ModalExchangeProcesses
        open={modalOpen}
        onClose={handleCLoseModal}
        selectedProcessCount={selectedProcessCount}
        attorneys={attorneys}
        processes={selectedProcesses}
      />
    </div>
  );
};

export default ProcessPage;
