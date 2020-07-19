import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { AuthUser } from '../context';
import { TextField, FormControl, Select, MenuItem, FormHelperText, Button, Grid } from '@material-ui/core';
import '../index.css';
const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'screenName', label: 'Screen Name', minWidth: 100 },
    {
        id: 'followersCount',
        label: 'Followers Count',
        minWidth: 170,
        // align: 'right',
        // format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'followingCount',
        label: 'Following Count',
        minWidth: 170,
        // align: 'right',
        // format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'location',
        label: 'Location',
        minWidth: 170,
        // align: 'right',
        // format: (value) => value.toFixed(2),
    },
    {
        id: 'verified',
        label: 'Verified',
        minWidth: 170,
        // align: 'right',
        // format: (value) => value.toFixed(2),
    },
];
const operator = [
    {
        id: 'none',
        label: 'None'
    },
    {
        id: 'or',
        label: 'OR'
    },
    {
        id: 'and',
        label: 'AND'
    }
];
const queryColumn = [
    { id: 'name', label: 'Name', type: "string" },
    { id: 'screenName', label: 'Screen Name', type: 'string' },
    {
        id: 'followersCount',
        label: 'Followers Count',
        type: 'number'
        // align: 'right',
        // format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'followingCount',
        label: 'Following Count',
        type: 'number'
        // align: 'right',
        // format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'location',
        label: 'Location',
        type: 'string'
        // align: 'right',
        // format: (value) => value.toFixed(2),
    },
    {
        id: 'verified',
        label: 'Verified',
        type: 'boolean'
        // align: 'right',
        // format: (value) => value.toFixed(2),
    },
];
const condition = {
    "string": [
        {
            id: 'contains',
            label: "Contains"
        }
    ],
    "number": [
        {
            id: ">=",
            label: ">="
        },
        {
            id: "<=",
            label: "<="
        },
        {
            id: ">",
            label: ">"
        },
        {
            id: "<",
            label: "<"
        },
        {
            id: "!=",
            label: "!="
        },
        {
            id: "equals",
            label: "equals"
        }
    ],
    "boolean": [
        {
            id: "equals",
            label: "equals"
        },
        {
            id: "!=",
            label: "!="
        }
    ]
}

// function createData(name, code, population, size) {
//     const density = population / size;
//     return { name, code, population, size, density };
// }

// const rows = [

// ];

// const useStyles = makeStyles({
//   root: {
//     width: '100%',
//   },
//   container: {
//     maxHeight: 440,
//   },
// });

class FilterTable extends React.Component {

    constructor() {
        super();
        this.state = {
            page: 0,
            rowsPerPage: 5,
            tableData: [],
            query: []
        }
    }
    //   const classes = useStyles();
    componentDidMount() {
        let contextValue = this.context;
        this.setState({
            tableData: contextValue.filterData.tableData
        })
    }

    handleChangePage = (event, newPage) => {
        this.setState(
            { page: newPage }
        );
    };

    handleChangeRowsPerPage = (event) => {

        this.setState({
            page: 0,
            rowsPerPage: event.target.value
        });
    };
    handleQuery = (name, value, index) => {
        let state = this.state;
        let query = state.query.map((queryField, order) => {
            if (name === 'tableColumn' && order === index) {
                let table_col = queryColumn.filter(filter_col => filter_col.id === value)[0];
                queryField[name] = value;
                queryField.conditionSelectValue = condition[table_col.type];
                queryField.columnType = table_col.type;
            }
            else if (order === index) {
                queryField[name] = value;
            }
            return queryField;
        })
        this.setState({
            query
        })
    }
    addQuery = () => {
        let queryField = {
            operator: "",
            tableColumn: "",
            condition: "",
            value: "",
            conditionSelectValue: [],
            columnType: "",
            errorMsg: {
                operator: "This field is required",
                tableColumn: "This field is required",
                condition: "This field is required",
                value: "This field is required",
            },
            error: {
                operator: false,
                tableColumn: false,
                condition: false,
                value: false,
            }

        };
        let state = this.state;
        if (state.query.length === 0) {
            delete queryField.operator;
            delete queryField.errorMsg.operator;
            delete queryField.error.operator;
        }
        let query = state.query;
        query.push(queryField);
        this.setState({
            query
        })
    }
    submitQuery = () => {
        let contextValue = this.context;
        let tableData = contextValue.filterData.tableData;
        let query = this.state.query;
        // console.log(query)
        if (query.length > 0) {
            let check = false;
            query = query.map(errorfield => {
                if (typeof errorfield.operator !== 'undefined') {
                    if (errorfield.operator.trim().length === 0) {
                        check = true;
                        errorfield.error.operator = true;
                    } else {
                        errorfield.error.operator = false;
                    }
                }
                if (errorfield.tableColumn.trim().length === 0) {
                    check = true;
                    errorfield.error.tableColumn = true;
                } else {
                    errorfield.error.tableColumn = false;
                }
                if (errorfield.condition.trim().length === 0) {
                    check = true;
                    errorfield.error.condition = true;
                } else {
                    errorfield.error.condition = false;
                }
                if (errorfield.value.trim().length === 0) {
                    check = true;
                    errorfield.error.value = true;
                } else {
                    errorfield.error.value = false;
                }
                return errorfield;
            })
            if (check === false) {
                let filterValue = '';
                query.map(data => {
                    let condition = '';
                    let value = '';
                    let operator = '';
                    if (data.condition === "equals") {
                        condition = '===';
                    } else if (data.condition === "!=") {
                        condition = '!==';
                    } else {
                        condition = data.condition;
                    }
                    if (data.columnType === "string") {
                        value = `'${data.value}'`;
                    } else if (data.columnType === "number") {
                        value = data.value;
                    } if (data.columnType === "boolean") {
                        if (data.value === 'yes') {
                            value = true;
                        } else {
                            value = false;
                        }
                    }
                    if (data.operator === "and") {
                        operator = '&&'
                    } else if (data.operator === "or") {
                        operator = '||'
                    }
                    if (data.condition === "contains") {
                        filterValue = filterValue.concat(`${operator} filterQueryValue.${data.tableColumn}.includes(${value}) `);
                    } else {
                        filterValue = filterValue.concat(`${operator} filterQueryValue.${data.tableColumn} ${condition} ${value} `);
                    }
                    return data;
                });
                tableData = tableData.filter(filterQueryValue => eval(filterValue));
            }

        } else {
            alert('please select query')
        }
        this.setState({
            tableData, query
        });
    }
    deleteQuery = (index) => {
        let state = this.state;
        let query = state.query.filter((data, order) => index !== order);
        this.setState({
            query
        }, () => {
            this.submitQuery();
        })

    }
    render() {
        return (
            <Paper >
                <Grid container item className="tablePadding">
                    <Grid container item className="tableShadow filterTable">

                    
                    <Paper className="paperWidth">
                        <TableContainer className="tableScroll">
                            <Table>

                                <TableBody>
                                    {this.state.query.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{index === 0 ? "where" :
                                                    <FormControl className="filterConditionBoxWidth">
                                                        <Select
                                                            id="outlined-select-currency-native"
                                                            value={row?.operator}
                                                            onChange={(e) => this.handleQuery('operator', e.target.value, index)}
                                                            selectprops={{
                                                                native: true,
                                                            }}
                                                            inputProps={{
                                                                style: { color: "rgba(0, 0, 0, 0.7)", fontSize: "14px" }

                                                            }}
                                                            margin="dense"
                                                            variant="outlined"
                                                            style={{ width: '100%' }}
                                                            displayEmpty

                                                        >
                                                            {
                                                                operator.map(operate => (
                                                                    <MenuItem key={operate.id} disabled={operate.id === "none" ? true : false} value={operate.id}>
                                                                        {operate.label}
                                                                    </MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                        {row?.error?.operator ? <FormHelperText style={{ color: "red" }}>{row?.errorMsg?.operator}</FormHelperText> : ''}
                                                    </FormControl>
                                                }</TableCell>
                                                <TableCell>
                                                    <FormControl className="filterSelectBoxWidth">
                                                        <Select
                                                            id="outlined-select-currency-native"
                                                            value={row?.tableColumn}
                                                            onChange={(e) => this.handleQuery('tableColumn', e.target.value, index)}
                                                            selectprops={{
                                                                native: true,
                                                            }}
                                                            inputProps={{
                                                                style: { color: "rgba(0, 0, 0, 0.7)", fontSize: "14px",width:"120px" }

                                                            }}
                                                            margin="dense"
                                                            variant="outlined"
                                                            style={{ width: '100%' }}
                                                            displayEmpty

                                                        >
                                                            {
                                                                queryColumn.map(query_col => (
                                                                    <MenuItem key={query_col.id} disabled={query_col.id === "none" ? true : false} value={query_col.id}>
                                                                        {query_col.label}
                                                                    </MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                        {row?.error?.tableColumn ? <FormHelperText style={{ color: "red" }}>{row?.errorMsg?.tableColumn}</FormHelperText> : ''}
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell>
                                                    <FormControl className="filterConditionBoxWidth">
                                                        <Select
                                                            id="outlined-select-currency-native"
                                                            value={row?.condition}
                                                            onChange={(e) => this.handleQuery('condition', e.target.value, index)}
                                                            selectprops={{
                                                                native: true,
                                                            }}
                                                            inputProps={{
                                                                style: { color: "rgba(0, 0, 0, 0.7)", fontSize: "14px" }

                                                            }}
                                                            margin="dense"
                                                            variant="outlined"
                                                            style={{ width: '100%' }}
                                                            displayEmpty

                                                        >
                                                            {
                                                                row?.conditionSelectValue.map(condition_val => (
                                                                    <MenuItem key={condition_val.id} disabled={condition_val.id === "none" ? true : false} value={condition_val.id}>
                                                                        {condition_val.label}
                                                                    </MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                        {row?.error?.condition ? <FormHelperText style={{ color: "red" }}>{row?.errorMsg?.condition}</FormHelperText> : ''}
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        row?.columnType.trim().length === 0 ?
                                                            <>
                                                                <TextField
                                                                    id="outlined-select-currency-native"
                                                                    type="text"
                                                                    //    label={eventData?.placeholder}
                                                                    //    helperText={eventData?.error ? eventData?.errorMsg : ''}
                                                                    //    error={eventData?.error ? true : false}
                                                                    // value={row?.value}
                                                                    // onChange={(e) => this.handleQuery('value', e.target.value, index)}
                                                                    selectprops={{
                                                                        native: true,
                                                                    }}
                                                                    inputProps={{
                                                                        style: { color: "rgba(0, 0, 0, 0.7)", fontSize: "14px",width:"120px" }

                                                                    }}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    style={{ width: '100%' }}


                                                                />
                                                                {row?.error?.value ? <FormHelperText style={{ color: "red" }}>{row?.errorMsg?.value}</FormHelperText> : ''}
                                                            </>
                                                            : ""
                                                    }
                                                    {
                                                        row?.columnType === "number" ?
                                                            <>
                                                                <TextField
                                                                    id="outlined-select-currency-native"
                                                                    type="number"
                                                                    //    label={eventData?.placeholder}
                                                                    //    helperText={eventData?.error ? eventData?.errorMsg : ''}
                                                                    //    error={eventData?.error ? true : false}
                                                                    value={row?.value}
                                                                    onChange={(e) => this.handleQuery('value', e.target.value, index)}
                                                                    selectprops={{
                                                                        native: true,
                                                                    }}
                                                                    inputProps={{
                                                                        style: { color: "rgba(0, 0, 0, 0.7)", fontSize: "14px",width:"120px" }

                                                                    }}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    style={{ width: '100%' }}
                                                                    onInput={(e) => {
                                                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                                    }}

                                                                />
                                                                {row?.error?.value ? <FormHelperText style={{ color: "red" }}>{row?.errorMsg?.value}</FormHelperText> : ''}

                                                            </>
                                                            : ""
                                                    }
                                                    {
                                                        row?.columnType === "string" ?
                                                            <>
                                                                <TextField
                                                                    id="outlined-select-currency-native"
                                                                    //    label={eventData?.placeholder}
                                                                    //    helperText={eventData?.error ? eventData?.errorMsg : ''}
                                                                    //    error={eventData?.error ? true : false}
                                                                    type="string"
                                                                    value={row?.value}
                                                                    onChange={(e) => this.handleQuery('value', e.target.value, index)}
                                                                    selectprops={{
                                                                        native: true,
                                                                    }}
                                                                    inputProps={{
                                                                        style: { color: "rgba(0, 0, 0, 0.7)", fontSize: "14px",width:"120px" }

                                                                    }}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    style={{ width: '100%' }}
                                                                //    disabled={data.see}

                                                                />
                                                                {row?.error?.value ? <FormHelperText style={{ color: "red" }}>{row?.errorMsg?.value}</FormHelperText> : ''}

                                                            </>
                                                            : ""
                                                    }
                                                    {
                                                        row?.columnType === "boolean" ?
                                                            <FormControl className="filterConditionBoxWidth">
                                                                <Select
                                                                    id="outlined-select-currency-native"
                                                                    value={row?.value}
                                                                    onChange={(e) => this.handleQuery('value', e.target.value, index)}
                                                                    selectprops={{
                                                                        native: true,
                                                                    }}
                                                                    inputProps={{
                                                                        style: { color: "rgba(0, 0, 0, 0.7)", fontSize: "14px" }

                                                                    }}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    style={{ width: '100%' }}
                                                                    displayEmpty

                                                                >
                                                                    <MenuItem key="yes" value="yes">
                                                                        YES
                                                                    </MenuItem>
                                                                    <MenuItem key="no" value="no">
                                                                        NO
                                                                    </MenuItem>


                                                                </Select>
                                                                {row?.error?.value ? <FormHelperText style={{ color: "red" }}>{row?.errorMsg?.value}</FormHelperText> : ''}

                                                            </FormControl>
                                                            : ""
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        index === 0 ? "" : <Button variant="contained" color="secondary" onClick={() => this.deleteQuery(index)}>
                                                        Delete
                                                    </Button>
                                                    }

                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                         
                        </TableContainer>
                  
                    </Paper>
                    <Grid item container className="filterBtn">
                                <Button variant="contained" color="primary" onClick={() => this.addQuery()}>
                                    Action
                                </Button> &nbsp; &nbsp;
                                <Button variant="contained" color="secondary" onClick={() => this.submitQuery()}>
                                    Submit
                                </Button>
                            </Grid>
                    </Grid>
                </Grid>
                <Grid container item className="tablePadding">
                    <Grid item container className="tableShadow">
                    <TableContainer >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.tableData.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{row?.name}</TableCell>
                                        <TableCell>{row?.screenName}</TableCell>
                                        <TableCell>{row?.followersCount}</TableCell>
                                        <TableCell>{row?.followingCount}</TableCell>
                                        <TableCell>{row?.location}</TableCell>
                                        <TableCell>{row?.verified ? 'true' : 'false'}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination className="paginationWidthSet"
                    rowsPerPageOptions={[5, 10, 15]}
                    // component="div"
                    count={this.state.tableData.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                    </Grid>
                </Grid>
            </Paper>
        );
    }

}
FilterTable.contextType = AuthUser;
export default FilterTable;