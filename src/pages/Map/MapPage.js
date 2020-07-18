import React, { useState, useEffect } from "react";

import axios from "axios";
import LeafletMap from "./LeafletMap";
import DeliveryRoutes from "./DeliveryRoutes";
import Truck from "Icons/truck.png";

function MapPage() {
  // an array of routes for testing
  const test = [
    [{'latitude': 36.9264398, 'longitude': -121.7531546}, {'latitude': 37.220022, 'longitude': -121.846865}, {'latitude': 37.204775, 'longitude': -121.831414}, {'latitude': 37.208862, 'longitude': -121.852162}, {'latitude': 37.200639, 'longitude': -121.836549}, {'latitude': 37.235542, 'longitude': -121.848751}, {'latitude': 37.203119, 'longitude': -121.857549}, {'latitude': 37.235976, 'longitude': -121.810059}, {'latitude': 37.204459, 'longitude': -121.828867}, {'latitude': 37.195659, 'longitude': -121.843228}, {'latitude': 37.210068, 'longitude': -121.823281}, {'latitude': 37.206714, 'longitude': -121.858709}, {'latitude': 37.218533, 'longitude': -121.856209}, {'latitude': 37.22274, 'longitude': -121.849644}, {'latitude': 37.199574, 'longitude': -121.837836}, {'latitude': 37.20666, 'longitude': -121.845314}, {'latitude': 37.203976, 'longitude': -121.850973}, {'latitude': 37.20588, 'longitude': -121.827929}, {'latitude': 37.205476, 'longitude': -121.834037}, {'latitude': 37.210261, 'longitude': -121.828151}, {'latitude': 37.201104, 'longitude': -121.858722}, {'latitude': 37.209777, 'longitude': -121.848612}, {'latitude': 37.199313, 'longitude': -121.829092}, {'latitude': 37.212021, 'longitude': -121.840744}],
    [{'latitude': 36.9264398, 'longitude': -121.7531546}, {'latitude': 37.317809, 'longitude': -122.065478}, {'latitude': 37.3381255, 'longitude': -122.0300825}, {'latitude': 37.317469, 'longitude': -122.019218}, {'latitude': 37.318561507343, 'longitude': -122.065178270003}],
    // [{'latitude': 30.27657, 'longitude': -97.68505}, {'latitude': 30.29189, 'longitude': -97.72309}, {'latitude': 30.28613783, 'longitude': -97.74839433}, {'latitude': 30.25452, 'longitude': -97.743555}, {'latitude': 30.37651633, 'longitude': -97.78143783}, {'latitude': 30.23926, 'longitude': -97.74185}, {'latitude': 30.18962, 'longitude': -97.79325}, {'latitude': 30.24829, 'longitude': -97.76095}, {'latitude': 30.238587, 'longitude': -97.854023}, {'latitude': 30.23099, 'longitude': -97.77633}, {'latitude': 30.239882, 'longitude': -97.732218}, {'latitude': 30.402666, 'longitude': -97.741423}, {'latitude': 30.22379, 'longitude': -97.73543}, {'latitude': 30.333277, 'longitude': -97.560102}, {'latitude': 30.34557983, 'longitude': -97.73374883}, {'latitude': 30.33932, 'longitude': -97.75127}, {'latitude': 30.214492, 'longitude': -97.870316}, {'latitude': 30.4214, 'longitude': -97.69614}, {'latitude': 30.35849, 'longitude': -97.72837}, {'latitude': 30.427291, 'longitude': -97.68265}, {'latitude': 30.24944, 'longitude': -97.78423}, {'latitude': 30.31876, 'longitude': -97.742065}, {'latitude': 30.394376, 'longitude': -97.725481}, {'latitude': 30.23238, 'longitude': -97.90939}, {'latitude': 30.421767, 'longitude': -97.694001}, {'latitude': 30.24539, 'longitude': -97.68412}, {'latitude': 30.264846, 'longitude': -97.744214}, {'latitude': 30.438205, 'longitude': -97.674767}, {'latitude': 30.366892, 'longitude': -97.792987}, {'latitude': 30.17486, 'longitude': -97.79691}, {'latitude': 30.23530333, 'longitude': -97.71271833}, {'latitude': 30.233217, 'longitude': -97.76482}, {'latitude': 30.18287, 'longitude': -97.81968}, {'latitude': 30.29187, 'longitude': -97.70007}, {'latitude': 30.29245, 'longitude': -97.699994}, {'latitude': 30.30156, 'longitude': -97.75096}, {'latitude': 30.38676, 'longitude': -97.65582}, {'latitude': 30.24525, 'longitude': -97.75426}, {'latitude': 30.30047, 'longitude': -97.67625}, {'latitude': 30.37996967, 'longitude': -97.770365}, {'latitude': 30.293985, 'longitude': -97.704886}, {'latitude': 30.28267383, 'longitude': -97.74639217}, {'latitude': 30.2047, 'longitude': -97.86968}, {'latitude': 30.24856, 'longitude': -97.87503}, {'latitude': 30.18997, 'longitude': -98.0374}, {'latitude': 30.19073, 'longitude': -97.81217}, {'latitude': 30.28042, 'longitude': -97.79799}, {'latitude': 30.31781, 'longitude': -97.69872}, {'latitude': 30.28843, 'longitude': -97.71928}, {'latitude': 30.22887, 'longitude': -97.76211}, {'latitude': 30.23865, 'longitude': -97.76508}, {'latitude': 30.26254, 'longitude': -97.76191}, {'latitude': 30.312333, 'longitude': -97.696797}, {'latitude': 30.33742, 'longitude': -97.8109}, {'latitude': 30.29068, 'longitude': -97.700515}, {'latitude': 30.306536, 'longitude': -97.752095}, {'latitude': 30.29703317, 'longitude': -97.7004955}, {'latitude': 30.29716, 'longitude': -97.69985}, {'latitude': 30.26351, 'longitude': -97.87934}, {'latitude': 30.42016, 'longitude': -97.73153}, {'latitude': 30.27939, 'longitude': -97.71537}, {'latitude': 30.34088067, 'longitude': -97.78347567}, {'latitude': 30.298926, 'longitude': -97.707926}, {'latitude': 30.268931, 'longitude': -97.753224}, {'latitude': 30.20599, 'longitude': -97.78094}, {'latitude': 30.37733, 'longitude': -97.74779}, {'latitude': 30.28425, 'longitude': -97.87598}, {'latitude': 30.35752, 'longitude': -97.76575}, {'latitude': 30.2399, 'longitude': -97.76577}, {'latitude': 30.1644050218171, 'longitude': -97.8863264286856}, {'latitude': 30.21744, 'longitude': -97.89233}, {'latitude': 30.30903, 'longitude': -97.69694}, {'latitude': 30.23825217, 'longitude': -97.79043417}, {'latitude': 30.284455, 'longitude': -97.720995}, {'latitude': 30.27305, 'longitude': -97.72954}, {'latitude': 30.25750367, 'longitude': -97.77271533}, {'latitude': 30.23662633, 'longitude': -97.7637}, {'latitude': 30.214336, 'longitude': -97.88965}, {'latitude': 30.4222, 'longitude': -97.72505}, {'latitude': 30.273695, 'longitude': -97.74727167}, {'latitude': 30.26010167, 'longitude': -97.68292167}, {'latitude': 30.22562, 'longitude': -97.69487}, {'latitude': 30.35681, 'longitude': -97.76393}, {'latitude': 30.35701, 'longitude': -98.01034}, {'latitude': 30.395421, 'longitude': -97.727591}, {'latitude': 30.25974, 'longitude': -97.748877}, {'latitude': 30.27474, 'longitude': -97.72172}, {'latitude': 30.295383, 'longitude': -97.871094}, {'latitude': 30.27784, 'longitude': -97.842731}, {'latitude': 30.249656, 'longitude': -97.793848}, {'latitude': 30.22926033, 'longitude': -97.82609483}, {'latitude': 30.27859, 'longitude': -97.75263}, {'latitude': 30.30991, 'longitude': -97.72657}, {'latitude': 30.25570517, 'longitude': -97.74298833}, {'latitude': 30.21901517, 'longitude': -97.90460917}, {'latitude': 30.25265, 'longitude': -97.77128}, {'latitude': 30.25648, 'longitude': -97.67042}, {'latitude': 30.238394, 'longitude': -97.74006283}, {'latitude': 30.23173233, 'longitude': -97.83733317}, {'latitude': 30.27781, 'longitude': -97.76671}, {'latitude': 30.236192, 'longitude': -97.767871}, {'latitude': 30.45042, 'longitude': -97.77894}, {'latitude': 30.20604, 'longitude': -97.88472}, {'latitude': 30.24064, 'longitude': -97.6924}, {'latitude': 30.193751, 'longitude': -97.833232}, {'latitude': 30.31931, 'longitude': -97.71989}, {'latitude': 30.23252, 'longitude': -97.90689}, {'latitude': 30.251775, 'longitude': -97.757567}, {'latitude': 30.24002, 'longitude': -97.93467}, {'latitude': 30.21439, 'longitude': -97.80884}, {'latitude': 30.29331, 'longitude': -97.70817}, {'latitude': 30.273951, 'longitude': -97.793064}, {'latitude': 30.26777333, 'longitude': -97.75120833}, {'latitude': 30.30975, 'longitude': -97.75407}, {'latitude': 30.40444, 'longitude': -97.76541}, {'latitude': 30.23122, 'longitude': -97.77171}, {'latitude': 30.080375, 'longitude': -97.810324}, {'latitude': 30.37028583, 'longitude': -97.8076365}, {'latitude': 30.33649, 'longitude': -97.76091}, {'latitude': 30.398998, 'longitude': -97.723598}, {'latitude': 30.25302, 'longitude': -97.771822}, {'latitude': 30.2585, 'longitude': -97.71295}, {'latitude': 30.197911, 'longitude': -97.811867}, {'latitude': 30.243153, 'longitude': -97.77673}, {'latitude': 30.34602, 'longitude': -97.70242}, {'latitude': 30.223911, 'longitude': -97.953563}, {'latitude': 30.244592, 'longitude': -97.764058}, {'latitude': 30.394376, 'longitude': -97.725481}, {'latitude': 30.31375, 'longitude': -97.7452}, {'latitude': 30.257266, 'longitude': -97.73908}, {'latitude': 30.265321, 'longitude': -97.749521}, {'latitude': 30.268931, 'longitude': -97.753224}, {'latitude': 30.21301, 'longitude': -97.769573}, {'latitude': 30.282328, 'longitude': -97.809052}, {'latitude': 30.302065, 'longitude': -97.701854}, {'latitude': 30.28262, 'longitude': -97.76325}, {'latitude': 30.3829, 'longitude': -97.74769}, {'latitude': 30.18108, 'longitude': -97.89337}, {'latitude': 30.24194, 'longitude': -97.73368}, {'latitude': 30.2278485, 'longitude': -97.8285595}, {'latitude': 30.28143, 'longitude': -97.80664}, {'latitude': 30.271858, 'longitude': -97.753198}, {'latitude': 30.26900733, 'longitude': -97.75420467}, {'latitude': 30.25938517, 'longitude': -97.75678217}, {'latitude': 30.156632, 'longitude': -97.804773}, {'latitude': 30.38458, 'longitude': -97.83182}, {'latitude': 30.247068, 'longitude': -97.846258}, {'latitude': 30.236084, 'longitude': -97.772672}, {'latitude': 30.23115, 'longitude': -97.7131}, {'latitude': 30.3972, 'longitude': -97.6509}, {'latitude': 30.25058333, 'longitude': -97.77259}, {'latitude': 30.244148, 'longitude': -97.818267}, {'latitude': 30.23822367, 'longitude': -97.78675833}, {'latitude': 30.197423, 'longitude': -97.917315}, {'latitude': 30.35895, 'longitude': -97.75476}, {'latitude': 30.24127, 'longitude': -98.07174}, {'latitude': 30.316734, 'longitude': -97.780364}, {'latitude': 30.224851, 'longitude': -97.90254}, {'latitude': 30.25116, 'longitude': -97.77195}, {'latitude': 30.30568, 'longitude': -97.68168}, {'latitude': 30.244891, 'longitude': -97.766132}, {'latitude': 30.36079, 'longitude': -97.72291}, {'latitude': 30.362014, 'longitude': -97.745852}, {'latitude': 30.260484, 'longitude': -97.723743}, {'latitude': 30.38354, 'longitude': -97.76394}, {'latitude': 30.35873, 'longitude': -97.68213}, {'latitude': 30.244878, 'longitude': -97.738627}, {'latitude': 30.25938517, 'longitude': -97.75678217}, {'latitude': 30.244148, 'longitude': -97.818267}, {'latitude': 30.22113, 'longitude': -97.92884}, {'latitude': 30.33234, 'longitude': -97.76402}, {'latitude': 30.3629, 'longitude': -97.71001}, {'latitude': 30.282833, 'longitude': -97.775143}, {'latitude': 30.21476, 'longitude': -97.80699}, {'latitude': 30.23402167, 'longitude': -97.790894}, {'latitude': 30.202351, 'longitude': -97.834415}, {'latitude': 30.27409, 'longitude': -97.69564}, {'latitude': 30.278913, 'longitude': -97.761885}, {'latitude': 30.257095, 'longitude': -97.73977333}, {'latitude': 30.33498, 'longitude': -97.72926}, {'latitude': 30.491, 'longitude': -97.70239}, {'latitude': 30.154935, 'longitude': -97.745101}, {'latitude': 30.42246933, 'longitude': -97.709553}, {'latitude': 30.404, 'longitude': -97.72087}, {'latitude': 30.228023, 'longitude': -97.846845}, {'latitude': 30.239536, 'longitude': -97.78649617}, {'latitude': 30.29418, 'longitude': -97.69698}, {'latitude': 30.31314167, 'longitude': -97.69391833}, {'latitude': 30.29561, 'longitude': -97.76306}, {'latitude': 30.16949, 'longitude': -97.81844}, {'latitude': 30.240907, 'longitude': -97.7780805}, {'latitude': 30.26254, 'longitude': -97.76191}, {'latitude': 30.29507, 'longitude': -97.702477}, {'latitude': 30.32573, 'longitude': -97.77069}, {'latitude': 30.27835, 'longitude': -97.68888}, {'latitude': 30.31049, 'longitude': -97.75333}, {'latitude': 30.31784, 'longitude': -97.66688}, {'latitude': 30.31269, 'longitude': -97.86531}]
  ];

  // has a bunch of [latitude, longitude] values for testing
  const ROUTE_API =
    "https://wrguk721j7.execute-api.us-west-1.amazonaws.com/dev/api/v1/deliveryRoute";

  const [isLoading, setIsLoading] = useState(true);
  // will there ever be a case where there are more drivers than locations?
  const [drivers, setDrivers] = useState(3); // useState(DRIVER_COUNT)
  const [routes, setRoutes] = useState([]);
  const [timeSlot, setTimeSlot] = useState(-1); // useState(TIME_SLOT)
  const [times, setTimes] = useState([
    {value: "00 am - 00 pm"}, 
    {value: "01 am - 01 pm"},
    {value: "02 am - 02 pm"},
    {value: "03 am - 03 pm"},
    {value: "04 am - 04 pm"},
  ]); // useState(GET_ROUTE_TIMES)

  useEffect(() => {
    createRoutes();
  }, []);

  const createRoutes = () => {
    // plotting markers & lines for test routes
    let tempRoutes = [];
    for (let set of test) {
      let tempRoute = [];
      let index = 0;
      for (let coord of set) {
        if (index < set.length - 1) {
          // console.log("0", coord);
          // console.log(set.length, set[index + 1]);

          let fromLatitude = coord["latitude"];
          let fromLongitude = coord["longitude"];
          let toLatitude = set[index + 1]["latitude"];
          let toLongitude = set[index + 1]["longitude"];
          tempRoute.push({
            from: [fromLatitude, fromLongitude],
            to: [toLatitude, toLongitude],
          });
        }
        index++;
      }
      tempRoutes.push(tempRoute);
    }
    setRoutes(tempRoutes);
    setIsLoading(false);
    
    // axios
    //   .get(ROUTE_API)
    //   .then((response) => {
    //     // console.log(response);
    //     if (response.status === 200) {
    //       const result = [...response.data.result];
    //       // cut off head & tail of result, since those values are the HQ location value
    //       const routes = result.slice(1, result.length - 1);
    //       // determine average routes per driver
    //       const routesPerDriver = Math.floor(routes.length / drivers);
    //       const extraRoutes = routes.length % drivers; // extras will be distributed as evenly as possible

    //       // console.log(routes);
    //       let tempRoutes = [];
    //       let index = 0;
    //       for (let i = 0; i < drivers; i++) {
    //         let tempRoute = [];
    //         // if driver is to be assigned an extra route, lengthen the loop by 1 iteration
    //         let driverRoutes =
    //           i < extraRoutes ? routesPerDriver + 1 : routesPerDriver;
    //         for (let j = 0; j < driverRoutes; j++) {
    //           // destination coords
    //           let toLatitude = routes[index].latitude;
    //           let toLongitude = routes[index].longitude;
    //           // beginning coords, if first route then begin from HQ coords
    //           let fromLatitude = !j
    //             ? result[0].latitude
    //             : routes[index - 1].latitude;
    //           let fromLongitude = !j
    //             ? result[0].longitude
    //             : routes[index - 1].longitude;
    //           tempRoute.push({
    //             from: [fromLatitude, fromLongitude],
    //             to: [toLatitude, toLongitude],
    //           });
    //           index++;
    //           // console.log("index:", index);
    //         }
    //         tempRoutes.push(tempRoute);
    //       }
    //       // console.log("temp:", tempRoutes);
    //       setRoutess(tempRoutes);
    //       setIsLoading(false);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err.response ? err.response : err);
    //   });
  };

  return (
    <React.Fragment>
      {!isLoading && (
        <React.Fragment>
          <div className="header">
            <img className="has-text-left" src={Truck} alt="Just Delivered" style={{alignSelf: "center"}} />
            <p className="is-size-3 has-text-centered" style={{width: "100%"}}>ADMIN DASHBOARD - DELIVERY</p>
          </div>
          <div className="map-page">
            <RouteTimes {...{times: times, timeSlot: timeSlot, setTimeSlot: setTimeSlot}} />
            <div className="columns" style={{ margin: "auto" }}>
              <div className="column is-half" style={{ padding: "0" }}>
                <div className="sticky">
                  {/* <div className="columns routes" style={{margin: "0"}}>
                    {times.map((time, idx) => (
                      <div key={idx} className="column" style={{maxWidth: `${100/times.length}%`}}>
                        <button className="button is-fullwidth is-small">{time.value}</button>
                      </div>
                    ))}
                  </div> */}
                  <LeafletMap routes={routes} />
                </div>
              </div>
              <div className="column is-half" style={{ padding: "0 0.75rem" }}>
                <DeliveryRoutes routes={routes} />
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

function RouteTimes(props) {
  const handleTimeChange = (index) => {
    // console.log(index);
    if (props.timeSlot !== index) props.setTimeSlot(index);
  }

  return (
    <div className="columns routes" style={{margin: "0"}}>
      {props.times.map((time, idx) => (
        <div key={idx} className="column" style={{maxWidth: `${100/props.times.length}%`}}>
          <button className="button is-fullwidth is-small" onClick={() => handleTimeChange(idx)} style={{ backgroundColor: props.timeSlot === idx && "yellow" }}>{time.value}</button>
        </div>
      ))}
    </div>
  );
}

export default MapPage;
