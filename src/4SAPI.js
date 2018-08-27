const clientID = "4WF10KCYXV50UIMEQZGOXTL4UN5KWY1SGQC3FIDYIURXEE24";
const clientSecret = "HHEH5MHUZDXN4F041KCSNPUXDX21SMMRA0FDAOKEZVFYIJXX";

const urlForId = (lat, lng, name) =>
  `https://api.foursquare.com/v2/venues/search?ll=${lat},${lng}&query=${name}&limit=1&client_id=${clientID}&client_secret=${clientSecret}&v=20180802`;

const urlForDetails = id =>
  `https://api.foursquare.com/v2/venues/${id}?&client_id=${clientID}&client_secret=${clientSecret}&v=20180802`;

// venue ID, then details
export const getVenueDetails = (lat, lng, name) =>
  fetch(urlForId(lat, lng, name))
    .then(res => res.json())
    .then(data => {
      if (data.response.venues[0]) {
        let venueId = data.response.venues[0].id;
        return fetch(urlForDetails(venueId))
          .then(res => res.json())
          .catch(err => console.error(err));
      }
    })
    .catch(err => console.error(err));
