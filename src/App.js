import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import MapPage from "pages/Map/MapPage";

function App() {
  console.log("rendering app..");
  
  return (
    <Router basename={"Delivery-App"}>
      <Switch>
        <Route exact path="/" component={MapPage} />
        {/* <Route component={ErrorPage} /> 
          <Redirect to="/404" /> */}
      </Switch>
    </Router>
  );
}

export default App;
