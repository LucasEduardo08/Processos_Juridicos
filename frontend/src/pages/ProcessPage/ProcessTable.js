import React from "react";
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from "@mui/material";
import styles from "./ProcessTable.module.css"; // Alteração para module CSS
import { FaTrash, FaPencil, FaCircle } from "react-icons/fa6";
import { Link } from "react-router-dom";

const formatDate = (date) => {
  const dateIso = new Date(date);
  return dateIso.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ProcessTable = ({ processes, calculatePrazo }) => {
  console.log(processes);
  return (
    <TableContainer sx={{ maxHeight: 500 }} className={styles.table_container}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
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
            <TableRow key={process.id}>
              <TableCell>
                {process.Pcss_Status === "Emitido" && <FaCircle color="#2871A7" />}
                {process.Pcss_Status === "Concluido" && <FaCircle color="#19D109" />}
                {process.Pcss_Status === "Vencido" && <FaCircle color="#FF0000" />}
              </TableCell>
              <TableCell>{process.Pcss_NumeroProcesso}</TableCell>
              <TableCell>{process.Pcss_Siged}</TableCell>
              <TableCell>{process.Pcss_Requerente}</TableCell>
              <TableCell>{process.Pcss_TipoPrazoId === 1 ? "AO" : process.Pcss_TipoPrazoId === 2 ? "JE" : process.Pcss_TipoPrazoId === 3 ? "MS" : "Personalizado"}</TableCell>
              <TableCell>{process.assuntos[0]?.Pass_Assunto || "assunto"}</TableCell>
              <TableCell>{formatDate(process.Pcss_DataVencimento)}</TableCell>
              <TableCell>{calculatePrazo(process.Pcss_DataVencimento, process.id)}</TableCell>
              <TableCell>
                <FaTrash />
              </TableCell>
              <TableCell>
                <Link to={`/process/edit/${process.id}`}>
                  <FaPencil />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProcessTable;
