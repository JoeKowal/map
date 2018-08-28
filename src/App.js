import React, { Component } from "react";
import "./App.css";
import { GoogleApiWrapper } from "google-maps-react";
import MapContainer from "./MapContainer";


class App extends Component {
  render() {
    return (
      <div id="App">
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAtJpL5Y60OmzyYz0EwBcJJOljZiqv_NII"
})(App);
