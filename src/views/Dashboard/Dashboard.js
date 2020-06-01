import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Refresh from "@material-ui/icons/Refresh";
import Edit from "@material-ui/icons/Edit";
import Place from "@material-ui/icons/Place";
import ArtTrack from "@material-ui/icons/ArtTrack";
import Language from "@material-ui/icons/Language";
import People from "@material-ui/icons/People";
import Business from "@material-ui/icons/Business";
import Flight from "@material-ui/icons/Flight";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

import priceImage1 from "assets/img/card-2.jpeg";
import priceImage2 from "assets/img/card-3.jpeg";
import priceImage3 from "assets/img/card-1.jpeg";

//firebase
import { useFirestoreCollection, useFirestore } from "reactfire";

const us_flag = require("assets/img/flags/US.png");
const de_flag = require("assets/img/flags/DE.png");
const au_flag = require("assets/img/flags/AU.png");
const gb_flag = require("assets/img/flags/GB.png");
const ro_flag = require("assets/img/flags/RO.png");
const br_flag = require("assets/img/flags/BR.png");

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const firestore = useFirestore();
  const passengers = useFirestoreCollection(firestore.collection("passengers"));
  const companies = useFirestoreCollection(firestore.collection("companies"));
  const flights = useFirestoreCollection(firestore.collection("flights"));
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <People />
              </CardIcon>
              <p className={classes.cardCategory}>PASSENGERS</p>
              <h3 className={classes.cardTitle}>{passengers.docs.length}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Business />
              </CardIcon>
              <p className={classes.cardCategory}>COMPANIES</p>
              <h3 className={classes.cardTitle}>{companies.docs.length}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Flight />
              </CardIcon>
              <p className={classes.cardCategory}>FLIGHTS</p>
              <h3 className={classes.cardTitle}>{flights.docs.length}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="success" icon>
              <CardIcon color="success">
                <Language />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>World Vector Map</h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="space-between">
                <GridItem xs={12} sm={12} md={12}>
                  <VectorMap
                    map={"world_mill"}
                    backgroundColor="transparent"
                    zoomOnScroll={false}
                    containerStyle={{
                      width: "100%",
                      height: "400px"
                    }}
                    containerClassName="map"
                    regionStyle={{
                      initial: {
                        fill: "#e4e4e4",
                        "fill-opacity": 0.9,
                        stroke: "none",
                        "stroke-width": 0,
                        "stroke-opacity": 0
                      }
                    }}
                    series={{
                      regions: [
                        {
                          values: mapData,
                          scale: ["#AAAAAA", "#444444"],
                          normalizeFunction: "polynomial"
                        }
                      ]
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
