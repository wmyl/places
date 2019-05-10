//let Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();

import MarkerClusterer from 'node-js-marker-clusterer';
import 'whatwg-fetch'

import styles from './styles';
import {SELECTOR_CLASS} from "./index";

class MapHandler {
    constructor(imagePath) {
        this.imagePath = imagePath;

        MapHandler._buildMapWrapper();
    }

    initMap(style, startPos, noGeoloc) {

        // If undefined, make empty object
        startPos = startPos ? startPos : {};

        const mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(startPos.lat ? startPos.lat : '57.7004286', startPos.lng ? startPos.lng : '11.9543521'),
            styles: styles[style] ? styles[style] : style,
            disableDefaultUI: true
        };

        const mapWrapper = document.querySelector(`.${SELECTOR_CLASS}__container`);

        this.map = new google.maps.Map(mapWrapper, mapOptions);
        if (!noGeoloc) {
            this._initGeoloc();
        }
    }

    setPlaces(places, offsetX, offsetY, onMarkerClick, clusterer) {
        this.markers = places.map(place => {

            const { lat, lng, type } = place;

            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: this.map,
                item: place,
                icon: !this.imagePath ? null : {
                    url: `${this.imagePath}${type ? type : ''}.png`,
                    scaledSize: new google.maps.Size(32, 40),
                },
            });

            if (onMarkerClick) {
                marker.addListener('click', () => onMarkerClick(marker));
            }

            return marker;
        });

        if (clusterer) {
            this._initClusterer(clusterer, offsetX, offsetY);
        }
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
                }, (resultList, status) => {

                    if (resultList && resultList.length > 0) {
                        const placesService = new google.maps.places.PlacesService(this.map);

                        // Pick the first in the autocompletion list as default
                        placesService.getDetails(
                            {reference: resultList[0].reference},
                            (detailsResult, placesServiceStatus) => {

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

    selectPlace(marker, offsetX = this.offsetX, offsetY = this.offsetY) {
        this.deselectPlace();

        this.goToCoordinates(marker.item.lat, marker.item.lng, offsetX, offsetY);
        this.selectedMarker = marker;
        this._resizeMarker(marker, true);
    }

    deselectPlace() {
        if (this.selectedMarker) {
            this._resizeMarker(this.selectedMarker, false);
        }
        this.selectedMarker = null;
    }

    getVisibleMarkers() {
        // Filter out markers in view port
        return this.markers.filter(marker => MapHandler._inViewPort(this.map.getBounds(), marker.item));
    }

    static _buildMapWrapper() {
        const mapDiv = document.querySelector('.' + SELECTOR_CLASS);

        if (mapDiv) {
            mapDiv.insertAdjacentHTML('beforeend', `<div class=${SELECTOR_CLASS}__container></div>`);
        }
    }

    _resizeMarker(marker, active) {
        if (this.imagePath) {
            marker.setIcon({
                url: `${this.imagePath}${marker.item.type ? marker.item.type : ''}.png`,
                scaledSize: {width: active ? 51.2 : 32, height: active ? 64 : 40}
            });
        }

        return marker;
    }

    static _inViewPort(mapView, {lng, lat}) {
        console.log(mapView);
        return lng < mapView.ia.l && lng > mapView.ia.j && lat < mapView.na.l && lat > mapView.na.j;
    }

    _initGeoloc() {
        if (navigator.geolocation) {

            // Set center to your own location - if enabled
            // This can take a while depending on GPS availability etc
            navigator.geolocation.getCurrentPosition(
                ({coords}) => {
                    const pos = {
                        lat: coords.latitude,
                        lng: coords.longitude
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

    _initClusterer(clustererOptions) {
        google.maps.event.addListener(new MarkerClusterer(
            this.map, this.markers, {
                styles: [1, 2, 3, 4, 5].map(e => MapHandler._getStyle(e, clustererOptions)),
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

                this.goToCoordinates(lat(), lng(), clustererOptions.offsetX, clustererOptions.offsetY, zoom);
            });
    }

    static _getStyle(size, {imagePath, textSize, textColor, sizes,}) {
        sizes = sizes ? sizes : [10, 10, 10, 10, 10];

        return {
            textSize: textSize ? textSize : 16,
            textColor: textColor ? textColor : '#252C25',
            width: sizes[size - 1],
            height: sizes[size - 1],
            anchor: [0, 0],
            iconAnchor: [0, 0],
            url: imagePath ? `${imagePath}${size}.png` : '',
        };
    }
}

export default MapHandler;