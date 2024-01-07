import { GoogleMap, MarkerF, CircleF } from "@react-google-maps/api";
import { useOnLoad } from "./googleMapsHooks";
import {useState, useEffect, useRef} from "react";
import _debounce from 'lodash/debounce';


const defaultLocation = { lat: 48.8584, lng: 2.2945 }; // location initially defined
const defaultZoom = 13; // 
// const maximumZoom = 14;
// const minimumZoom = 16;
const radius = 94 // in meters
// Math.sqrt(300000 / Math.PI);

const GoogleMapComponent = ({ addMarker, removeMarker, setRemoveMarker, drawPath, setDrawPath }) => {

    const mapRef = useRef(null); // reference to map for this files
    const { isLoaded, onLoad, map, convertPixelToLatLng, pixelsToLatitude } = useOnLoad(); //  returing from hook

    const [center, setCenter] = useState(defaultLocation); 
    const [zoom, setZoom] = useState(defaultZoom);
    const [marker, setMarker] = useState(null); // pin added to map
    const [mapContainerSize, setMapContainerSize] = useState(null);
    const [ pathRecorded, setPathRecorded] = useState([]);
    const [ mousePressed, setMousePressed] = useState(false); // records when user clicks on

    // TODO: gets the width and height google maps box
    const getMapContainerSize = () => {
        if (mapRef.current?.mapRef) {
            const width = mapRef.current.mapRef.offsetWidth;
            const height = mapRef.current.mapRef.offsetHeight;
            // console.log('Width:', width, 'Height:', height);
            setMapContainerSize({ width, height });
        }
    };

    // to run the function after the component is mounted
    useEffect(() => {
        getMapContainerSize();
    }, [mapRef.current]);

    // TODO:  when mouse reaches the end of the map, move map accordingly
    const handleMouseMapMove = (e) => {

        const threshold = 20; // * 20px to detect movement
        const widthThreshold = pixelsToLatitude(5); // equivalent lat distance

        // x, y position of mouse
        const pixelX = e.pixel.x;
        const pixelY = e.pixel.y;

        const shift = (direction, lat, lng) => {
            switch (direction) {
                case 'right':
                    return { lat, lng: lng + widthThreshold };
                case 'left':
                    return { lat, lng: lng - widthThreshold };
                case 'down':
                    return { lat: lat - widthThreshold, lng };
                case 'up':
                    return { lat: lat + widthThreshold, lng };
                default:
                    return { lat, lng };
            }
        };

        if (pixelX + threshold > mapContainerSize.width) {
            // console.log('shifting right');
            setCenter((prevOptions) => shift('right', prevOptions.lat, prevOptions.lng));
        } else if (pixelX - threshold < 0) {
            // console.log('shifting left');
            setCenter((prevOptions) => shift('left', prevOptions.lat, prevOptions.lng));
        }

        if (pixelY + threshold > mapContainerSize.height) {
            // console.log('shifting down');
            setCenter((prevOptions) => shift('down', prevOptions.lat, prevOptions.lng));
        } else if (pixelY - threshold < 0) {
            // console.log('shifting up');
            setCenter((prevOptions) => shift('up', prevOptions.lat, prevOptions.lng));
        }

    };

    // TODO: handles the case when mouse is dragged to recenter map
    const handleMapDragEnd = () => {
        const newCenter = map.getCenter();
        setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
    };

    // TODO: record geographical coords value of cursor of the circle tag
    const handleMapDrawing = _debounce((e) => {

        // enables when draw path is clicked and center exists
        if(drawPath && marker && mousePressed ) {
            drawingPathButton(e.latLng);
        }
        
    }, 10);

    //  TODO: handles when mouse is pressed
    const handleMapDown = () => {
        setMousePressed(true);
     };

    //  TODO: handles when mouse is released
    const handleMapMouseUp = () => {
        setMousePressed(false);
    }; 
 

    // * add a marker to the map
    const handleAddmarker = (e) => {
        
        if(e.latLng && addMarker) {
            console.log('Marker added at location:', e.latLng.lat(), e.latLng.lng());
            setMarker(e.latLng);
            setPathRecorded([]) // resets the recorded path

        }
    }
    
    // * remove a marker from the map
    useEffect(() => {
        if (removeMarker && marker) {
            setMarker(null);
            setRemoveMarker(false);
        }
    }, [removeMarker]);
    
    // * draws path on the map
    const drawingPathButton = (point) => {

        setPathRecorded((prevPathRecorded) => [...prevPathRecorded, {lat: point.lat(), lng: point.lng()}]);
        console.log('path recorded:', pathRecorded);
    };


    if (!isLoaded) {
        return (
            <> Loading...</>
        );
    };
        
    
    return (
        <GoogleMap
            center = {center}
            zoom = {zoom}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
                streetViewControl: false,
                fullscreenControl: false,
                // scrollwheel: !drawPath,
                // zoomControl: !drawPath,
                gestureHandling: drawPath ? 'none' :'cooperative',   
                clickableIcons: drawPath ? false : true,
            }}
            onClick={handleAddmarker}
            onMouseMove={handleMouseMapMove}
            onDragEnd={handleMapDragEnd}
            onMouseUp={handleMapMouseUp}
            onMouseDown={handleMapDown}
            onLoad={onLoad}
            ref = {mapRef}
        >


            {marker && (
                <>
                    <MarkerF position={marker} />
                    <CircleF
                        center={marker}
                        radius={radius}
                        options={circleOptions}
                        onMouseMove={handleMapDrawing}
                    />

                    {pathRecorded && pathRecorded.map((path, index) => (
                        <CircleF
                            key={index}
                            center={path}
                            options={pathOptions}
                            radius={2}
                        />
                    ))} 
                </>
            )}


        </GoogleMap>
        );



};


export default GoogleMapComponent;

//  style for the circle
const circleOptions = {
    fillOpacity: 0.1,
    strokeColor: 'blue',
    strokeOpacity: 1,
    strokeWeight: 1,
};

// style for the path
const pathOptions = {
    fillColor : 'cyan',
    // strokeColor: 'cyan',
    fillOpacity: 1,
    strokeOpacity: 1,
    // strokeWeight: 1,

};


// converting meters into pixel
function metersPerPixel(lat, zoom) {

    const earthCircumference = 40075017;
    const latitudeRadians = lat * (Math.PI / 180);
    return earthCircumference * Math.cos(latitudeRadians) / Math.pow(2, zoom + 8);
}


function metersToPixel(lat, zoom) { return radius / metersPerPixel(lat, zoom) * 2; }


