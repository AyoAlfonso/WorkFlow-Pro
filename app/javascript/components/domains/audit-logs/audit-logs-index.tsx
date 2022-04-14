import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import { observer } from "mobx-react";
import { Loading } from "~/components/shared/loading";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useMst } from "~/setup/root";
import { toJS } from "mobx";
import { OwnedBy } from "../scorecard/shared/scorecard-owned-by";

export interface IAuditLogProps {}

export const AuditLogsIndex = observer(
  (props: IAuditLogProps): JSX.Element => {
    const { auditLogStore, userStore, teamStore } = useMst();
    const { auditLogs } = auditLogStore;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      auditLogStore.getAudit().then(() => {
        setLoading(false);
      });
    }, []);
    console.log(toJS(auditLogs));
    const renderLoading = () => (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    );

    const data = useMemo(
      () =>
        toJS(auditLogs).map(auditLog => {
          return {
            id: auditLog.id,
            controller: auditLog.controller,
            user: auditLog.userId,
            note: auditLog.note,
            action: auditLog.action,
            company: auditLog.companyId,
            team: auditLog.teamId,
            createdAt: auditLog.createdAt,
          };
        }),
      [auditLogs],
    );

    const columns = useMemo(
      () => [
        {
          Header: () => <div style={{ fontSize: "14px" }}>User</div>,
          accessor: "user",
          Cell: ({ value }) => {
            const user = userStore.users.find(user => user.id == value);
            return (
              <OwnerContainer>
                <OwnedBy ownedBy={user} marginLeft={"0px"} disabled />
              </OwnerContainer>
            );
          },
          width: "3em",
          minWidth: "160px",
        },
        {
          Header: () => <div style={{ fontSize: "14px" }}>Action</div>,
          accessor: "action",
          Cell: ({ value }) => {
            return <div style={{ fontSize: "14px", textAlign: "center" }}>{value}</div>;
          },
          width: "fit-content",
          minWidth: "160px",
        },
        {
          Header: () => <div style={{ fontSize: "14px" }}>Controller</div>,
          accessor: "controller",
          Cell: ({ value }) => {
            return <div style={{ fontSize: "14px", textAlign: "center" }}>{value}</div>;
          },
          width: "20%",
          minWidth: "160px",
        },
        {
          Header: () => <div style={{ fontSize: "14px" }}>Note</div>,
          accessor: "note",
          Cell: ({ value }) => {
            return <div style={{ fontSize: "14px" }}>{value}</div>;
          },
          width: "20%",
          minWidth: "fit-content",
        },
        {
          Header: () => <div style={{ fontSize: "14px" }}>Created At</div>,
          accessor: "createdAt",
          Cell: ({ value }) => {
            console.log(value);
            const time = new Date(value);
            return (
              <div style={{ fontSize: "14px", textAlign: "center" }}>{time.toDateString()}</div>
            );
          },
        },
      ],
      [auditLogs],
    );

    const tableInstance = useTable({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    return (
      <div>
        {/* <div>audit logs</div> */}
        {loading && !auditLogs.length ? (
          renderLoading()
        ) : (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                {headerGroups.map(headerGroup => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <TableHeader {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </TableHeader>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row);
                  return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell", cell.getCellProps())}
                          </td>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    );
  },
);
const TableContainer = styled.div`
  width: 100%;
  font-family: Lato;
  display: flex;
  align-items: center;
`;

const Table = styled.table`
  border-collapse: collapse;
  display: -webkit-box;
  padding-bottom: 16px;
  font-size: 12px;
  overflow-x: auto;
  width: 100%;
`;

const TableHead = styled.thead`
  width: 100%;
`;

const TableBody = styled.tbody`
  width: 100%;
`;

const TableHeader = styled.th`
  border: 1px solid ${props => props.theme.colors.borderGrey};
  padding: 16px 8px;
`;

type TableRowProps = {
  hover?: boolean;
};

const TableRow = styled.tr<TableRowProps>`
  width: 100%;
  height: 48px;
  ${props =>
    props.hover &&
    `&:hover {
		background: ${props.theme.colors.backgroundBlue};
	}`}
`;

const OwnerContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
