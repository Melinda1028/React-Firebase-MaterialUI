import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import ReactTable from "react-table";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Visibility from "@material-ui/icons/Visibility";
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
import AddDocumentModal from "components/Modal/AddDocumentModal";
import EditDocumentModal from "components/Modal/EditDocumentModal";
import EditPassengerDetailModal from "components/Modal/EditPassengerDetailModal";

import styles from "assets/jss/material-dashboard-pro-react/views/passengerPageStyles.js";

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
  var y = date.getFullYear();
  return (d <= 9 ? "0" + d : d) + " " + monthNames[m] + " " + y;
}

const useStyles = makeStyles(styles);

export default function PassengerDetailPage() {
  const { id } = useParams();
  const [checked, setChecked] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editDoc, setEditDoc] = useState(false);

  const [editData, setEditData] = useState({
    dob: "",
    cob: "",
    cor: ""
  });
  const [editDocData, setEditDocData] = useState({
    document_type: "",
    document_number: "",
    country: "",
    issue_date: "",
    expiry_date: ""
  });
  const [tableData, setTableData] = React.useState([]);
  const handleToggle = value => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  const classes = useStyles();

  const firestore = useFirestore();
  const passengers = useFirestoreCollection(firestore.collection("passengers"));
  const companies = useFirestoreCollection(firestore.collection("companies"));
  const personalInfo = useFirestoreCollection(
    firestore.collection("personal_informations")
  );
  const identityDoc = useFirestoreCollection(
    firestore.collection("identity_documents")
  );
  const alertDelete = id => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block" }}
        title="Are you sure?"
        onConfirm={() => successDelete(id)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
      >
        Are you sure to delete this document data?
      </SweetAlert>
    );
  };
  const successDelete = id => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block" }}
        title="Deleted!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
      >
        The document data has been deleted.
      </SweetAlert>
    );
    firestore
      .collection("identity_documents")
      .doc(id)
      .delete();
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const showAddModal = () => {
    setAdd(true);
  };
  const hideAddModal = () => {
    setAdd(false);
  };

  const tableValue = [];
  let personalData = {
    id: "",
    dob: "",
    cob: "",
    cor: ""
  };
  personalInfo.docs.map((row, key) => {
    if (row.data().passenger.id === id) {
      personalData = {
        id: row.id,
        dob: row.data().date_of_birth.toDate(),
        cob: row.data().country_of_birth,
        cor: row.data().country_of_residence
      };
      return tableValue.push([
        dateToDMHM(row.data().date_of_birth.toDate()),
        row.data().country_of_birth,
        row.data().country_of_residence
      ]);
    }
  });
  let docData = [];
  useEffect(() => {
    identityDoc.docs.map((row, key) => {
      if (row.data().passenger.id === id) {
        docData.push({
          id: key,
          document_type: row.data().document_type,
          document_number: row.data().document_number,
          country: row.data().country,
          issue_date: dateToDMHM(row.data().issue_date.toDate()),
          expiry_date: dateToDMHM(row.data().expiry_date.toDate()),
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
              {/* use this button to add a like kind of action */}
              <Button
                color="success"
                className={classes.actionButton}
                onClick={() => showEditDocModal(row.data(), row.id)}
              >
                <Edit className={classes.icon} />
              </Button>
              <Button
                color="danger"
                className={classes.actionButton}
                onClick={() => alertDelete(row.id)}
              >
                <Close className={classes.icon} />
              </Button>
            </div>
          )
        });
      }
    });
    setTableData(docData);
  }, [identityDoc]);
  const filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    const content = row[id];
    if (typeof content !== "undefined") {
      // filter by text in the table or if it's a object, filter by key
      if (typeof content === "object" && content !== null && content.key) {
        return String(content.key)
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      } else {
        return String(content)
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      }
    }

    return true;
  };
  const showEditModal = () => {
    setEditData(personalData);
    setEdit(true);
  };
  const hideEditModal = () => {
    setEdit(false);
  };
  const showEditDocModal = (data, id) => {
    data.id = id;
    setEditDocData(data);
    setEditDoc(true);
  };
  const hideEditDocModal = () => {
    setEditDoc(false);
  };
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card className={classes.tableFont}>
          <CardHeader color="rose" icon className={classes.cardHeader}>
            <CardIcon color="rose" className={classes.cardLeft}>
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle + " " + classes.cardLeft}>
              PERSONAL IMFORMATION
            </h4>
            <Button
              round
              color="success"
              className={classes.actionButton + " " + classes.cardRight}
              onClick={() => showEditModal()}
            >
              <Edit className={classes.cardIcon} />
            </Button>
          </CardHeader>
          <CardBody>
            <Table
              tableHead={[
                "DATE OF BIRTH",
                "COUNTRY OF BIRTH",
                "COUNTRY OF RESIDENCE"
              ]}
              tableData={tableValue}
              tableShopping
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} align="right">
        <Button
          color="success"
          className={classes.marginRight}
          onClick={showAddModal}
        >
          <AddIcon className={classes.icons} /> New Document
        </Button>
      </GridItem>
      <GridItem xs={12}>
        <Card className={classes.tableFont}>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Document Table</h4>
          </CardHeader>
          <CardBody>
            <ReactTable
              data={tableData}
              filterable
              columns={[
                {
                  Header: "DOCUMENT TYPE",
                  accessor: "document_type"
                },
                {
                  Header: "DOCUMENT NUMBER",
                  accessor: "document_number"
                },
                {
                  Header: "COUNTRY",
                  accessor: "country"
                },
                {
                  Header: "ISSUE DATE",
                  accessor: "issue_date"
                },
                {
                  Header: "EXPIRY DATE",
                  accessor: "expiry_date"
                },
                {
                  Header: "Actions",
                  accessor: "actions",
                  sortable: false,
                  filterable: false
                }
              ]}
              pageSize={tableData.length}
              showPagination={false}
              className="-striped -highlight"
              customHeadCellClasses={[
                classes.left,
                classes.description,
                classes.description,
                classes.right,
                classes.right,
                classes.right
              ]}
              customHeadClassesForCells={[0, 1, 2, 3, 4, 5]}
              customCellClasses={[
                classes.tdName,
                classes.customFont,
                classes.customFont,
                classes.tdNumber,
                classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
                classes.tdNumber
              ]}
              customClassesForCells={[0, 1, 2, 3, 4, 5]}
              NoDataComponent={() => null}
              defaultFilterMethod={filterCaseInsensitive}
            />
          </CardBody>
        </Card>
      </GridItem>

      {alert}
      <AddDocumentModal open={add} onClose={hideAddModal} />
      <EditDocumentModal
        open={editDoc}
        onClose={hideEditDocModal}
        data={editDocData}
      />
      <EditPassengerDetailModal
        open={edit}
        onClose={hideEditModal}
        data={editData}
      />
    </GridContainer>
  );
}
