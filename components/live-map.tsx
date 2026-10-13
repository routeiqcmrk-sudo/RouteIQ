"use client";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, ZoomControl } from "react-leaflet";
export type Bus = { id:string; driver:string; route:string; status:"On route"|"At stop"|"Delayed"; speed:number; updated:string; position:[number,number]; color:string };
export default function LiveMap({buses}:{buses:Bus[]}) {
 const line:[[number,number],[number,number],[number,number],[number,number],[number,number]] = [[17.4933,78.3915],[17.4849,78.4071],[17.4724,78.4012],[17.4605,78.3976],[17.4486,78.3908]];
 return <MapContainer center={[17.475,78.385]} zoom={12} scrollWheelZoom zoomControl={false} className="leaflet-map">
  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
  <ZoomControl position="bottomright"/><Polyline positions={line} pathOptions={{color:"#4778ef",weight:3,opacity:.55,dashArray:"7 8"}}/>
  {buses.map(bus=><CircleMarker key={bus.id} center={bus.position} radius={8} pathOptions={{color:"#fff",weight:3,fillColor:bus.status==="Delayed"?"#e59a31":bus.status==="At stop"?"#9a6bea":bus.color,fillOpacity:1}}><Popup><div className="map-popup"><strong>{bus.id}</strong><span>{bus.route}</span><small>{bus.driver} · {bus.speed} km/h</small><em>{bus.status} · simulated position</em></div></Popup></CircleMarker>)}
 </MapContainer>;
}
