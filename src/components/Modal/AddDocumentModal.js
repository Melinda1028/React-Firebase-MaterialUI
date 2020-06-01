import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router";
import Datetime from "react-datetime";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Input,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment
} from "@material-ui/core";

import Close from "@material-ui/icons/Close";

import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-dashboard-pro-react/views/companyPageStyles.js";

import { useFirestoreCollection, useFirestore } from "reactfire";

function dateToYMD(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1; //Month from 0 to 11
  var y = date.getFullYear();
  return "" + (m <= 9 ? "0" + m : m) + "/" + (d <= 9 ? "0" + d : d) + "/" + y;
}

const useStyles = makeStyles(styles);

const AddDocumentModal = ({ open, onClose }: Props) => {
  const { id } = useParams();
  const classes = useStyles();
  //Form State
  const [country, setCountry] = useState("");
  const [countryState, setCountryState] = useState("");
  const [docNo, setDocNo] = useState("");
  const [docNoState, setDocNoState] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [issueState, setIssueState] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryState, setExpiryState] = useState("");
  const [docType, setDocType] = useState("");
  const [docTypeState, setDocTypeState] = useState("");
  // const { register, handleSubmit ,errors } = useForm();
  const fireStore = useFirestore();
  const passengers = useFirestoreCollection(fireStore.collection("passengers"));

  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length > length) {
      return true;
    }
    return false;
  };
  // function that verifies if value contains only numbers
  const verifyNumber = value => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  const onSubmithandle = event => {
    event.preventDefault();
    if (docType === "") {
      setDocTypeState("error");
    }
    if (docNo === "") {
      setDocNoState("error");
    }
    if (country === "") {
      setCountry("error");
    }
    if (
      docType != "" &&
      docNo != "" &&
      country != "" &&
      issueDate != "" &&
      expiryDate != ""
    ) {
      let passenger = fireStore.collection("passengers").doc(id);
      fireStore.collection("identity_documents").add({
        document_type: docType,
        document_number: docNo,
        country: country,
        issue_date: issueDate,
        expiry_date: expiryDate,
        passenger: passenger
      });
      setDocNo("");
      setCountry("");
      setIssueDate("");
      setExpiryDate("");
      setDocType("");
      onClose();
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form className={classes.form} onSubmit={onSubmithandle}>
        <DialogTitle>{`Add Company`}</DialogTitle>
        <DialogContent className={classes.dialogContainer}>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel
                  htmlFor="simple-select"
                  className={classes.selectLabel}
                >
                  Document Type
                </InputLabel>
                <Select
                  success={docTypeState === "success"}
                  error={docTypeState === "error"}
                  MenuProps={{
                    className: classes.selectForm
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={docType}
                  inputProps={{
                    name: "simpleSelect",
                    id: "simple-select",
                    onChange: event => {
                      event.persist();
                      if (verifyLength(event.target.value, 0)) {
                        setDocTypeState("success");
                      } else {
                        setDocTypeState("error");
                      }
                      setDocType(event.target.value);
                    }
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    Choose Document Type
                  </MenuItem>
                  <MenuItem
                    key="0"
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="Passport"
                  >
                    Passport
                  </MenuItem>
                  <MenuItem
                    key="1"
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="Drivers License"
                  >
                    Drivers License
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <CustomInput
                success={docNoState === "success"}
                error={docNoState === "error"}
                id="credits"
                labelText="Document Number"
                value={docNo}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    event.persist();
                    if (verifyNumber(event.target.value)) {
                      setDocNoState("success");
                    } else {
                      setDocNoState("error");
                    }
                    setDocNo(event.target.value);
                  },
                  type: "number"
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <CustomInput
                success={countryState === "success"}
                error={countryState === "error"}
                id="name"
                labelText="Country"
                value={country}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    event.persist();
                    if (verifyLength(event.target.value, 0)) {
                      setCountryState("success");
                    } else {
                      setCountryState("error");
                    }
                    setCountry(event.target.value);
                  },
                  type: "text"
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <Datetime
                value={issueDate}
                onChange={event => setIssueDate(event.toDate())}
                closeOnSelect
                timeFormat={false}
                inputProps={{ placeholder: "Issue Date" }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <Datetime
                value={expiryDate}
                onChange={event => setExpiryDate(event.toDate())}
                closeOnSelect
                timeFormat={false}
                inputProps={{ placeholder: "Expiry Date" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            className={classes.button + " " + classes.danger}
          >
            Cancel
          </Button>
          <Button type="submit" className={classes.button + " " + classes.info}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDocumentModal;
