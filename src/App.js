import React from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from './data';

import './App.css';
import axios from 'axios'
const center = [40.63463151377654, -97.89969605983609];
const countryCoder = require('country-coder');

const options = {
  method: 'GET',
  url: 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total',
  params: { country: 'Canada' },
  headers: {
    'X-RapidAPI-Key': '05710b0bb4msh71553a659074649p107a18jsna17941d84b1f',
    'X-RapidAPI-Host': 'covid-19-coronavirus-statistics.p.rapidapi.com'
  }
};
export default function App() {
  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ width: '100vw', height: '100vh' }}
    >
      <TileLayer
        url="https://api.maptiler.com/data/6b22553d-f811-4be9-8613-8f19544f6b53/features.json?key=5R76UUnKI0F644bnjFO3"
        attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      />
      {
        statesData.features.map((state) => {
          const coordinates = state.geometry.coordinates[0].map((item) => [item[1], item[0]]);
          return (<Polygon
            pathOptions={{
              fillColor: '#FD8D3C',
              fillOpacity: 0.7,
              weight: 2,
              opacity: 1,
              dashArray: 3,
              color: 'white'
            }}
            positions={coordinates}
            eventHandlers={{
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  dashArray: "",
                  fillColor: "#BD0026",
                  fillOpacity: 0.7,
                  weight: 2,
                  opacity: 1,
                  color: "white",
                })
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.7,
                  weight: 2,
                  dashArray: "3",
                  color: 'white',
                  fillColor: '#FD8D3C'
                });
              },
              click: (e) => {

                const cName = countryCoder.feature([e.latlng.lng, e.latlng.lat]).properties.nameEn;
                if(cName != null){
                  options.params.country=cName;
                  
                  axios.request(options).then(function (response) {
                  console.log(response.data.data)
                    alert(cName + ' Ölüm Adedi: ' + response.data.data.deaths + ' İyileşen ' + response.data.data.recovered == null ? 0 : response.data.data.recovered  +' Vaka Sayısı: ' + response.data.data.confirmed);
                  }).catch(function (error) {
                    console.error(error);
                  });
                }
              }
            }}
          />)
        })
      }
    </MapContainer>
  );
}