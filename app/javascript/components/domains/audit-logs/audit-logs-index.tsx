import React, { useState, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import { observer } from "mobx-react";
import { types, flow, getEnv, getRoot } from "mobx-state-tree";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useMst } from "~/setup/root";



// export async function getAuditlogs() {
//     console.log();
//     return this.client.get("/audit_logs");
// }

export interface IAuditLogProps {}

export const AuditLogsIndex = observer(
  (props: IAuditLogProps): JSX.Element => {
  const { auditLogStore } = useMst();
  const { auditLog } = auditLogStore;

  const getAuditlog = () => {
    auditLogStore.getAudit();
  };

  useEffect(() => {
    getAuditlog();
    ////auditLogStore.getAudit();
  });

  function createData(
    name: any,
    col1: any,
    col2: any,
    col3: any,
    col4: any,
  ) {
    return { name, col1, col2, col3, col4 };
  }

  const rows = [
    createData('Row 1', '', '', '', ''),
    createData('Row 2', '', '', '', ''),
    createData('Row 3', '', '', '', ''),
    createData('Row 4', '', '', '', ''),
  ];

  function BasicTable() {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>audit logs</TableCell>
              <TableCell align="right">Col 1</TableCell>
              <TableCell align="right">Col&nbsp;2</TableCell>
              <TableCell align="right">Col&nbsp;3</TableCell>
              <TableCell align="right">Col&nbsp;4</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.col1}</TableCell>
                <TableCell align="right">{row.col2}</TableCell>
                <TableCell align="right">{row.col3}</TableCell>
                <TableCell align="right">{row.col4}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <div>
      <div>audit logs</div>
      <div>
        {BasicTable()}
      </div>
    </div>
  )
  }
);