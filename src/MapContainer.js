import React, { Component } from "react";
import { Map, InfoWindow, Marker } from "google-maps-react";
import * as FoursquareAPI from "./FoursquareAPI";

class MapContainer extends Component {
  state = {
    locations: [
      {
        name: "Breckenridge Brewery & Pub",
        position: { lat: 39.476223, lng: -106.043869 },
        showMarker: true
      },
      {
        name: "Briar Rose Chophouse & Saloon",
        position: { lat: 39.482061, lng: -106.045401 },
        showMarker: true
      },
      {
        name: "Downstairs at Eric's",
        position: { lat: 39.481813, lng: -106.046367 },
        showMarker: true
      },
      {
        name: "Grand Timber Lodge",
        position: { lat: 39.476, lng: -106.053304 },
        showMarker: true
      },
      {
        name: "Valdoro Mountain Lodge",
        position: { lat: 39.477114, lng: -106.049887 },
        showMarker: true
      },
      {
        name: "The Blue Stag Saloon",
        position: { lat: 39.478596, lng: -106.045724 },
        showMarker: true
      },
      {
        name: "Relish",
        position: { lat: 39.480799, lng: -106.046448 },
        showMarker: true
      },
      {
        name: "Lomax Placer Mine",
        position: { lat: 39.483629, lng: -106.052915 },
        showMarker: true
      }
    ],
    placePicURL: "",
    hours: "",
    activeMarker: {},
    showInfoWindow: false,
    selectedPlace: {},
    query: ""
  };

  // Get info from Foursquare
  chosenPinInfo = (lat, lng, name) => {
    FoursquareAPI.getVenueDetails(lat, lng, name).then(res => {
      if (res) {
        if (!res.response.venue.hours) {
          this.setState({
            placePicURL: `${res.response.venue.bestPhoto.prefix}250x150${
              res.response.venue.bestPhoto.suffix
            }`,
            hours: "Hours not detailed"
          });
        } else {
          this.setState({
            placePicURL: `${res.response.venue.bestPhoto.prefix}250x150${
              res.response.venue.bestPhoto.suffix
            }`,
            hours: `${res.response.venue.hours.status}`
          });
        }
      } else if (!res) {
        this.setState({
          placePicURL: "Doh!",
          hours: "The hours of operation did not load."
        });
      }
    });
  };

  clickListInfoWindow = evt => {
    this.setState({
      placePicURL: "",
      hours: ""
    });
    this.setState({
      selectedPlace: this.refs[evt.target.id].props,
      activeMarker: this.refs[evt.target.id].marker,
      showInfoWindow: true
    });
    this.chosenPinInfo(
      this.refs[evt.target.id].props.position.lat,
      this.refs[evt.target.id].props.position.lng,
      this.refs[evt.target.id].props.name
    );
    this.refs[evt.target.id].marker.setAnimation(
      this.props.google.maps.Animation.BOUNCE
    );
    setTimeout(this.refs[evt.target.id].marker.setAnimation(null), 700);
  };

  // when a marker is clicked window opens
  onInfoWindow = (venue, marker) => {
    this.setState({
      placePicURL: "",
      hours: ""
    });
    this.setState({
      selectedPlace: venue,
      activeMarker: marker,
      showInfoWindow: true
    });
    this.chosenPinInfo(venue.position.lat, venue.position.lng, venue.name);
  };

  // outside click closes current open window
  offInfoWindow = map => {
    if (this.state.showInfoWindow) {
      this.setState({
        showInfoWindow: false,
        activeMarker: null
      });
    }
  };

  // filter list of places
  updateQueryList = query => {
    this.setState({ query });
    if (query) {
      this.setState(prevState => ({
        locations: prevState.locations.map(
          location =>
            location.name.toLowerCase().includes(query.toLowerCase())
              ? Object.assign(location, { showMarker: true })
              : Object.assign(location, { showMarker: false })
        )
      }));
    } else if (!query) {
      this.setState(prevState => ({
        locations: prevState.locations.map(location =>
          Object.assign(location, { showMarker: true })
        )
      }));
    }
  };

  render() {
    const {
      locations,
      placePicURL,
      hours,
      activeMarker,
      showInfoWindow,
      selectedPlace,
      query
    } = this.state;

    const mapCenter = {
      lat: 39.4782868,
      lng: -106.0495105
    };

    return (
      <div>
        <div id="menu-container">
          <input
            type="checkbox"
            tabIndex="0"
            onKeyPress={this.checkboxByEnter}
            aria-label="menu"
            id="menu-toggle"
          />
          <span id="bars" className="bar1" />
          <span id="bars" className="bar2" />
          <span id="bars" className="bar3" />
          <div id="menu">
            <div id="search-container">
              <input
                id="search-places"
                type="text"
                placeholder="Location Search"
                aria-label="Input to filter locations"
                value={query}
                onChange={evt => this.updateQueryList(evt.target.value)}
              />
            </div>
            <ul id="place-list">
              {locations
                .filter(location => location.showMarker === true)
                .map(location => (
                  <li
                    tabIndex="0"
                    role="menuitem"
                    aria-label={location.name}
                    className="place"
                    id={location.name}
                    key={location.name}
                    onClick={this.clickListInfoWindow}
                    onKeyPress={this.keyPressInfoWindow}
                  >
                    {location.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <Map
          google={this.props.google}
          onClick={this.offInfoWindow}
          ref={"map"}
          initialCenter={mapCenter}
          zoom={16}
        >
          {locations
            .filter(location => location.showMarker === true)
            .map(location => (
              <Marker
                onClick={this.onInfoWindow}
                name={location.name}
                key={location.name}
                position={location.position}
                ref={location.name}
              />
            ))}
          <InfoWindow marker={activeMarker} visible={showInfoWindow}>
            <div tabIndex="0" id="info-window">
              <h3 aria-hidden="true" id="info-name">
                {selectedPlace.name}
              </h3>
              {placePicURL === "err" ? (
                <p>The image did not load.</p>
              ) : (
                <img id="info-img" src={placePicURL} alt={selectedPlace.name} />
              )}
              <p id="info-text">{hours}</p>
            </div>
          </InfoWindow>
        </Map>
        <p tabIndex="0" id="data-source">
          Additional Information provided by Foursquare API
        </p>
      </div>
    );
  }
}

export default MapContainer;
