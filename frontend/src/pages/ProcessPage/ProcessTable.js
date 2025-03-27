import React, { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Checkbox } from "@mui/material";
import styles from "./ProcessTable.module.css"; // Alteração para module CSS
import { FaTrash, FaPencil, FaCircle } from "react-icons/fa6";
import { Link } from "react-router-dom";
import ModalViewProcess from "./ModalViewProcess";

const formatDate = (date) => {
  const dateIso = new Date(date);
  return dateIso.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ProcessTable = ({
  processes,
  calculatePrazo,
  handleSelectedProcessesChange,
  processesInTransfer,
  handleDeleteProcess,
  handleConcludeProcess,
}) => {
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [clickedProcess, setClickedProcess] = useState(null);
  const handleSelectProcess = (id) => {
    setSelectedProcesses((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((processId) => processId !== id) : [...prevSelected, id]
    );
  };

  useEffect(() => {
    handleSelectedProcessesChange(selectedProcesses);
  }, [selectedProcesses, handleSelectedProcessesChange]);
  // console.log(processes);
  console.log("selectedprocess", selectedProcesses);

  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = (process) => {
    setClickedProcess(process);
    setModalOpen(true);
  };
  const handleCLoseModal = () => setModalOpen(false);

  return (
    <TableContainer sx={{}} className={styles.table_container}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: "white" }}></TableCell>
            <TableCell sx={{ backgroundColor: "white" }}>Status</TableCell>
            <TableCell sx={{ backgroundColor: "white" }}>Nº do Processo</TableCell>
            <TableCell sx={{ backgroundColor: "white" }}>Nº do Siged</TableCell>
            <TableCell sx={{ backgroundColor: "white" }}>Requerente</TableCell>
            <TableCell sx={{ backgroundColor: "white" }}>Tipo</TableCell>
            <TableCell sx={{ backgroundColor: "white" }}>Assunto</TableCell>
            <TableCell sx={{ backgroundColor: "white" }}>Vencimento</TableCell>
            <TableCell sx={{ backgroundColor: "white" }}>Prazo</TableCell>
            <TableCell sx={{ backgroundColor: "white" }}></TableCell>
            <TableCell sx={{ backgroundColor: "white" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processes?.map((process) => (
            <TableRow
              key={process.id}
              sx={{
                cursor: "pointer",
                backgroundColor: processesInTransfer.some((transfer) => transfer.processos.some((p) => p.id === process.id))
                  ? "#F3E9C780"
                  : process.Pcss_Status === "Concluído"
                  ? "#D0F0C0"
                  : "inherit",
              }}
              hover
              onClick={() => handleOpenModal(process)}>
              <TableCell>
                <Checkbox
                  checked={selectedProcesses.includes(process.id)}
                  onChange={() => handleSelectProcess(process.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell>
                {process.Pcss_Status === "Emitido" && <FaCircle color="#2871A7" />}
                {process.Pcss_Status === "Concluído" && <FaCircle color="#19D109" />}
                {process.Pcss_Status === "Vencido" && <FaCircle color="#FF0000" />}
              </TableCell>
              <TableCell>{process.Pcss_NumeroProcesso}</TableCell>
              <TableCell>{process.Pcss_Siged}</TableCell>
              <TableCell>{process.Pcss_Requerente}</TableCell>
              <TableCell>
                {process.Pcss_TipoPrazoId === 1
                  ? "AO"
                  : process.Pcss_TipoPrazoId === 2
                  ? "JE"
                  : process.Pcss_TipoPrazoId === 3
                  ? "MS"
                  : "Personalizado"}
              </TableCell>
              <TableCell>{process.assuntos[0]?.Pass_Assunto || "assunto"}</TableCell>
              <TableCell>{formatDate(process.Pcss_DataVencimento)}</TableCell>
              <TableCell>{calculatePrazo(process.Pcss_DataVencimento, process.id)}</TableCell>
              <TableCell>
                <FaTrash
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProcess(process.id);
                  }}
                />
              </TableCell>
              <TableCell>
                <Link to={`/process/edit/${process.id}`} onClick={(e) => e.stopPropagation()}>
                  <FaPencil />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ModalViewProcess
        open={modalOpen}
        onClose={handleCLoseModal}
        process={clickedProcess}
        prazo={calculatePrazo(clickedProcess?.Pcss_DataVencimento, clickedProcess?.id)}
        handleConcludeProcess={() => handleConcludeProcess(clickedProcess?.id)}
      />
    </TableContainer>
  );
};

export default ProcessTable;
