import React, {useEffect, useRef, useState} from "react";
import './App.css';
import GoogleMapComponent from "./Components/googleMap";
// import LocationSearchInput from "./Components/Places";


// // pre css styling
// var googleMapwidth = null;
// var googleMapheight = null;

function App() {

  // ! DISABLED zoom control, can be removed

  // const [zoomControlEnabled, setZoomControlEnabled] = useState(false);
  // const [marker, setMarker] = useState({position: { lat: null, lng: null }});
  // const [removeMarker, setRemoveMarker] = useState(false);
  // const [drawPath, setDrawPath] = useState(false);
  // const [diameter, setDiameter] = useState(null);
  // const [canavsOuterLayoutStyle, setCanavsOuterLayoutStyle] = useState(null);
  // const [googleMapffset, setGoogleMapffset] = useState({widthOffset:null, heightOffset:null});

  // const [delPath, setDelPath] = useState(false);
  // const [drawingPoints, setDrawingPoints] = useState([]);
  // const [submittedPath, setSubmittedPath] = useState(false);

  // // ! map reference when created
  // const [map, setMap] = useState(null);

  // // ! reference to the map-layout div tag
  // const map_layout = useRef(null);

  // // ? Access the width and height properties of the div element
  // useEffect(() => {
  //   if (map_layout.current) {
  //     // Access the width and height properties of the div element
  //     const width = map_layout.current.offsetWidth;
  //     const height = map_layout.current.offsetHeight;

  //     googleMapwidth = width;
  //     googleMapheight = height;
  //   }
  // }, []);


  
  // // * adding marker button
  // function addMarker() {
  //   setZoomControlEnabled(!zoomControlEnabled);

  // }

  // // * remvoing maker button
  // function clearMarker() {
  //   if ( marker.position.lat !== null && marker.position.lng !== null) {
  //     setRemoveMarker(!removeMarker);
  //   }
  // }

  

  // // * draw path button
  // function lockPath() {

  //   if ( marker.position.lat !== null && marker.position.lng !== null) {
  //     setDrawPath(!drawPath);
  //     setDrawingPoints([]);
  //   }
  // }


  // // * delete path button
  // function handlePathDelete() {
  //   setDelPath(prev => !prev);
  //   setDrawingPoints([]);
  // };

  // // * submit path button
  // function submittedPathBtn() {
  //   setSubmittedPath(!submittedPath);
  //   setDrawPath(!drawPath);
  //   setMarker({ position: { lat: null, lng: null } }); // ! REMOVES MARKER FROM SCREEN

  // }

  // // * refreshes the page
  // const handleRefresh = () => {
  //   window.location.reload();
  // };
  
  // // retrieves the latest value of diameter
  // useEffect(() => {
    
  //   if(diameter != null){

  //     const paddingWidth = googleMapwidth * 0.5 - diameter / 2;
  //     const paddingHeight = googleMapheight * 0.5 - diameter / 2;


  //     // * canavas out div tag styles
  //     setCanavsOuterLayoutStyle({
  //       position: 'absolute',
  //       // top: `calc(50% - ${diameter/2}px)`,
  //       // left: `calc(50% - ${diameter / 2}px)`,
  //       top: `${paddingHeight}px`,
  //       left: `${paddingWidth}px`,
  //       width: `${diameter}px`,
  //       height: `${diameter}px`,
  //       border: "1px solid red",
  //       zIndex: 999,
  //     });

  //     // * offesting points by this
  //     setGoogleMapffset({
  //       widthOffset: paddingWidth,
  //       heightOffset: paddingHeight
  //     })
  //   }
  // }, [diameter, drawPath]);



  // Function to update the variable
  // const updateDrawingPoints = (newPoints) => {
  //   const widthOffsetCal = newPoints.x + googleMapffset.widthOffset;
  //   const heightOffsetCal = newPoints.y + googleMapffset.heightOffset;
    
  //   setDrawingPoints([...drawingPoints, { x: round(widthOffsetCal), y:round(heightOffsetCal) }]);
    
  // };

  // // function to convert pixel values to coordinates
  // const convertToCoordinates = (point) => {

  //   setDrawingPoints(point);
  // }

  // // display new path
  // useEffect(() => {
  //   if (submittedPath && drawingPoints[0].length === 2){
  //     console.log(drawingPoints);
  //   }
  // }, [submittedPath, convertToCoordinates])


  const [addMarker,  setAddMarker] = useState(false);
  const [removeMarker, setRemoveMarker] = useState(false);
  const [drawPath, setDrawPath] = useState(false);
  const [isMarkerAdded, setIsMarkerAdded] = useState(false);
  const [isPathDrawn, setIsPathDrawn] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [drawStraight, setDrawStraight] = useState(false);

  // * add button 
  const addButton = () => {
    setAddMarker(!addMarker);

  };

  // * remove button
  const removeButton = () => {
    setRemoveMarker(true);
    setIsMarkerAdded(false);
  }

  // * draw path button
  const pathButton = () => {
    setAddMarker(false);
    setDrawPath(!drawPath);
  };


  // * flag to delete path button
  const deleteButton = () => {
    console.log('clicked delete path button');
    setIsDelete(true);
  };
 
  return (
    <>
      <div className="map-outter-layer">

        <div className="map-layout">
            
          <GoogleMapComponent

            setIsMarkerAdded = {setIsMarkerAdded}
            addMarker = {addMarker}
            removeMarker= {removeMarker}
            setRemoveMarker = {setRemoveMarker}
            drawPath = {drawPath}
            isDelete = {isDelete}
            setIsDelete = {setIsDelete}
            setIsPathDrawn= {setIsPathDrawn}
          />

        </div>

        <div className="map-buttons">
          <div className="map-btn">
            <button onClick={addButton} disabled={drawPath} style={activeBtn(addMarker)}>
              Add Pin

            </button>
          </div>

          <div className="map-btn">
            <button onClick={removeButton} disabled = {!isMarkerAdded || drawPath} >
              Clear Marker
            </button>
          </div>

          <div className="map-btn">
            <button onClick={pathButton} disabled={!isMarkerAdded} style={activeBtn(drawPath)}>
              Draw Path
            </button>
          </div>

          <div className="map-btn">
            <button onClick={deleteButton} disabled={!isMarkerAdded || !isPathDrawn}>
              Delete Path
            </button>
          </div>

          <div className="map-btn">
            <button  >
              Submit Path
            </button>
          </div>

          <div className="map-btn">
            <button  >
              Refresh Page
            </button>
          </div>

        </div>
      </div>

      {/* <LocationSearchInput map={map}  /> */}
    </>
  );
}

export default App;

// rounding number 
function round(point) {return Math.round(point * 1000)/1000}

// style active button
function activeBtn(bool) {
  return {
    backgroundColor: bool ? '#FF0000' : '#4CAF50' ,
    color: "#000000",
    border: "1px solid #ccc"
    // add other styles as needed
  };
}
