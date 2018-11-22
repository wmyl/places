import MapHandler from './map-handler';
import MapSidebarHandler from './map-sidebar-handler';
import MapSearch from './map-search';
import MapPopup from './map-popup';

/* MINIMUM STYLE FOR LIBRARY */
import '../scss/style.scss';

class Places {

    constructor({ tag, places, sidebar, popup, imagePath, clusterer, mapStyle }) {

        if (document.querySelector('.' + SELECTOR_CLASS)) {
            this.mapHandler = new MapHandler(imagePath);

            if (sidebar) {
                this.sidebarHandler = new MapSidebarHandler(sidebar, imagePath);
                this.mapSearch = new MapSearch(this.goToSearchedPlace.bind(this));
            }

            if (popup) {
                this.mapPopup = new MapPopup(popup, !!sidebar, () => this.mapHandler.deselectPlace());
            }

            const onScriptLoaded = () => google.maps.event.addDomListener(window, 'load', init);

            this.loadGoogleApis(onScriptLoaded, tag).then(() => {
                this.mapHandler.initMap(mapStyle);

                const onMarkerClick = popup ? marker => this.selectPlace(marker) : null;

                this.mapHandler.setPlaces(places, this.getOffsetX(), 0, onMarkerClick, clusterer);

                this.mapHandler.getLocation();

                if (this.mapSearch) {
                    this.mapSearch.initSearch();
                }

                this.addListeners();
            });
        }
    }

    /*
    *	Add Google Api as a script tag in header.
    */
    loadGoogleApis(onScriptLoaded, tag) {
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

    addListeners() {

        // Debouncing!
        let allowTrigger = true;

        this.mapHandler.map.addListener('bounds_changed', () => {
            if (allowTrigger) {
                if (this.sidebarHandler) {
                    this.sidebarHandler.populateSidebar(this.mapHandler.getVisibleMarkers(), this.selectPlace.bind(this), this.mapHandler.clientPosition);


                    this.mapSearch.updateBounds(this.mapHandler.map.getBounds());
                }
                allowTrigger = false;
                setTimeout(() => allowTrigger = true, 100);
            }
        });

        const close = () => {
            if (this.mapPopup && allowTrigger) {
                this.popupClose();
            }
        }

        this.mapHandler.map.addListener('drag', close);
        this.mapHandler.map.addListener('zoom_changed', close);
    }

    goToSearchedPlace(searchedPlace) {
        this.mapHandler.goToSearchedPlace(searchedPlace).then(googlePlace => {

            // See if there is a place matching the searchResult
            const maybeMatchingPlace = this.places.find(place =>
                Places.addressesEqual(googlePlace.formatted_address, place.address) &&
                Places.namesEqual(googlePlace.name, place.name)
            );

            // We have a match!
            if (maybeMatchingPlace) {
                this.selectPlace(maybeMatchingPlace);
            } else if (googlePlace.types.includes('point_of_interest')) { // We do not have a match, but the place might be interesting
                this.mapPopup.createAndShowPromptPopup(googlePlace);
            } else { // This could be for example an area
                this.popupClose();

                // The boolean is for showing the number of visible markers in the searched area
                this.sidebarHandler.setNumberVisibleMarkers(this.mapHandler.getVisibleMarkers(), true);
            }
        });
    }

    selectPlace(marker) {
        const popup = this.mapPopup.createPlacePopup(marker.item);
        this.mapHandler.selectPlace(marker, this.getOffsetX(), this.getOffsetY(popup));
        this.mapPopup.showPopup();
    }

    popupClose() {
        this.mapPopup.closePopup();
        this.mapHandler.deselectPlace();
    }

    static addressesEqual(googleAddress,placeAddress) {
        return googleAddress &&
               placeAddress &&
               googleAddress.toLowerCase().trim().replace(/,/g, '').replace(/ /g, '').startsWith(
               placeAddress.toLowerCase().trim().replace(/,/g, '').replace(/ /g, ''));
    }

    static namesEqual(googleName, placeName) {
        return googleName && placeName &&
               googleName.toLowerCase().trim().replace(/ /g, '') ===
               placeName.toLowerCase().trim().replace(/ /g, '');
    }

    getOffsetX() {
        return (isMobile() || !this.sidebarHandler) ? 0 : 150;
    }

    getOffsetY(popup) {
        const height = parseFloat(window.getComputedStyle(popup).height.split('px')[0]);
        const OFFSET_Y = 60; //px
        return (height / 2) + OFFSET_Y;
    }
}

export const MOBILE_BP = 960;
export const isMobile = () => document.body.clientWidth < MOBILE_BP; // $bp-medium;
export const SELECTOR_CLASS = 'places';

export default Places;