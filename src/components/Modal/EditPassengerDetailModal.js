import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
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

const EditPassengerDetailModal = ({ open, onClose, data }: Props) => {
  const classes = useStyles();
  const { id } = useParams();
  //Form State
  const [dob, setDob] = useState("");
  const [dobState, setDobState] = useState("success");
  const [cob, setCob] = useState("");
  const [cobState, setCobState] = useState("success");
  const [cor, setCor] = useState("");
  const [corState, setCorState] = useState("success");

  useEffect(() => {
    setDob(data.dob);
    setCob(data.cob);
    setCor(data.cor);
  }, [data]);
  const fireStore = useFirestore();
  const passengers = useFirestoreCollection(fireStore.collection("passengers"));

  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length > length) {
      return true;
    }
    return false;
  };

  const onSubmithandle = event => {
    event.preventDefault();
    if (!verifyLength(cob, 0)) {
      setCobState("error");
    }
    if (!verifyLength(cor, 0)) {
      setCorState("error");
    }

    if (dob != "" && cob != "" && cor != "") {
      let passenger = fireStore.collection("passengers").doc(id);
      const personalData = {
        date_of_birth: dob,
        country_of_birth: cob,
        country_of_residence: cor,
        passenger: passenger
      };
      if (data.id != "") {
        fireStore
          .collection("personal_informations")
          .doc(data.id)
          .update(personalData);
      } else {
        fireStore.collection("personal_informations").add(personalData);
      }
      onClose();
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form className={classes.form} onSubmit={onSubmithandle}>
        <DialogTitle>{`Edit Company`}</DialogTitle>
        <DialogContent className={classes.dialogContainer}>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <Datetime
                value={dob}
                onChange={event => setDob(event.toDate())}
                closeOnSelect
                timeFormat={false}
                inputProps={{ placeholder: "Date of Birth" }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <CustomInput
                success={cobState === "success"}
                error={cobState === "error"}
                id="cob"
                labelText="Country of Birth"
                value={cob}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    event.persist();
                    if (verifyLength(event.target.value, 0)) {
                      setCobState("success");
                    } else {
                      setCobState("error");
                    }
                    setCob(event.target.value);
                  },
                  type: "text"
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <CustomInput
                success={corState === "success"}
                error={corState === "error"}
                id="cor"
                labelText="Country of Residence"
                value={cor}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    event.persist();
                    if (verifyLength(event.target.value, 0)) {
                      setCorState("success");
                    } else {
                      setCorState("error");
                    }
                    setCor(event.target.value);
                  },
                  type: "text"
                }}
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

export default EditPassengerDetailModal;
