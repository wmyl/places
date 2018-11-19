//let Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();

import MarkerClusterer from 'node-js-marker-clusterer';
import 'whatwg-fetch'
import styles from './styles';

class MapHandler {
    constructor(mapContainer, imagePath, onMarkerClick, clusterer) {
        this.mapWrapper = document.querySelector(mapContainer);
        this.markers = [];
        this.onMarkerClick = onMarkerClick;
        this.imagePath = imagePath;
        this.clusterer = clusterer;
    }

    initMap(style) {
        const mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng('57.7004286','11.9543521'),
            styles: styles[style] ? styles[style] : style,
            disableDefaultUI: true
        };

        this.map = new google.maps.Map(this.mapWrapper, mapOptions);
        if (navigator.geolocation) {

            // Set center to your own location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.clientPosition = pos;
                    this.map.setCenter(pos);
                    console.log('Location found.');
                },
                error => {
                    console.log('Error with geolocation: ', error);
                }
            );
        } else {
            console.log('No geoloc enabled.');
        }
    }

    goToCoordinates(lat, long, offsetX, offsetY, zoom) {

        const ZOOM = zoom ? zoom : Math.max(16, this.map.zoom);

        offsetX = offsetX ? offsetX : 0;
        offsetY = offsetY ? offsetY : 0;

        const projection = this.map.getProjection();

        const latlng = new google.maps.LatLng(parseFloat(lat), parseFloat(long));
        const pointCenter = projection.fromLatLngToPoint(latlng);
        const pointOffset = new google.maps.Point(
            offsetX / Math.pow(2, ZOOM),
            offsetY / Math.pow(2, ZOOM)
        );

        this.map.setCenter(projection.fromPointToLatLng(new google.maps.Point(
            pointCenter.x - pointOffset.x,
            pointCenter.y + pointOffset.y
        )));

        this.map.setZoom(ZOOM);
    }

    goToSearchedPlace(searchedPlace) {
        return new Promise((resolve, reject) => {
            // The case where the user didn't choose any of the locations in the list
            if (!searchedPlace.geometry) {
                const autocompleteService = new google.maps.places.AutocompleteService();

                autocompleteService.getPlacePredictions({
                    input: searchedPlace.name,
                    offset: searchedPlace.name.length,
                    componentRestrictions: {country: 'se'},
                    bounds: this.map.getBounds(),
                }, (resultList,status) => {

                    if (resultList && resultList.length > 0) {
                        const placesService = new google.maps.places.PlacesService(this.map);

                        // Pick the first in the autocompletion list as default
                        placesService.getDetails({
                            reference: resultList[0].reference
                        }, (detailsResult, placesServiceStatus) => {

                            // Run the same method again but with an actual place
                            if (detailsResult) {
                                this.goToSearchedPlace(detailsResult).then(searchedPlace => {
                                    resolve(searchedPlace)
                                });
                            }
                        });
                    }
                });
            } else {
                this.goToCoordinates(searchedPlace.geometry.location.lat(), searchedPlace.geometry.location.lng());

                // To let bounds and zoom change
                setTimeout(() => resolve(searchedPlace), 50);
            }
        });
    }

    getLocation() {
        const _this = this;
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                _this.map.setCenter(pos);
                _this.map.setZoom(16);
            });
        } else {
            alert('sorry your browser does not support Geolocation');
        }
    }

    selectPlace(marker, offsetX, offsetY) {
        this.deselectPlace();

        this.goToCoordinates(marker.item.lat, marker.item.lng, offsetX, offsetY);

        marker.setMap(null);
        this.selectedMarker = new google.maps.Marker({
            position: new google.maps.LatLng(marker.item.lat, marker.item.lng),
            map: this.map,
            item: marker.item,
            icon: {
                url: `${this.imagePath}${marker.item.type ? marker.item.type : ''}.png`,
                scaledSize: new google.maps.Size(51.2,64),
            },
            zIndex: 100,
        });

        return this.selectedMarker;
    }

    deselectPlace() {
        let marker = this.selectedMarker;

        if (marker) {
            this.selectedMarker.setMap(null);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(marker.item.lat, marker.item.lng),
                map: this.map,
                item: marker.item,
                icon: {
                    url: `${this.imagePath}${marker.item.type ? marker.item.type : ''}.png`,
                    scaledSize: new google.maps.Size(32,40),
                },
                zIndex: 0,
            });

            this.selectedMarker = null;

            if (this.onMarkerClick) {
                marker.addListener('click', () => this.onMarkerClick(marker));
            }
        }
    }

    setPlaces(places, offsetX, offsetY) {
        this.markers = [];

        places.forEach((place) => {
            const { lat, lng, type } = place;
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: this.map,
                item: place,
                icon: {
                    url: `${this.imagePath}${type ? type : ''}.png`,
                    scaledSize: new google.maps.Size(32,40),
                }
            });

            if (this.onMarkerClick) {
                marker.addListener('click', () => this.onMarkerClick(marker));
            }

            this.markers.push(marker);
        });

        if (this.clusterer) {
            google.maps.event.addListener(new MarkerClusterer(
                this.map, this.markers, {
                    styles: [...Array(5).keys()].map(e => this.getStyle(e + 1)),
                    averageCenter: true,
                    gridSize: 28,
                    maxZoom: 18,
                    zoomOnClick: false,
                }),
                'clusterclick',
                cluster => {
                    const {lat, lng} = cluster.getCenter();

                    // Never allow bigger zoom than this at a time
                    const zoom = Math.min(this.map.zoom + 3, cluster.getMarkerClusterer().getMaxZoom() + 1);

                    this.goToCoordinates(lat(), lng(), offsetX, offsetY, zoom);
                });
        }
    }

    getVisibleMarkers() {
        // Filter out markers in view port
        return this.markers.filter(marker => this.inViewPort(this.map.getBounds(), marker.item));
    }

    inViewPort(mapView, { lng, lat }) {
        if(lng < mapView.j.l && lng > mapView.j.j) {
            if(lat < mapView.l.l && lat > mapView.l.j) {
                return true;
            }
        }
    }

    getStyle(size) {
        let { imagePath, textSize, textColor, sizes, } = this.clusterer;

        sizes = sizes ? sizes : [10, 10, 10, 10, 10];

        return {
            textSize: textSize ? textSize : 16,
            textColor: textColor ? textColor : '#252C25',
            width: sizes[size - 1],
            height: sizes[size - 1],
            anchor: [0, 0],
            iconAnchor: [0, 0],
            url: `${imagePath}${size}.png`,
        };
    }
}

export default MapHandler;