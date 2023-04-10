//* External libraries
import { useState, useRef, useEffect } from 'react';
import { MapContainer, Polygon, TileLayer, ZoomControl, useMapEvent } from 'react-leaflet';
import osm from '../../osm-providers';

//* Data
// import countriesData from '../../data/countries-geojson.json';
import countriesData from '../../data/global-geoJSON.json';

//* Components
import ResetMapControl from '../reset-map-control/ResetMapControl';

//* Styles
import 'leaflet/dist/leaflet.css';
import './basicmap.scss';

//* Constants
const DEFAULT_LAT_LNG = {
  lat: 26,
  lng: 0,
};

const DEFAULT_ZOOM = 3;
const MIN_ZOOM = 3;

export default function BasicMap() {
  //* Leaflet related
  const [center, setCenter] = useState(DEFAULT_LAT_LNG);
  const [defaultZoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const [minZoom, setMinZoom] = useState(MIN_ZOOM);

  const [newCenter, setNewCenter] = useState(null);
  const [newZoomLevel, setNewZoomLevel] = useState(null);

  const latestCenter = JSON.parse(localStorage.getItem('localStorageLatestCenter'));
  const latestZoomLevel = JSON.parse(localStorage.getItem('localStorageLatestZoomLevel'));

  const [polygon, setPolygon] = useState(true);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!map) return;

    if (map.getZoom() > 3) {
      setPolygon(false);
    }
  });

  useEffect(() => {
    localStorage.clear();

    localStorage.setItem('localStorageLatestCenter', JSON.stringify(newCenter));
    localStorage.setItem('localStorageLatestZoomLevel', JSON.stringify(newZoomLevel));
  }, [newCenter, newZoomLevel]);

  useEffect(() => {
    if (newZoomLevel === defaultZoomLevel) {
      console.log('Activating Multi-Polygon');
      setPolygon(true);
    }

    if (newZoomLevel > defaultZoomLevel) {
      console.log('Deactivating Multi-Polygon New Zoom Level Changed');
      setPolygon(false);
    }
  }, [newZoomLevel]);

  function flyToCountry(e) {
    const { latlng } = e;

    setNewCenter(latlng);
    setNewZoomLevel(7);

    map.flyTo(latlng, 7, {
      duration: 0,
    });

    setPolygon(false);
  }

  const handleZoomChange = (e) => {
    switch (e.type) {
      case 'zoomstart':
        console.log('Zoom start');

        setPolygon(false);
        break;

      case 'zoomend':
        console.log('Zoom end');

        setNewCenter(map.getCenter());
        setNewZoomLevel(map.getZoom());
        break;

      default:
        break;
    }
  };

  const handleOnMoveChange = (e) => {
    switch (e.type) {
      case 'movestart':
        console.log('Move start');
        setPolygon(false);
        break;

      case 'moveend':
        console.log('Move end');

        setNewCenter(map.getCenter());
        setNewZoomLevel(map.getZoom());

        if (newZoomLevel <= 3) {
          setPolygon(true);
        }
        break;

      default:
        break;
    }
  };

  const handleMapReset = () => {
    setNewCenter(DEFAULT_LAT_LNG);
    setNewZoomLevel(DEFAULT_ZOOM);
    setPolygon(true);

    map.flyTo(DEFAULT_LAT_LNG, DEFAULT_ZOOM, {
      duration: 0,
    });
  };

  return (
    <>
      <MapContainer
        ref={setMap}
        center={latestCenter ? latestCenter : center}
        zoom={latestZoomLevel ? latestZoomLevel : defaultZoomLevel}
        minZoom={minZoom}
        // whenReady={(e) => console.log(e)}
      >
        <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution} />
        <ZoomControl position="bottomright" />
        <MapEvents handleZoomChange={handleZoomChange} handleOnMoveChange={handleOnMoveChange} />
        {polygon &&
          countriesData.features.map((countries) => {
            let polygon;
            let multiPolygonCoordinates;

            if (countries.geometry.type === 'MultiPolygon') {
              multiPolygonCoordinates = countries.geometry.coordinates.map((c) => {
                return c.map((mi) => {
                  return mi.map((i) => {
                    return [i[1], i[0]];
                  });
                });
              });
            } else if (countries.geometry.type === 'Polygon') {
              polygon = countries.geometry.coordinates.map((c) => c.map((item) => [item[1], item[0]]));
            }

            return (
              <Polygon
                key={countries.properties.ADMIN}
                pathOptions={{
                  fillOpacity: 0,
                  weight: 0.5,
                  opacity: 0.5,
                  color: 'grey',
                }}
                positions={multiPolygonCoordinates !== undefined ? multiPolygonCoordinates : polygon}
                eventHandlers={{
                  mouseover: (e) => {
                    const layer = e.target;

                    layer.setStyle({
                      fillColor: '#91A6FF',
                      fillOpacity: 0.5,
                      weight: 2,
                      dashArray: '3',
                      color: 'white',
                    });
                  },
                  mouseout: (e) => {
                    const layer = e.target;

                    layer.setStyle({
                      fillOpacity: 0,
                      weight: 0,
                      dashArray: '1',
                      color: 'white',
                    });
                  },

                  click: (e) => {
                    flyToCountry(e);
                  },
                }}
              />
            );
          })}

        <ResetMapControl handleMapReset={handleMapReset} />
      </MapContainer>
    </>
  );
}

function MapEvents({ handleZoomChange, handleOnMoveChange }) {
  useMapEvent('zoomstart', handleZoomChange);
  useMapEvent('zoomend', handleZoomChange);
  useMapEvent('movestart', handleOnMoveChange);
  useMapEvent('moveend', handleOnMoveChange);
  return null;
}
