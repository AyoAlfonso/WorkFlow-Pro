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
import { CSVLink } from "react-csv";
import Modal from "styled-react-modal";
import { AnnualInitiativeModalContent } from "../goals/annual-initiative/annual-initiative-modal-content";
import { QuarterlyGoalModalContent } from "../goals/quarterly-goal/quarterly-goal-modal-content";
import { SubInitiativeModalContent } from "../goals/sub-initiative/sub-initiaitive-modal-content";
import { Button } from "~/components/shared/button";

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
    const [objectInView, setObjectInView] = useState<string>("");
    const [objectInViewConfirm, setObjectInViewConfirm] = useState<boolean>(true);
    const [annualInitiativeId, setAnnualInitiativeId] = useState<number>(null);
    const [quarterlyGoalId, setQuarterlyGoalId] = useState<number>(null);
    const [subInitiativeId, setSubInitiativeId] = useState<number>(null);
    const [annualInitiativeDescription, setSelectedAnnualInitiativeDescription] = useState<string>(
      "",
    );
    const [objectId, setObjectId] = useState<number>(null);

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
      companyStore.load().then(() => setOwnerId(companyStore.company?.id));
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

    const setFilteredAuditLogs = logs => {
      let filteredLogs;
      if (ownerType == "company") {
        filteredLogs = logs.filter(log => log.companyId == ownerId);
        setAuditLogs(filteredLogs);
      } else if (ownerType == "user") {
        filteredLogs = logs.filter(log => log.userId == ownerId);
        setAuditLogs(filteredLogs);
      } else {
        filteredLogs = logs.filter(log => log.teamId == ownerId);
        setAuditLogs(filteredLogs);
      }
    };

    const getLogs = pageNumber => {
      if (page === pageNumber) return;

      setLoading(true);
      return auditLogStore.getAudit(`page/${pageNumber}?per=10`).then(res => {
        const { userActivityLogs, meta } = res;
        let filteredLogs;
        setMeta(meta);
        setPage(meta.currentPage);
        setLoading(false);
        setFilteredAuditLogs(userActivityLogs);
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
            item: { itemId: auditLog.itemId, controller: auditLog.controller },
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
          Header: () => <TableHeaderText> Item </TableHeaderText>,
          accessor: "item",
          Cell: ({ value }) => {
            <Button
              small
              variant={"primary"}
              onClick={() => {
                setObjectInView(value.controller);
                setObjectId(value.item);
              }}
              // style={{}}
            >
              View Item with ID {value}
            </Button>;
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
      if (e == "all") {
        setLoading(true);
        auditLogStore.getAudit(`page/1?per=10`).then(res => {
          setFilteredAuditLogs(res.userActivityLogs);
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
          setFilteredAuditLogs(res.userActivityLogs);
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
          setFilteredAuditLogs(res.userActivityLogs);
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
          setFilteredAuditLogs(res.userActivityLogs);
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
          setFilteredAuditLogs(res.userActivityLogs);
          setMeta(res.meta);
          setLoading(false);
        });
      }
    };

    const handleDateSelect = ranges => {
      const startDate = moment(ranges.selection.startDate).format("YYYY-MM-DD");
      const endDate = moment(ranges.selection.endDate).format("YYYY-MM-DD");
      setLoading(true);
      auditLogStore.getAudit(`?from=${startDate}&to=${endDate}`).then(res => {
        setFilteredAuditLogs(res.userActivityLogs);
        setMeta(res.meta);
        setLoading(false);
      });
      setOpen(false);
    };

    const csvData = auditLogs.map(auditLog => {
      return {
        user: auditLog.userId,
        action: formatAction(auditLog.action),
        controller: formatAction(auditLog.controller),
        note: auditLog.note,
        ipAddress: auditLog.ipAddress,
        browser: auditLog.browser,
        createdAt: auditLog.createdAt,
      };
    });

    const csvHeaders = [
      { label: "User", key: "user" },
      { label: "Action", key: "action" },
      { label: "Controller", key: "controller" },
      { label: "Note", key: "note" },
      { label: "IP Address", key: "ipAddress" },
      { label: "Browser", key: "browser" },
      { label: "Created At", key: "createdAt" },
    ];

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
              <TopRow>
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
                  <CsvButton filename="Audit-Logs.csv" data={csvData} headers={csvHeaders}>
                    Download as CSV
                  </CsvButton>
                </SelectContainer>
              </TopRow>
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
        {!R.isEmpty(auditLogStore.auditLogs) ? (
          <PaginationContainer>
            <Pagination count={meta?.totalPages} page={page} size="small" onChange={handleChange} />
          </PaginationContainer>
        ) : (
          <></>
        )}

        {objectInView == "annual_initiatives" ? (
          <StyledModal
            isOpen={true}
            style={{ width: "60rem", height: "800px", maxHeight: "90%", overflow: "auto" }}
            onBackgroundClick={e => {
              setObjectInView("");
            }}
          >
            <AnnualInitiativeModalContent
              annualInitiativeId={objectId}
              setAnnualInitiativeModalOpen={setObjectInViewConfirm}
              setQuarterlyGoalModalOpen={setObjectInViewConfirm}
              setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
              setQuarterlyGoalId={setQuarterlyGoalId}
            />
          </StyledModal>
        ) : objectInView == "quarterly_goals" ? (
          <StyledModal
            isOpen={true}
            style={{ width: "60rem", height: "800px", maxHeight: "90%", overflow: "auto" }}
            onBackgroundClick={e => {
              setObjectInView("");
            }}
          >
            <QuarterlyGoalModalContent
              quarterlyGoalId={objectId}
              setQuarterlyGoalModalOpen={setObjectInViewConfirm}
              setAnnualInitiativeId={setAnnualInitiativeId}
              annualInitiativeDescription={""}
              setAnnualInitiativeModalOpen={setObjectInViewConfirm}
              showCreateMilestones={true}
              setSubInitiativeId={setSubInitiativeId}
              setSubInitiativeModalOpen={setObjectInViewConfirm}
              setSelectedAnnualInitiativeDescription={setSelectedAnnualInitiativeDescription}
            />
          </StyledModal>
        ) : objectInView == "sub_initiatives" ? (
          <StyledModal
            isOpen={true}
            style={{ width: "60rem", height: "800px", maxHeight: "90%", overflow: "auto" }}
            onBackgroundClick={e => {
              setObjectInView("");
            }}
          >
            <SubInitiativeModalContent
              subInitiativeId={objectId}
              setSubInitiativeModalOpen={setObjectInViewConfirm}
              annualInitiativeDescription={""}
              setAnnualInitiativeId={setAnnualInitiativeId}
              showCreateMilestones={true}
            />
          </StyledModal>
        ) : (
          <> </>
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

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
  width: 100%;
  align-items: center;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-grow: 1;
`;
const StyledModal = Modal.styled`
  width: 30rem;
  min-height: 100px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.white};
`;
const CsvButton = styled(CSVLink)`
  margin-left: auto;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  font-size: 12px;
  border-radius: 4px;
  padding: 0.5em;
  &:hover {
    background: ${props => props.theme.colors.primary100};
    color: ${props => props.theme.colors.white};
    border: 1px solid ${props => props.theme.colors.primary100};
  }
`;

const CustomSelectButton = styled.div`
  font-size: 12px;
  margin-left: 8px;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  padding: 0.5em;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.colors.primary100};
    color: ${props => props.theme.colors.white};
    border: 1px solid ${props => props.theme.colors.primary100};
  }
`;
