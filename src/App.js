import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DashboardPage from "pages/Admin/DashboardPage";

function App() {
  console.log("rendering app..");
  
  return (
    <Router basename={"Delivery-App"}>
      <Switch>
        <Route exact path="/" component={DashboardPage} />
        {/* <Route component={ErrorPage} /> 
          <Redirect to="/404" /> */}
      </Switch>
    </Router>
  );
}

export default App;
