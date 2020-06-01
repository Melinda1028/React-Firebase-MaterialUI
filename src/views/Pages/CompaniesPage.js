import React, { useState, useEffect } from "react";
import ReactTable from "react-table";
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

const useStyles = makeStyles(styles);

export default function CompaniesPage() {
  const [alert, setAlert] = React.useState(null);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    credits: "",
    administrator: {
      id: ""
    }
  });
  const [tableData, setTableData] = React.useState();
  const classes = useStyles();

  const firestore = useFirestore();
  const passengers = useFirestoreCollection(firestore.collection("passengers"));
  const companies = useFirestoreCollection(firestore.collection("companies"));

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
        Are you sure to delete this company data?
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
        The company data has been deleted.
      </SweetAlert>
    );
    firestore
      .collection("companies")
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
  const showEditModal = (data, id) => {
    data.id = id;
    setEditData(data);
    setEdit(true);
  };
  const hideEditModal = () => {
    setEdit(false);
  };
  useEffect(() => {
    setTableData(
      companies.docs.map((row, key) => {
        return {
          id: key,
          name: row.data().name,
          credits: row.data().credits,
          administrator: passengers.docs.map((passenger, i) =>
            passenger.id == row.data().administrator.id
              ? passenger.data().name
              : ""
          ),
          actions: (
            // we've added some custom button actions
            <div className="actions-right">
              {/* use this button to add a like kind of action */}
              <Button
                color="success"
                className={classes.actionButton}
                onClick={() => showEditModal(row.data(), row.id)}
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
        };
      })
    );
  }, [companies]);
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
  return (
    <GridContainer>
      <GridItem xs={12} align="right">
        <Button
          color="success"
          className={classes.marginRight}
          onClick={showAddModal}
        >
          <AddIcon className={classes.icons} /> New Company
        </Button>
      </GridItem>
      <GridItem xs={12}>
        <Card className={classes.tableFont}>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Companies Table</h4>
          </CardHeader>
          <CardBody>
            <ReactTable
              data={tableData}
              filterable
              columns={[
                {
                  Header: "NAME",
                  accessor: "name"
                },
                {
                  Header: "CREDITS",
                  accessor: "credits"
                },
                {
                  Header: "ADMINISTRATOR",
                  accessor: "administrator"
                },
                {
                  Header: "Actions",
                  accessor: "actions",
                  sortable: false,
                  filterable: false
                }
              ]}
              pageSize={companies.docs.length}
              // showPaginationTop
              // showPaginationBottom={false}
              showPagination={false}
              className="-striped -highlight"
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
              customClassesForCells={[2]}
              NoDataComponent={() => null}
              defaultFilterMethod={filterCaseInsensitive}
            />
          </CardBody>
        </Card>
      </GridItem>
      {alert}
      <AddCompanyModal open={add} onClose={hideAddModal} />
      <EditCompanyModal open={edit} onClose={hideEditModal} data={editData} />
    </GridContainer>
  );
}
