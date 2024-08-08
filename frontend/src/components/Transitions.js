import * as React from "react";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
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
  IconButton,
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
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { getTransactions, saveTransaction } from "../services/api";
import Title from "./Title";

const dialogTitle = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "transfer",
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function Transitions() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [transactionType, setTransactionType] = React.useState(null);

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
    setTransactionType(change);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setAmount(0);
    setShowModal(false);
    setTransactionType(null);
  };

  const handleSaveClick = async () => {
    setSaving(true);
    if (transactionType !== "transfer") {
      const newTransaction = await saveTransaction({
        amount:
          transactionType === "deposit" ? Number(amount) : -1 * Number(amount),
      });
      setTransactions([newTransaction, ...transactions]);
    }

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
          <Button onClick={() => handleNewTransactionClick("deposit")}>
            Deposit
          </Button>
          <Button onClick={() => handleNewTransactionClick("withdrawal")}>
            Withdrawal
          </Button>
          <Button onClick={() => handleNewTransactionClick("transfer")}>
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
                    <TableCell align="center">
                      {moment(transaction.date).format("DD.MM.YYYY")}
                    </TableCell>
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
            ActionsComponent={TablePaginationActions}
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
          {dialogTitle[transactionType]}
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
            variant="contained"
            onClick={handleSaveClick}
            disabled={!amount}
          >
            {dialogTitle[transactionType]}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
