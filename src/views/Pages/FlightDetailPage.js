import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";

import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import SweetAlert from "react-bootstrap-sweetalert";
import AddCompanyModal from "components/Modal/AddCompanyModal";
import EditCompanyModal from "components/Modal/EditCompanyModal";

import styles from "assets/jss/material-dashboard-pro-react/views/companyPageStyles.js";

import product1 from "assets/img/product1.jpg";
import avatar from "assets/img/faces/avatar.jpg";
import marc from "assets/img/faces/marc.jpg";
//firebase
import { useFirestoreCollection, useFirestore } from "reactfire";

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
  return (
    (d <= 9 ? "0" + d : d) +
    " " +
    monthNames[m] +
    " " +
    (h <= 9 ? "0" + h : h) +
    ":" +
    (mm <= 9 ? "0" + mm : mm)
  );
}

const useStyles = makeStyles(styles);

export default function FlightDetailPage() {
  const classes = useStyles();

  const { id } = useParams();
  let history = useHistory();
  const [FlightData, setFlightData] = useState();

  const firestore = useFirestore();
  const passengers = useFirestoreCollection(firestore.collection("passengers"));
  const lumoUpdate = useFirestoreCollection(
    firestore.collection("lumo_update")
  );
  firestore
    .collection("flights")
    .doc(id)
    .get()
    .then(result => setFlightData(result.data()));

  const tableValue = [];
  if (FlightData != null) {
    tableValue.push([
      "",
      FlightData.flight.carrier.name,
      FlightData.flight.number,
      FlightData.flight.aircraft_type.specific_description,
      FlightData.prediction.delay_index,
      FlightData.prediction.risk,
      FlightData.status.arrival.type,
      FlightData.status.cancelled + ""
    ]);
  }
  const table1Value = [];
  if (FlightData != null) {
    lumoUpdate.docs.map((row, key) => {
      if (FlightData.lumo.id === row.data().flight.id) {
        table1Value.push([
          "",
          dateToDMHM(new Date(row.data().alert.timestamp)),
          row.data().alert.change,
          row.data().summaries != undefined
            ? row.data().summaries.short.message
            : ""
        ]);
      }
    });
  }
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card className={classes.tableFont}>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Flights Table</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHead={[
                "",
                "NAME",
                "NUMBER",
                "SPECIFIC DESCRIPTION",
                "DELAY INDEX",
                "RISK",
                "TYPE",
                "CANCELLED"
              ]}
              tableData={tableValue}
              tableShopping
              customHeadCellClasses={[
                classes.center,
                classes.description,
                classes.description,
                classes.right,
                classes.left,
                classes.right
              ]}
              customCellClasses={[
                classes.tdName,
                classes.customFont,
                classes.customFont,
                classes.tdNumber,
                classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
                classes.tdNumber
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12}>
        <Card className={classes.tableFont}>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Lumo Updates</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHead={["", "TIME", "CHANGE", "SUMMARY"]}
              tableData={table1Value}
              tableShopping
              customHeadCellClasses={[
                classes.center,
                classes.description,
                classes.description,
                classes.right,
                classes.left,
                classes.right
              ]}
              customCellClasses={[
                classes.tdName,
                classes.customFont,
                classes.customFont,
                classes.tdNumber,
                classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
                classes.tdNumber
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
