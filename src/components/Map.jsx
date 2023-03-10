import React from 'react';
import axios from 'axios';

import { MapContainer, TileLayer, useMap, Marker, Popup, Tooltip, ZoomControl } from 'react-leaflet';
import '../../node_modules/leaflet/dist/leaflet.css';

import adviceOffices from "../icons/advice-offices.svg";
import legalAidSouthAfrica from "../icons/legal-aid-south-africa.svg";
import legalPracticeCountil from "../icons/legal-practice-council.svg";
import ngoLawClinics from "../icons/ngo-law-clinics.svg";
import rentalHousingTribunal from "../icons/rental-housing-tribunal.svg";
import universityLawClinics from "../icons/university-law-clinics.svg";
import userIcon from "../icons/user-icon.png";



import {Icon} from 'leaflet';


import offices from '../offices-2.csv';


export class Map extends React.Component {


    constructor(){
        super();
        this.state = {
            center: [-30.559482, 22.937506],
            zoom: 6,
            options: [],
            loading: false,
            userLocated: false
        }
        this.mapRef = React.createRef();
        this.userRef = React.createRef();
        this.searchRef = React.createRef();
        
    }

    componentDidMount() {}

    addressLookup = (e) => {
        let self = this;

        if (e.length > 3) {
            // Throttle the number of requests sent
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.timeout = null;

                axios.get(`https://nominatim.openstreetmap.org/search?q=${e}&format=json&polygon=1&addressdetails=1&&countrycodes=za`)
                .then(function (response) {
                    
                    self.setState({options: response.data.map((item) => {
                        return {
                            value: item,
                            label: item.display_name
                        }
                    })})
                })
                
            }, 1000);
        }
    }

    useLocation = () => {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition((position) => {
                this.setState({center: [position.coords.latitude, position.coords.longitude], zoom: 13, userLocated: true}, () => {
                    this.mapRef.current.setView(this.state.center, this.state.zoom);
                    this.userRef.current.position = this.state.center;
                    this.searchRef.current.value = "";
                })
            })
        }
    }

    closeSearch = () => {
        let self = this;
        self.setState({options: []});
    }

    officeIcon = (office) => {

        let iconUrl = adviceOffices;

        if(office == "Advice Offices") {
            iconUrl = adviceOffices;
        } else if(office == "Legal Aid South Africa") {
            iconUrl = legalAidSouthAfrica;
        } else if(office == "Legal Practice Council") {
            iconUrl = legalPracticeCountil;
        } else if(office == "NGO Law Clinics") {
            iconUrl = ngoLawClinics;
        } else if(offices == "Rental Housing Tribunal") {
            iconUrl = rentalHousingTribunal;
        } else if(office == "University Law Clinics") {
            iconUrl = universityLawClinics;
        }

        return iconUrl;

    }

    render() {
        return (<div className="map-container">
            <div className="map-search-container-header row" onClick={() => this.closeSearch()}>
                <div className="map-search-container-col search-box col-8">
                    <input ref={this.searchRef} type="text" placeholder="Search for your address..." onChange={(e) => this.addressLookup(e.target.value)} className={this.state.loading ? 'loading' : ''}/>
                    <div className="search-options">
                        <ul>
                            {this.state.options.map((item, index) => {
                                return <li as="li" action key={index} onClick={() => {
                                    this.setState({center: [item.value.lat, item.value.lon], zoom: 13}, () => {
                                        this.mapRef.current.setView(this.state.center, this.state.zoom);
                                        this.setState({options: [], userLocated: true}, () => {
                                            this.userRef.current.position = this.state.center;
                                        });
                                    })
                                }}>{item.label}</li>
                            })}
                        </ul>
                    </div>
                </div>
                <div className="col search-or">
                    OR
                </div>
                <div className="map-search-container-col my-location col-3">
                    <button className="geolocation-btn" onClick={() => this.useLocation()}>Use my location</button>
                </div>
                
            </div>

            <div onClick={() => this.closeSearch()} className="map-container-map">
                <MapContainer ref={this.mapRef} center={this.state.center} zoom={this.state.zoom} scrollWheelZoom={false} style={{height: '600px'}} zoomControl={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <ZoomControl position="bottomright"/>
                    {this.state.userLocated &&
                        <Marker
                        ref={this.userRef}
                        key="user"
                        position={this.state.center}
                        icon={new Icon({iconUrl: userIcon, iconSize: [25, 41], iconAnchor: [12, 20]})}>
                        </Marker>
                    }

                    {offices.map((office, index) => {
                        return (
                        (index != 0 && (office[9] != "" && office[10] != "")) &&
                            
                                <Marker 
                                    key={index}
                                    position={[parseFloat(office[9]), parseFloat(office[10])]}
                                    icon={new Icon({iconUrl: this.officeIcon(office[1]), iconSize: [25, 30], iconAnchor: [12, 30]})}
                                    >
                                    <Tooltip>{office[0]}</Tooltip>
                                    <Popup>
                                        <p>
                                            {/* Icon */}
                                            <img src={this.officeIcon(office[1])} style={{width: "25px", height: "30px", marginRight: "10px"}} />
                                            <strong>{office[1]}</strong>
                                        </p>

                                        <p>
                                            <strong>{office[0]}</strong>
                                            <br/>
                                            {office[5]}
                                        </p>
                                        <p>
                                            <strong>{office[7]}</strong>
                                            <br />
                                            {office[3] != '' ? 
                                                <><strong>Tel: </strong> {office[3]}</>
                                            : ''}
                                            <br/>
                                            {office[4] != '' ? 
                                            <><strong>E-mail: </strong><a className="text-decoration-none" href={`mailto:${office[4]}`}>{office[4]}</a></>
                                            : ''}
                                            <br/>
                                            {office[6] != '' ?
                                            <><strong>Website: </strong><a className="text-decoration-none" href={`${office[6]}`}>{office[6]}</a></>
                                            : ''}
                                        </p>
                                    </Popup>
                                </Marker>
                        
                        ) 
                        
                    })}


                </MapContainer>
            </div>
           
        </div>)
    }

}
