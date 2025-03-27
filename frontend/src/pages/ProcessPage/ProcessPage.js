import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import ProcessTable from "./ProcessTable";
import styles from "./ProcessPage.module.css";
import { FaCircle, FaSearch, FaFilter } from "react-icons/fa";
import { deleteProcess, getAllProcess, getProcessesByAttorney, updateProcess } from "../../services/processService";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { Button, IconButton, Menu, MenuItem, Badge, Typography, Stack, Container, Box } from "@mui/material";
import ModalExchangeProcesses from "./ModalExchangeProcesses";
import { getAttorneys } from "../../services/usersService";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { acceptTransfer, getProcessesInTransfer, getTransferNotifications } from "../../services/transferService";
import { formatDateBR } from "../../utils/utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";
import ContainerComponent from "../../components/Container";
import HeaderPage from "../../components/HeaderPage";

const ProcessPage = () => {
  const renderCount = useRef(0);
  const [processes, setProcesses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [processesInTransfer, setProcessesInTransfer] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [statusButton, setStatusButton] = useState("");

  // Debug de renderizações (remover em produção)
  useEffect(() => {
    renderCount.current++;
    console.log(`Renderizou ProcessPage: ${renderCount.current} vezes`);
  });

  const handleOpenModal = useCallback(() => setModalOpen(true), []);
  const handleCLoseModal = useCallback(() => setModalOpen(false), []);

  const fetchAttorneys = useCallback(async () => {
    try {
      const response = await getAttorneys();
      setAttorneys(response);
    } catch (error) {
      console.error("Erro ao buscar procuradores:", error);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      const [processesData, notificationsData, transfersData] = await Promise.all([
        user?.user?.role === "ProcuradorEfetivo" ? getProcessesByAttorney(user.user.id) : getAllProcess(user?.user?.id),
        getTransferNotifications(user?.user?.id),
        getProcessesInTransfer(user?.user?.id),
      ]);

      setProcesses(processesData || []);
      setNotifications(notificationsData || []);
      setProcessesInTransfer(transfersData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }, [user?.user?.id, user?.user?.role]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    if (modalOpen) {
      fetchAttorneys();
    }
  }, [modalOpen, fetchAttorneys]);

  const updateStatus = useCallback(async (id, status) => {
    try {
      await updateProcess(id, { Pcss_Status: status });
      setProcesses((prev) => prev.map((p) => (p.id === id ? { ...p, Pcss_Status: status } : p)));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }, []);

  const calculatePrazo = useCallback(
    (date, id) => {
      const dateToday = new Date();
      const dateVencimento = new Date(date);
      dateVencimento.setUTCHours(23, 59, 59, 999);
      const diffTime = dateVencimento - dateToday;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffTime < 0) {
        const process = processes.find((p) => p.id === id);
        if (process && process.Pcss_Status !== "Vencido") {
          updateStatus(id, "Vencido");
        }
        return `Vencido há ${Math.abs(diffDays)} dias`;
      }

      return diffDays >= 0 ? `${diffDays} dias restantes` : "Calculando...";
    },
    [processes, updateStatus]
  );

  const handleAcceptTransfer = useCallback(
    async (notificationId) => {
      try {
        await acceptTransfer(notificationId);
        loadAllData();
      } catch (error) {
        console.error("Erro ao aceitar transferência:", error);
      }
    },
    [loadAllData]
  );

  const handleRejectTransfer = useCallback(() => {}, []);

  const handleDeleteProcess = useCallback(
    async (id) => {
      try {
        await deleteProcess(id);
        loadAllData();
      } catch (error) {
        console.error("Erro ao deletar processo:", error);
      }
    },
    [loadAllData]
  );

  const handleSelectedProcessesChange = useCallback((selected) => {
    setSelectedProcesses(selected);
  }, []);

  const handleMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // const searchedProcesses = useMemo(
  //   () => (search.length > 0 ? processes.filter((p) => p.Pcss_NumeroProcesso.includes(search)) : processes),
  //   [search, processes]
  // );

  const filteredProcesses = useMemo(() => {
    let filtered = processes;

    // Aplica filtro de status
    if (statusButton === "Emitidos") {
      filtered = filtered.filter((p) => p.Pcss_Status === "Emitido");
    } else if (statusButton === "Concluídos") {
      filtered = filtered.filter((p) => p.Pcss_Status === "Concluído");
    } else if (statusButton === "Vencidos") {
      filtered = filtered.filter((p) => p.Pcss_Status === "Vencido");
    }

    // Aplica filtro de busca
    if (search.length > 0) {
      filtered = filtered.filter((p) => p.Pcss_NumeroProcesso.includes(search));
    }

    return filtered;
  }, [processes, statusButton, search]);

  const handleConcludeClick = useCallback(
    async (id) => {
      try {
        await updateStatus(id, "Concluído");
        Swal.fire("Concluído!", "O processo foi concluído com sucesso.", "success");
      } catch (error) {
        console.error("Erro ao concluir processo:", error);
        Swal.fire("Erro!", "Ocorreu um erro ao concluir o processo.", "error");
      }
    },
    [updateStatus]
  );

  const memoizedNotifications = useMemo(
    () =>
      notifications?.map((notification) => (
        <MenuItem key={notification.id} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography>
            O(a) Procurador {notification.usuarioOrigem?.Usua_Nome} solicitou a troca de {notification.processos?.length}{" "}
            processos no dia {formatDateBR(notification.Tran_Data)}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginTop: "0.5rem", marginLeft: "auto" }}>
            <IconButton color="success" onClick={() => handleAcceptTransfer(notification.id)}>
              <CheckCircleIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleRejectTransfer(notification.id)}>
              <CancelIcon />
            </IconButton>
          </Stack>
        </MenuItem>
      )),
    [notifications, handleAcceptTransfer]
  );

  return (
    // <div className={styles.page_content}>
    <>
      <HeaderPage>
        <IconButton color="inherit" onClick={handleMenuOpen} sx={{ marginLeft: "auto" }}>
          <Badge badgeContent={notifications?.length} color="error">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ width: "100vw" }}>
          {notifications?.length > 0 ? memoizedNotifications : <MenuItem disabled>Nenhuma notificação</MenuItem>}
        </Menu>

        <div className={styles.filter_section_bar}>
          <label>Selecionar Status: </label>
          <button onClick={() => setStatusButton((prev) => (prev === "Emitidos" ? "" : "Emitidos"))}>
            <FaCircle color="#2871A7" />
            Emitidos
          </button>
          <button onClick={() => setStatusButton((prev) => (prev === "Concluídos" ? "" : "Concluídos"))}>
            <FaCircle color="#19D109" />
            Concluídos
          </button>
          <button onClick={() => setStatusButton((prev) => (prev === "Vencidos" ? "" : "Vencidos"))}>
            <FaCircle color="#FF0000" />
            Vencidos
          </button>
          <div className={styles.search_input_container}>
            <input type="text" className={styles.input} value={search} onChange={(e) => setSearch(e.target.value)} />
            <FaSearch className={styles.icon_search} />
          </div>
          <FaFilter className={styles.icon_filter} />
        </div>
      </HeaderPage>
      <ContainerComponent>
        <div className={styles.title_container}>
          <h3>Listagem de processos cadastrados</h3>
          <IoAddOutline className={styles.add_icon} onClick={() => navigate("/register-process")} />
        </div>

        <ProcessTable
          processes={filteredProcesses}
          calculatePrazo={calculatePrazo}
          handleSelectedProcessesChange={handleSelectedProcessesChange}
          processesInTransfer={processesInTransfer}
          handleDeleteProcess={handleDeleteProcess}
          handleConcludeProcess={handleConcludeClick}
        />
      </ContainerComponent>
      <Box sx={{ display: "flex" }}>
        <Button
          onClick={handleOpenModal}
          variant="contained"
          sx={{ width: "10rem", height: "3rem", marginLeft: "auto", marginTop: "1rem" }}
          disabled={selectedProcesses.length === 0}>
          Trocar Processos
        </Button>
      </Box>
      <ModalExchangeProcesses
        open={modalOpen}
        onClose={handleCLoseModal}
        selectedProcessCount={selectedProcesses.length}
        attorneys={attorneys}
        processes={selectedProcesses}
      />
    </>
  );
};

export default React.memo(ProcessPage);
