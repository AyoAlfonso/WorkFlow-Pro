import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import * as R from "ramda";
import { useTable } from "react-table";
import { observer } from "mobx-react";
import { Loading } from "~/components/shared/loading";
import { useMst } from "~/setup/root";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Select from "../scorecard/scorecard-select";
import Pagination from "@material-ui/lab/Pagination";
import { OwnedBy } from "../scorecard/shared/scorecard-owned-by";
import { HtmlTooltip } from "~/components/shared/tooltip";
import { AuditLogsSelector } from "./audit-logs-selector";
import { addDays } from "date-fns";
import moment from "moment";
import { DateRangeSelectorModal } from "./date-range-selector-modal";

export interface IAuditLogProps {}

export const AuditLogsIndex = observer(
  (props: IAuditLogProps): JSX.Element => {
    const { auditLogStore, userStore, teamStore, companyStore } = useMst();

    const [loading, setLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState<number>(1);
    const [ownerId, setOwnerId] = useState<number>(companyStore?.company?.id);
    const [ownerType, setOwnerType] = useState<string>("company");
    const [selection, setSelection] = useState<string>("all");
    const [open, setOpen] = useState<boolean>(false);
    const [dateFilter, setDateFilter] = useState<any>({
      selection: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
        key: "selection",
      },
      compare: {
        startDate: new Date(),
        endDate: new Date(),
        key: "compare",
      },
    });

    useEffect(() => {
      auditLogStore.getAudit(`page/1?per=10`).then(res => {
        setAuditLogs(res.userActivityLogs);
        setMeta(res.meta);
        setLoading(false);
      });
    }, []);

    const renderLoading = () => (
      <LoadingContainer>
        <Loading />
      </LoadingContainer>
    );

    const getLogs = pageNumber => {
      if (page === pageNumber) return;

      setLoading(true);
      return auditLogStore.getAudit(`page/${pageNumber}?per=10`).then(res => {
        const { userActivityLogs, meta } = res;
        let filteredLogs;
        setMeta(meta);
        setPage(meta.currentPage);
        setLoading(false);
        if (ownerType == "company") {
          filteredLogs = userActivityLogs.filter(log => log.companyId == ownerId);
          setAuditLogs(filteredLogs);
        } else if (ownerType == "user") {
          filteredLogs = userActivityLogs.filter(log => log.userId == ownerId);
          setAuditLogs(filteredLogs);
        } else {
          filteredLogs = userActivityLogs.filter(log => log.teamId == ownerId);
          setAuditLogs(filteredLogs);
        }
      });
    };

    const handleChange = (event, value) => {
      setPage(value);
      getLogs(value);
    };

    const formatAction = (action: string) => {
      const splitAction = action.split("_");
      if (splitAction[1]) {
        return splitAction.join(" ").replace(/(^\w|\s\w)/g, m => m.toUpperCase());
      } else {
        return action.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
      }
    };

    const data = useMemo(
      () =>
        auditLogs.map(auditLog => {
          return {
            id: auditLog.id,
            controller: formatAction(auditLog.controller),
            user: auditLog.userId,
            note: auditLog.note,
            action: formatAction(auditLog.action),
            company: auditLog.companyId,
            team: auditLog.teamId,
            createdAt: auditLog.createdAt,
            ipAddress: auditLog.ipAddress,
            browser: auditLog.browser,
          };
        }),
      [auditLogs],
    );

    const columns = useMemo(
      () => [
        {
          Header: () => <TableHeaderText>User</TableHeaderText>,
          accessor: "user",
          Cell: ({ value }) => {
            const user = userStore.users?.find(user => user.id == value);
            return (
              <OwnerContainer>
                <OwnedBy ownedBy={user} marginLeft={"0px"} disabled />
              </OwnerContainer>
            );
          },
          width: "100%",
          minWidth: "160px",
        },
        {
          Header: () => <TableHeaderText>Action</TableHeaderText>,
          accessor: "action",
          Cell: ({ value }) => {
            return <div style={{ fontSize: "14px", textAlign: "center" }}>{value}</div>;
          },
          width: "100%",
          minWidth: "160px",
        },
        {
          Header: () => <TableHeaderText>Controller</TableHeaderText>,
          accessor: "controller",
          Cell: ({ value }) => {
            return <div style={{ fontSize: "14px", textAlign: "center" }}>{value}</div>;
          },
          width: "100%",
          minWidth: "160px",
        },
        {
          Header: () => <TableHeaderText>Note</TableHeaderText>,
          accessor: "note",
          Cell: ({ value }) => {
            return <TableHeaderText>{value}</TableHeaderText>;
          },
          width: "100%",
          minWidth: "150px",
        },
        {
          Header: () => <TableHeaderText>IP Address</TableHeaderText>,
          accessor: "ipAddress",
          Cell: ({ value }) => {
            return <div style={{ fontSize: "14px", textAlign: "center" }}>{value}</div>;
          },
          width: "100%",
          minWidth: "150px",
        },
        {
          Header: () => <TableHeaderText>Browser</TableHeaderText>,
          accessor: "browser",
          Cell: ({ value }) => {
            return (
              <HtmlTooltip arrow title={<span>{value}</span>}>
                <div
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    width: "15em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {value}
                </div>
              </HtmlTooltip>
            );
          },
          // width: "20%",
          minWidth: "fit-content",
        },
        {
          Header: () => <TableHeaderText>Created At</TableHeaderText>,
          accessor: "createdAt",
          Cell: ({ value }) => {
            const time = new Date(value);
            return (
              <div style={{ fontSize: "14px", textAlign: "center" }}>{time.toDateString()}</div>
            );
          },
          width: "100%",
          minWidth: "160px",
        },
      ],
      [auditLogs],
    );

    const tableInstance = useTable({ columns, data });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    const handleDateRange = e => {
      setSelection(e);
      let filteredLogs;
      if (e == "all") {
        setLoading(true);
        auditLogStore.getAudit(`page/1?per=10`).then(res => {
          if (ownerType == "company") {
            filteredLogs = res.userActivityLogs.filter(log => log.companyId == ownerId);
            setAuditLogs(filteredLogs);
          } else if (ownerType == "user") {
            filteredLogs = res.userActivityLogs.filter(log => log.userId == ownerId);
            setAuditLogs(filteredLogs);
          } else {
            filteredLogs = res.userActivityLogs.filter(log => log.teamId == ownerId);
            setAuditLogs(filteredLogs);
          }
          setMeta(res.meta);
          setLoading(false);
        });
      } else if (e == "last-7-days") {
        setLoading(true);
        const startDate = moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD");
        const endDate = moment().format("YYYY-MM-DD");
        auditLogStore.getAudit(`?from=${startDate}&to=${endDate}`).then(res => {
          if (ownerType == "company") {
            filteredLogs = res.userActivityLogs.filter(log => log.companyId == ownerId);
            setAuditLogs(filteredLogs);
          } else if (ownerType == "user") {
            filteredLogs = res.userActivityLogs.filter(log => log.userId == ownerId);
            setAuditLogs(filteredLogs);
          } else {
            filteredLogs = res.userActivityLogs.filter(log => log.teamId == ownerId);
            setAuditLogs(filteredLogs);
          }
          setMeta(res.meta);
          setLoading(false);
        });
      } else if (e == "last-2-weeks") {
        setLoading(true);
        const startDate = moment()
          .subtract(14, "days")
          .format("YYYY-MM-DD");
        const endDate = moment().format("YYYY-MM-DD");
        auditLogStore.getAudit(`?from=${startDate}&to=${endDate}`).then(res => {
          if (ownerType == "company") {
            filteredLogs = res.userActivityLogs.filter(log => log.companyId == ownerId);
            setAuditLogs(filteredLogs);
          } else if (ownerType == "user") {
            filteredLogs = res.userActivityLogs.filter(log => log.userId == ownerId);
            setAuditLogs(filteredLogs);
          } else {
            filteredLogs = res.userActivityLogs.filter(log => log.teamId == ownerId);
            setAuditLogs(filteredLogs);
          }
          setMeta(res.meta);
          setLoading(false);
        });
      } else if (e == "last-30-days") {
        setLoading(true);
        const startDate = moment()
          .subtract(30, "days")
          .format("YYYY-MM-DD");
        const endDate = moment().format("YYYY-MM-DD");
        auditLogStore.getAudit(`?from=${startDate}&to=${endDate}`).then(res => {
          if (ownerType == "company") {
            filteredLogs = res.userActivityLogs.filter(log => log.companyId == ownerId);
            setAuditLogs(filteredLogs);
          } else if (ownerType == "user") {
            filteredLogs = res.userActivityLogs.filter(log => log.userId == ownerId);
            setAuditLogs(filteredLogs);
          } else {
            filteredLogs = res.userActivityLogs.filter(log => log.teamId == ownerId);
            setAuditLogs(filteredLogs);
          }
          setMeta(res.meta);
          setLoading(false);
        });
      } else {
        setLoading(true);
        const startDate = moment()
          .subtract(6, "months")
          .format("YYYY-MM-DD");
        const endDate = moment().format("YYYY-MM-DD");
        auditLogStore.getAudit(`?from=${startDate}&to=${endDate}`).then(res => {
          if (ownerType == "company") {
            filteredLogs = res.userActivityLogs.filter(log => log.companyId == ownerId);
            setAuditLogs(filteredLogs);
          } else if (ownerType == "user") {
            filteredLogs = res.userActivityLogs.filter(log => log.userId == ownerId);
            setAuditLogs(filteredLogs);
          } else {
            filteredLogs = res.userActivityLogs.filter(log => log.teamId == ownerId);
            setAuditLogs(filteredLogs);
          }
          setMeta(res.meta);
          setLoading(false);
        });
      }
    };

    const handleDateSelect = ranges => {
      let filteredLogs;
      const startDate = moment(ranges.selection.startDate).format("YYYY-MM-DD");
      const endDate = moment(ranges.selection.endDate).format("YYYY-MM-DD");
      setLoading(true);
      auditLogStore.getAudit(`?from=${startDate}&to=${endDate}`).then(res => {
        if (ownerType == "company") {
          filteredLogs = res.userActivityLogs.filter(log => log.companyId == ownerId);
          setAuditLogs(filteredLogs);
        } else if (ownerType == "user") {
          filteredLogs = res.userActivityLogs.filter(log => log.userId == ownerId);
          setAuditLogs(filteredLogs);
        } else {
          filteredLogs = res.userActivityLogs.filter(log => log.teamId == ownerId);
          setAuditLogs(filteredLogs);
        }
        setMeta(res.meta);
        setLoading(false);
      });
      setOpen(false);
    };

    return (
      <>
        <Container>
          {loading ? (
            renderLoading()
          ) : (
            <>
              <AuditLogsSelector
                ownerType={ownerType}
                ownerId={ownerId}
                setOwnerType={setOwnerType}
                setOwnerId={setOwnerId}
                setAuditLogs={setAuditLogs}
              />
              <SelectContainer>
                <Select selection={selection} setSelection={handleDateRange} id="audit-logs">
                  <option value="all">All</option>
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-2-weeks">Last 2 weeks</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="last-6-months">Last 6 Months</option>
                </Select>
                <CustomSelectButton
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Custom Range
                </CustomSelectButton>
              </SelectContainer>
              <TableContainer>
                <Table {...getTableProps()}>
                  <TableHead>
                    {headerGroups.map(headerGroup => (
                      <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                          <TableHeader
                            {...column.getHeaderProps({
                              style: {
                                width: column.width,
                                minWidth: column.minWidth,
                              },
                            })}
                          >
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
                            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Container>
        {!R.isEmpty(auditLogs) ? (
          <PaginationContainer>
            <Pagination count={meta?.totalPages} page={page} size="small" onChange={handleChange} />
          </PaginationContainer>
        ) : (
          <></>
        )}
        <DateRangeSelectorModal
          handleDateSelect={handleDateSelect}
          open={open}
          setOpen={setOpen}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />
      </>
    );
  },
);
const TableContainer = styled.div`
  width: 100%;
  font-family: Lato;
`;

const Container = styled.div`
  width: 100%;
  font-family: Lato;
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
  padding: 0 8px;
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
  align-items: center;
  // padding: 0px 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const TableText = styled.div`
  font-size: 14px;
`;
const TableHeaderText = styled.div`
  font-size: 14px;
  // width: fit-content;
`;

const PaginationContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  margin-bottom: 1em;
`;

const CustomSelectButton = styled.div`
  font-size: 12px;
  margin-left: 8px;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  padding: 0.5em;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.colors.backgroundGrey};
  }
`;
