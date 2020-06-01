/*!

=========================================================
* Material Dashboard PRO React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useReducer } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";

//context
import AuthContext from "context/context/AuthContext";
import AuthReducer from "context/reducer/AuthReducer";
import { initialAuth } from "context/initialData";

import { FirebaseAppProvider, SuspenseWithPerf } from "reactfire";
import { firebaseConfig } from "variables/firebaseconf";

function MainScreen() {
  const [AuthState, AuthDispatch] = useReducer(AuthReducer, initialAuth);
  const hist = createBrowserHistory();
  return (
    <AuthContext.Provider value={{ AuthState, AuthDispatch }}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <Router history={hist}>
          <Switch>
            <Route path="/rtl" component={RtlLayout} />
            <Route path="/auth" component={AuthLayout} />
            <Route path="/admin" component={AdminLayout} />
            <Redirect from="/" to="/admin/dashboard" />
          </Switch>
        </Router>
      </FirebaseAppProvider>
    </AuthContext.Provider>
  );
}

export default MainScreen;
