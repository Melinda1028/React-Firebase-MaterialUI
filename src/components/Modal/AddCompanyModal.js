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

import styles from "assets/jss/material-dashboard-pro-react/views/companyPageStyles.js";

import { useFirestoreCollection, useFirestore } from "reactfire";

const useStyles = makeStyles(styles);

const AddCompanyModal = ({ open, onClose }: Props) => {
  const classes = useStyles();
  //Form State
  const [name, setName] = useState("");
  const [nameState, setNameState] = useState("");
  const [credits, setCredits] = useState("");
  const [creditsState, setCreditsState] = useState("");
  const [administratorSelect, setAdministratorSelect] = useState("");
  const [selectState, setSelectState] = useState("");
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
    if (nameState === "") {
      setNameState("error");
    }
    if (creditsState === "") {
      setCreditsState("error");
    }
    if (selectState === "") {
      setSelectState("error");
    }
    if (
      nameState === "success" &&
      creditsState === "success" &&
      selectState === "success"
    ) {
      let administrator =
        administratorSelect == ""
          ? ""
          : fireStore.collection("companies").doc(administratorSelect);
      fireStore.collection("companies").add({
        name: name,
        credits: credits,
        administrator: administrator
      });
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
                success={creditsState === "success"}
                error={creditsState === "error"}
                id="credits"
                labelText="Credits"
                value={credits}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    event.persist();
                    if (verifyNumber(event.target.value)) {
                      setCreditsState("success");
                    } else {
                      setCreditsState("error");
                    }
                    setCredits(event.target.value);
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
                  Choose Administrator
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
                  value={administratorSelect}
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
                      setAdministratorSelect(event.target.value);
                    }
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    Choose Administrator
                  </MenuItem>
                  {passengers.docs.map((row, i) => (
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

export default AddCompanyModal;
