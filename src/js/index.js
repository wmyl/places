import MapHandler from './map-handler';
import MapSidebarHandler from './map-sidebar-handler';
import MapSearch from './map-search';
import MapPopup from './map-popup';

/* MINIMUM STYLE FOR LIBRARY */
import '../scss/style.scss';

class Places {

    constructor({tag, places, sidebar, popup, imagePath, clusterer, mapStyle, startPos, noGeoloc}) {

        if (document.querySelector('.' + SELECTOR_CLASS)) {
            this.mapHandler = new MapHandler(imagePath);

            if (sidebar) {
                this.sidebarHandler = new MapSidebarHandler(sidebar, imagePath);
                this.mapSearch = new MapSearch(this._goToSearchedPlace.bind(this));
            }

            if (popup) {
                this.mapPopup = new MapPopup(popup, !!sidebar, () => this.mapHandler.deselectPlace());
            }

            const onScriptLoaded = () => google.maps.event.addDomListener(window, 'load', init);

            this._loadGoogleApis(onScriptLoaded, tag).then(() => {
                this.mapHandler.initMap(mapStyle, startPos, noGeoloc);

                const onMarkerClick = popup ? marker => this._selectPlace(marker) : null;

                this.mapHandler.setPlaces(places, this._getOffsetX(), 0, onMarkerClick, clusterer);

                if (this.mapSearch) {
                    this.mapSearch.initSearch();
                }

                this._addListeners();
            });
        }
    }

    /*
    *	Add Google Api as a script tag in header.
    */
    _loadGoogleApis(onScriptLoaded, tag) {
        return new Promise((resolve, reject) => {
            if (typeof google !== 'undefined') onScriptLoaded();

            const tagScript = document.createElement('script');
            tagScript.src = tag;
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tagScript, firstScriptTag);

            // Resolve the promise when google maps script are loaded
            tagScript.addEventListener('load', () => resolve());

            // If not loaded after x sec, reject the promise
            setTimeout(() => reject(), 5000);
        });
    }

    _addListeners() {

        // Debouncing!
        let allowTrigger = true;

        this.mapHandler.map.addListener('bounds_changed', () => {
            if (allowTrigger) {
                if (this.sidebarHandler) {
                    this.sidebarHandler.populateSidebar(this.mapHandler.getVisibleMarkers(), this._selectPlace.bind(this), !!this.mapHandler.clientPosition);
                    this.mapSearch.updateBounds(this.mapHandler.map.getBounds());
                }
                allowTrigger = false;
                setTimeout(() => allowTrigger = true, 100);
            }
        });

        const close = () => {
            if (this.mapPopup && allowTrigger) {
                this._popupClose();
            }
        }

        this.mapHandler.map.addListener('drag', close);
        this.mapHandler.map.addListener('zoom_changed', close);
    }

    _goToSearchedPlace(searchedPlace) {
        this.mapHandler.goToSearchedPlace(searchedPlace).then(googlePlace => {

            // See if there is a place matching the searchResult
            const maybeMatchingPlace = this.places.find(place =>
                Places._addressesEqual(googlePlace.formatted_address, place.address) &&
                Places._namesEqual(googlePlace.name, place.name)
            );

            // We have a match!
            if (maybeMatchingPlace) {
                this._selectPlace(maybeMatchingPlace);
            } else if (googlePlace.types.includes('point_of_interest')) { // We do not have a match, but the place might be interesting
                this.mapPopup.createAndShowPromptPopup(googlePlace);
            } else { // This could be for example an area
                this._popupClose();

                // The boolean is for showing the number of visible markers in the searched area
                this.sidebarHandler.setNumberVisibleMarkers(this.mapHandler.getVisibleMarkers(), true);
            }
        });
    }

    _selectPlace(marker) {
        const popup = this.mapPopup.createPlacePopup(marker.item);
        this.mapHandler.selectPlace(marker, this._getOffsetX(), this._getOffsetY(popup));
        this.mapPopup.showPopup();
    }

    _popupClose() {
        this.mapPopup.closePopup();
        this.mapHandler.deselectPlace();
    }

    static _addressesEqual(googleAddress, placeAddress) {
        return googleAddress &&
            placeAddress &&
            googleAddress.toLowerCase().trim().replace(/,/g, '').replace(/ /g, '').startsWith(
                placeAddress.toLowerCase().trim().replace(/,/g, '').replace(/ /g, ''));
    }

    static _namesEqual(googleName, placeName) {
        return googleName && placeName &&
            googleName.toLowerCase().trim().replace(/ /g, '') ===
            placeName.toLowerCase().trim().replace(/ /g, '');
    }

    _getOffsetX() {
        return (isMobile() || !this.sidebarHandler) ? 0 : 150;
    }

    _getOffsetY(popup) {
        const height = parseFloat(window.getComputedStyle(popup).height.split('px')[0]);
        const OFFSET_Y = 60; //px
        return (height / 2) + OFFSET_Y;
    }
}

export const MOBILE_BP = 960;
export const isMobile = () => document.body.clientWidth < MOBILE_BP; // $bp-medium;
export const SELECTOR_CLASS = 'places';

export default Places;