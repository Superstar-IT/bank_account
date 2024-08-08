import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import * as React from "react";
import { getTransactions, saveTransaction } from "../services/api";
import Title from "./Title";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export default function Transitions() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [isDeposit, setIsDeposit] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [sortOrder, setSortOrder] = React.useState("desc");

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadTransactions = async () => {
    setLoading(true);
    await getTransactions()
      .then((list) => setTransactions(list))
      .finally(() => setLoading(false));
  };

  const handleNewTransactionClick = (change) => {
    setIsDeposit(change);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setAmount(0);
    setShowModal(false);
  };

  const handleSaveClick = async () => {
    setSaving(true);
    const newTransaction = await saveTransaction({
      amount: isDeposit ? Number(amount) : -1 * Number(amount),
    });
    setTransactions([newTransaction, ...transactions]);
    setShowModal(false);
    setSaving(false);
    setAmount(0);
  };

  React.useEffect(() => {
    loadTransactions();
  }, []);

  const visibleRows = React.useMemo(
    () =>
      transactions
        .sort(
          sortOrder === "desc"
            ? (a, b) => descendingComparator(a, b, "date")
            : (a, b) => -descendingComparator(a, b, "date")
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortOrder, page, rowsPerPage, transactions]
  );

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Title>Recent Transitions</Title>
        <ButtonGroup variant="contained">
          <Button onClick={() => handleNewTransactionClick(true)}>
            Deposit
          </Button>
          <Button onClick={() => handleNewTransactionClick(false)}>
            Withdrawal
          </Button>
        </ButtonGroup>
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sortDirection={sortOrder}>
                    <TableSortLabel
                      active
                      direction={sortOrder}
                      onClick={() =>
                        setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                      }
                    ></TableSortLabel>
                    Date
                  </TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell align="center">{transaction.date}</TableCell>
                    <TableCell align="center">
                      {transaction.amount < 0
                        ? transaction.amount
                        : `+${transaction.amount}`}
                    </TableCell>
                    <TableCell align="center">{transaction.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          ></TablePagination>
        </>
      )}
      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isDeposit ? "Deposit" : "Withdrawal"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ paddingY: 2 }}>
            <FormControl>
              <TextField
                id="amount"
                label="Amount"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            autoFocus
            loading={saving}
            // loadingPosition="start"
            variant="contained"
            onClick={handleSaveClick}
            disabled={!amount}
          >
            {isDeposit ? "Deposit" : "Withdrawal"}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
