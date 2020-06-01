import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

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

import styles from "assets/jss/material-dashboard-pro-react/views/passengerPageStyles.js";

import { useFirestoreCollection, useFirestore } from "reactfire";

const useStyles = makeStyles(styles);

const AddPassengerModal = ({ open, onClose }: Props) => {
  const classes = useStyles();
  //Form State
  const [name, setName] = useState("");
  const [nameState, setNameState] = useState("");
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberState, setPhoneNumberState] = useState("");
  const [companySelect, setCompanySelect] = useState("");
  const [selectState, setSelectState] = useState("");
  // const { register, handleSubmit ,errors } = useForm();
  const fireStore = useFirestore();
  const companies = useFirestoreCollection(fireStore.collection("companies"));

  const verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
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
    if (nameState === "") {
      setNameState("error");
    }
    if (emailState === "") {
      setEmailState("error");
    }
    if (phoneNumber === "") {
      setPhoneNumberState("error");
    }
    if (selectState === "") {
      setSelectState("error");
    }
    if (
      nameState === "success" &&
      emailState === "success" &&
      phoneNumberState === "success" &&
      selectState === "success"
    ) {
      let company =
        companySelect == ""
          ? ""
          : fireStore.collection("companies").doc(companySelect);
      fireStore.collection("passengers").add({
        authId: "",
        name: name,
        email: email,
        mobile: phoneNumber,
        company: company
      });
      onClose();
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form className={classes.form} onSubmit={onSubmithandle}>
        <DialogTitle>{`Add Passenger`}</DialogTitle>
        <DialogContent className={classes.dialogContainer}>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <CustomInput
                success={nameState === "success"}
                error={nameState === "error"}
                id="name"
                labelText="Name"
                value={name}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    event.persist();
                    if (verifyLength(event.target.value, 0)) {
                      setNameState("success");
                    } else {
                      setNameState("error");
                    }
                    setName(event.target.value);
                  },
                  type: "text"
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <CustomInput
                success={emailState === "success"}
                error={emailState === "error"}
                id="email"
                labelText="Email"
                value={email}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    event.persist();
                    if (verifyEmail(event.target.value)) {
                      setEmailState("success");
                    } else {
                      setEmailState("error");
                    }
                    setEmail(event.target.value);
                  },
                  type: "email"
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <CustomInput
                success={phoneNumberState === "success"}
                error={phoneNumberState === "error"}
                id="phoneNumber"
                labelText="PhoneNumber"
                value={phoneNumber}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    event.persist();
                    if (verifyNumber(event.target.value)) {
                      setPhoneNumberState("success");
                    } else {
                      setPhoneNumberState("error");
                    }
                    setPhoneNumber(event.target.value);
                  },
                  type: "number"
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} alignItems="flex-end">
            <Grid item md={true} sm={true} xs={true}>
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel
                  htmlFor="simple-select"
                  className={classes.selectLabel}
                >
                  Choose Companies
                </InputLabel>
                <Select
                  success={selectState === "success"}
                  error={selectState === "error"}
                  MenuProps={{
                    className: classes.selectForm
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={companySelect}
                  inputProps={{
                    name: "simpleSelect",
                    id: "simple-select",
                    onChange: event => {
                      event.persist();
                      if (verifyLength(event.target.value, 0)) {
                        setSelectState("success");
                      } else {
                        setSelectState("error");
                      }
                      setCompanySelect(event.target.value);
                    }
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    Choose Companies
                  </MenuItem>
                  {companies.docs.map((row, i) => (
                    <MenuItem
                      key={i}
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={row.id}
                    >
                      {row.data().name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default AddPassengerModal;
