import "date-fns";
import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Select,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import Autocomplete from "@material-ui/lab/Autocomplete";
//Expand import
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import { Alert, AlertTitle } from "@material-ui/lab";
import { useFirestoreCollection, useFirestore } from "reactfire";

import airlinecodes from "static/airlines";
import aiportcodes from "static/airports";

function dateToYMD(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1; //Month from 0 to 11
  var y = date.getFullYear();
  return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
}
function dateToDMHM(date) {
  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var d = date.getDate();
  var m = date.getMonth();
  var h = date.getHours();
  var mm = date.getMinutes();
  return d + " " + monthNames[m] + " " + h + ":" + (mm <= 9 ? "0" + mm : mm);
}
function beautyDate(string) {
  return string.substring(0, string.length - 6);
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: "8px 40px",
    overflow: "hidden"
  },
  rowContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  root: {
    width: "100%"
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  head: {
    backgroundColor: "lavender",
    color: theme.palette.common.white
  },
  alert: {
    marginBottom: theme.spacing(1)
  }
}));

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: "block"
  }
}))(MuiExpansionPanelDetails);

//main
const AddFlightModal = ({ open, onClose }: Props) => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);
  //Form State
  const [airline1, setAirline1] = useState();
  const [airline2, setAirline2] = useState();
  const [flight1airport, setFlight1airport] = useState();
  const [flight2airport, setFlight2airport] = useState("");
  const [flightno1, setFlightno1] = useState();
  const [flightno2, setFlightno2] = useState();
  const [email, setEmail] = useState();
  const [flight1Data, setFlight1Data] = useState();
  const [flight2Data, setFlight2Data] = useState();
  const [flight1Status, setFlight1Status] = useState(true);
  const [flight2Status, setFlight2Status] = useState(true);
  const [time1, setTime1] = useState();
  const [time2, setTime2] = useState();
  const [currentError, setCurrentError] = useState(false);
  //useFirebase
  const fireStore = useFirestore();
  let emailCache = [],
    airlineCache = [],
    airportCache = [];
  fireStore
    .collection("passengers")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        emailCache.push({
          title: doc.data().email + " (" + doc.id + ") ",
          key: doc.data().email
        });
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });

  //airline, airport
  Object.keys(airlinecodes).forEach(function eachKey(key) {
    airlineCache.push({
      title: airlinecodes[key] + " (" + key + ")",
      key: key
    });
  });
  Object.keys(aiportcodes).forEach(function eachKey(key) {
    airportCache.push({ title: aiportcodes[key] + " (" + key + ")", key: key });
  });

  //Date state
  const [selectedDate, setSelectedDate] = React.useState(dateToYMD(new Date()));

  const handleDateChange = date => {
    setSelectedDate(dateToYMD(date));
  };
  //expand state
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => async (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // FlightLookUp
  const handleFlightLookup = async data => {
    let flight1 = {
      airport: data.flight1airport.key,
      airline: data.airline1.key,
      flightno: data.flightno1,
      depdate: data.selectedDate
    };
    console.log(flight1);
    await fetch("/handler/checkFlight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(flight1)
    }).then(data => {
      if (data.status != 200) {
        setFlight1Status(false);
        setFlight1Data();
        setFlight2airport();
      } else {
        data.json().then(result => {
          setFlight1Status(true);
          const dt1 = new Date(result.arrival);
          setTime1(dt1.getTime());
          let obj = airportCache.find(o => o.key === result.destination);
          setFlight2airport(obj);
          setFlight1Data(result);
        });
      }
    });
  };

  useEffect(() => {
    if (airline1 != null && flight1airport != null && flightno1 != null) {
      if (typeof airline1 == "object" && typeof flight1airport == "object") {
        handleFlightLookup({
          flight1airport: flight1airport,
          airline1: airline1,
          flightno1: flightno1,
          selectedDate: selectedDate
        });
      } else setFlight1Status(false);
    }
  }, [airline1, flight1airport, flightno1]);

  useEffect(() => {
    if (airline2 != null && flight2airport != null && flightno2 != null) {
      const flight2 = {
        airport: flight2airport.key,
        airline: airline2.key,
        flightno: flightno2,
        depdate: selectedDate
      };
      fetch("/handler/checkFlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flight2)
      }).then(data => {
        if (data.status != 200) {
          setFlight2Status(false);
          setFlight2Data();
        } else {
          data.json().then(result => {
            setFlight2Data(result);
            setFlight2Status(true);
            const dt2 = new Date(result.departure);
            setTime2(dt2.getTime());
          });
        }
      });
    }
  }, [airline2, flight2airport, flightno2]);

  //setopen
  const SetOpen = () => {
    setOpen(true);
  };
  const onSubmithandle = async e => {
    e.preventDefault();
    if (flight1Status == true && flight2Status == true) handleNext();
  };
  const handleSave = () => {
    const date = new Date();
    fireStore
      .collection("passengers")
      .where("email", "==", email.key)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          fireStore.collection("queue_flight").add({
            _created: date,
            airline1: airline1 == null ? "" : airline1.key,
            airline2: airline2 == null ? "" : airline2.key,
            depdatestring: selectedDate,
            email: email.key,
            flight1airport: flight1airport == null ? "" : flight1airport.key,
            flight2airport: flight2airport == null ? "" : flight2airport.key,
            flightno1: flightno1,
            flightno2: flightno2 == null ? "" : flightno2,
            passengerRef: doc.id
          });
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
    onClose();
    handleBack();
    setAirline1();
    setAirline2();
    setFlight1airport();
    setFlight2airport();
    setFlightno1();
    setFlightno2();
    setEmail();
    setFlight1Data();
    setFlight2Data();
  };
  //stepper
  const getSteps = () => {
    return ["Register Flights", "Confirm Flights Detail"];
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <Autocomplete
                  freeSolo
                  id="combo-box-demo"
                  options={emailCache}
                  getOptionLabel={option => option.title}
                  onChange={(e, v) => setEmail(v)}
                  value={email}
                  disableOpenOnFocus
                  autoHighlight
                  renderInput={params => (
                    <TextField
                      {...params}
                      name="email"
                      label="Passenger email address"
                      variant="outlined"
                      placeholder="name@email.com"
                      required
                      InputProps={{ ...params.InputProps }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <br />
            <h4>Flight #1</h4>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy-MM-dd"
                    margin="normal"
                    id="date-picker-inline"
                    label="Departure Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                    fullWidth
                    required
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            {flight1Status == false ? (
              <Alert severity="error" className={classes.alert}>
                Could not find this flight.
              </Alert>
            ) : (
              <br />
            )}
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <Autocomplete
                  freeSolo
                  id="combo-box-demo"
                  options={airlineCache}
                  getOptionLabel={option => option.title}
                  onChange={(e, v) => setAirline1(v)}
                  value={airline1}
                  autoHighlight
                  disableOpenOnFocus
                  renderInput={params => (
                    <TextField
                      {...params}
                      name="airline1"
                      required
                      label="Airline"
                      variant="outlined"
                      placeholder="American Airlines or AA"
                      InputProps={{ ...params.InputProps, type: "search" }}
                      onChange={v => setFlight1Status()}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <TextField
                  label="Flight Number"
                  type="text"
                  fullWidth
                  autoFocus
                  placeholder="1 or 001"
                  name="flightno1"
                  variant="outlined"
                  required
                  onChange={v => setFlightno1(v.target.value)}
                  value={flightno1}
                />
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <Autocomplete
                  freeSolo
                  id="combo-box-demo"
                  options={airportCache}
                  getOptionLabel={option => option.title}
                  onChange={(e, v) => setFlight1airport(v)}
                  value={flight1airport}
                  disableOpenOnFocus
                  autoHighlight
                  renderInput={params => (
                    <TextField
                      {...params}
                      name="flight1airport"
                      required
                      label="Departing Airport"
                      variant="outlined"
                      placeholder="London Heathrow or LHR"
                      InputProps={{ ...params.InputProps, type: "search" }}
                      onChange={v => setFlight1Status()}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={8} alignItems="flex-end">
              <Grid item md={true} sm={true} xs={true}>
                <ExpansionPanel
                  square
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}
                >
                  <ExpansionPanelSummary
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                  >
                    <Typography>I am connecting to another flight</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <h4>Flight #2</h4>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item md={true} sm={true} xs={true}>
                        <Autocomplete
                          freeSolo
                          id="combo-box-demo"
                          options={airlineCache}
                          getOptionLabel={option => option.title}
                          onChange={(e, v) => setAirline2(v)}
                          value={airline2}
                          disableOpenOnFocus
                          autoHighlight
                          renderInput={params => (
                            <TextField
                              {...params}
                              name="airline2"
                              label="Airline"
                              variant="outlined"
                              placeholder="American Airlines or AA"
                              InputProps={{
                                ...params.InputProps,
                                type: "search"
                              }}
                              onChange={v => setFlight2Status()}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item md={true} sm={true} xs={true}>
                        <TextField
                          label="Flight Number"
                          type="text"
                          fullWidth
                          autoFocus
                          placeholder="1 or 001"
                          name="flightno2"
                          variant="outlined"
                          onChange={v => setFlightno2(v.target.value)}
                          value={flightno2}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                      <Grid item md={true} sm={true} xs={true}>
                        <Autocomplete
                          freeSolo
                          id="combo-box-demo"
                          options={airportCache}
                          getOptionLabel={option => option.title}
                          onChange={(e, v) => setFlight2airport(v)}
                          value={flight2airport}
                          disableOpenOnFocus
                          autoHighlight
                          renderInput={params => (
                            <TextField
                              {...params}
                              name="flight2airport"
                              label="Departing Airport"
                              variant="outlined"
                              placeholder="London Heathrow or LHR"
                              InputProps={{
                                ...params.InputProps,
                                type: "search"
                              }}
                              onChange={v => setFlight2Status()}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                {flight2Status == false ? (
                  <Alert severity="error">Could not find this flight.</Alert>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Table size="medium">
              <TableBody>
                <TableRow>
                  <TableCell>Passenger Email</TableCell>
                  <TableCell>{email == null ? "" : email.key}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Departure Date</TableCell>
                  <TableCell>
                    {selectedDate == null ? "" : selectedDate}
                  </TableCell>
                </TableRow>
                <h4>Flight 1</h4>
                <TableRow>
                  <TableCell>Flight</TableCell>
                  <TableCell>
                    {flightno1 != null &&
                    typeof airline1 == "object" &&
                    airline1 != null
                      ? airline1.key + " " + flightno1
                      : " "}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Origin</TableCell>
                  <TableCell>
                    {flight1airport == null ? "" : flight1airport.key}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Destination</TableCell>
                  <TableCell>
                    {flight1Data == null ? "" : flight1Data.destination}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Departure</TableCell>
                  <TableCell>
                    {flight1Data == null
                      ? ""
                      : dateToDMHM(new Date(beautyDate(flight1Data.departure)))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Arrival</TableCell>
                  <TableCell>
                    {flight1Data == null
                      ? ""
                      : dateToDMHM(new Date(beautyDate(flight1Data.arrival)))}
                  </TableCell>
                </TableRow>
                <h4>Connection Time</h4>
                <TableRow>
                  <TableCell>Time Between Flights:</TableCell>
                  <TableCell>
                    {time2 == null
                      ? ""
                      : Math.abs(Math.round((time2 - time1) / 60000 / 60)) +
                        " h " +
                        Math.abs(Math.round(((time2 - time1) / 60000) % 60)) +
                        " m"}
                  </TableCell>
                </TableRow>
                <h4>Flight 2</h4>
                <TableRow>
                  <TableCell>Flight</TableCell>
                  <TableCell>
                    {flightno2 != null &&
                    typeof airline2 == "object" &&
                    airline2 != null
                      ? airline2.key + " " + flightno2
                      : " "}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Origin</TableCell>
                  <TableCell>
                    {flight2airport == null ? "" : flight2airport.key}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Destination</TableCell>
                  <TableCell>
                    {flight2Data == null ? "" : flight2Data.destination}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Departure</TableCell>
                  <TableCell>
                    {flight2Data == null
                      ? ""
                      : dateToDMHM(new Date(beautyDate(flight2Data.departure)))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Arrival</TableCell>
                  <TableCell>
                    {flight2Data == null
                      ? ""
                      : dateToDMHM(new Date(beautyDate(flight2Data.arrival)))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        );
      default:
        return "Unknown step";
    }
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form className={classes.form} method="Post" onSubmit={onSubmithandle}>
        <DialogTitle>{`Add Flight`}</DialogTitle>
        <DialogContent className={classes.container}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>

          {activeStep == 0 ? (
            <Button
              color="primary"
              type="submit"
              //onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            ""
          )}
          {activeStep == 1 ? (
            <>
              <Button color="primary" onClick={handleBack}>
                Back
              </Button>
              <Button
                color="primary"
                type="button"
                variant="contained"
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          ) : (
            ""
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddFlightModal;
