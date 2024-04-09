//* External libraries
import React, { useState, useEffect } from 'react';
import { MapContainer, Polygon, TileLayer, ZoomControl, useMapEvent } from 'react-leaflet';
import osm from '../../osm-providers';
import countriesData from '../../data/global-geoJSON.json';

//* Constants
import { DEFAULT_LAT_LNG, ZOOM_CONF } from '../../const';

//* Components
import ResetMapControl from '../reset-map-control/ResetMapControl';

//* Styles
import 'leaflet/dist/leaflet.css';
import './basicmap.scss';

function BasicMap() {
  //* Leaflet related
  const [center, setCenter] = useState(DEFAULT_LAT_LNG);
  const [defaultZoomLevel, setZoomLevel] = useState(ZOOM_CONF.DEFAULT_ZOOM);
  const [minZoom, setMinZoom] = useState(ZOOM_CONF.MIN_ZOOM);

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

  const flyToCountry = (e) => {
    const { latlng } = e;

    setNewCenter(latlng);
    setNewZoomLevel(7);

    map.flyTo(latlng, 7, {
      duration: 0,
    });

    setPolygon(false);
  };

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

  const setInitialLayerStyle = () => ({ fillOpacity: 0, weight: 0.5, opacity: 0.5, color: 'grey' });

  const handleMouseOver = (e) => {
    const layer = e.target;

    layer.setStyle({
      fillColor: '#91A6FF',
      fillOpacity: 0.5,
      weight: 1,
      dashArray: '3',
      color: 'white',
    });
  };

  const handleMouseOut = (e) => {
    const layer = e.target;

    layer.setStyle({
      fillOpacity: 0,
      weight: 0.5,
      opacity: 0.5,
      dashArray: '0',
      color: 'grey',
    });
  };

  const handleMapReset = () => {
    setNewCenter(DEFAULT_LAT_LNG);
    setNewZoomLevel(ZOOM_CONF.DEFAULT_ZOOM);
    setPolygon(true);

    map.flyTo(DEFAULT_LAT_LNG, ZOOM_CONF.DEFAULT_ZOOM, {
      duration: 0,
    });
  };

  return (
    <MapContainer
      ref={setMap}
      center={latestCenter ? latestCenter : center}
      zoom={latestZoomLevel ? latestZoomLevel : defaultZoomLevel}
      minZoom={minZoom}
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
              pathOptions={setInitialLayerStyle()}
              positions={multiPolygonCoordinates !== undefined ? multiPolygonCoordinates : polygon}
              eventHandlers={{
                mouseover: (e) => {
                  handleMouseOver(e);
                },
                mouseout: (e) => {
                  handleMouseOut(e);
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
  );
}

function MapEvents({ handleZoomChange, handleOnMoveChange }) {
  useMapEvent('zoomstart', handleZoomChange);
  useMapEvent('zoomend', handleZoomChange);
  useMapEvent('movestart', handleOnMoveChange);
  useMapEvent('moveend', handleOnMoveChange);
  return null;
}

export default BasicMap;
