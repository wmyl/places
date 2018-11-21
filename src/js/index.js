import MapHandler from './map-handler';
import MapSidebarHandler from './map-sidebar-handler';
import MapSearch from './map-search';
import MapPopup from './map-popup';

/* MINIMUM STYLE FOR LIBRARY */
import '../scss/style.scss';

class Places {

    constructor(options) {

        const {
            tag,
            places,
            sidebar,
            popup,
            loadingScreen,
            imagePath,
            clusterer,
        } = options;

        this.options = options;

        const mapDiv = document.querySelector('.' + SELECTOR_CLASS);

        if (mapDiv) {
            this.mapHandler = new MapHandler(
                imagePath,
                clusterer,
            );

            if (sidebar) {
                this.sidebarHandler = new MapSidebarHandler(sidebar, imagePath);
                if (sidebar.searchBar) {
                    this.mapSearch = new MapSearch(this.goToSearchedPlace.bind(this));
                }
            }

            if (popup) {
                this.mapPopup = new MapPopup(
                    popup,
                    !!sidebar,
                    () => this.mapHandler.deselectPlace()
                );
            }

            if (loadingScreen) {
                this.loadScreen = document.querySelector(`.${SELECTOR_CLASS}-loading-screen`);
            }

            this.loadGoogleApis(() => google.maps.event.addDomListener(window, 'load', init));
        }
    }

    doneLoaded() {
        setTimeout(() => {
            if (this.loadScreen) {
                this.loadScreen.classList.add('o-loading-screen--hidden');
            }
        }, 500);
    }

    /*
    *	Add Google Api as a script tag in header.
    */
    loadGoogleApis(onScriptLoaded) {
        if (typeof google !== 'undefined') onScriptLoaded();

        let tag = document.createElement('script');
        tag.src = this.options.tag;
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        tag.addEventListener('load', () => {
            this.mapHandler.initMap(this.options.mapStyle);
            this.mapHandler.setPlaces(this.options.places, isMobile() ? 0 : 150, 0, this.options.popup ? this.selectPlace.bind(this) : null);
            this.mapHandler.getLocation();

            if (this.mapSearch) {
                this.mapSearch.initSearch();
            }

            this.addListeners();
            this.doneLoaded();
        });
    }

    addListeners() {

        // Debouncing!
        let allowTrigger = true;

        this.mapHandler.map.addListener('bounds_changed', () => {
            if (allowTrigger) {
                if (this.sidebarHandler) {
                    this.sidebarHandler.populateSidebar(this.mapHandler.getVisibleMarkers(), this.selectPlace.bind(this), this.mapHandler.clientPosition);


                    //this.mapSearch.updateBounds(this.mapHandler.map.getBounds());
                }
                allowTrigger = false;
                setTimeout(() => allowTrigger = true, 100);
            }
        });

        this.mapHandler.map.addListener('drag', () => {
            if (this.mapPopup && allowTrigger) {
                this.popupClose();
            }
        });
        this.mapHandler.map.addListener('zoom_changed', () => {
            if (this.mapPopup && allowTrigger) {
                this.popupClose();
            }
        });
    }

    goToSearchedPlace(searchedPlace) {
        this.mapHandler.goToSearchedPlace(searchedPlace).then(place => {
            const maybeDogFriendlyPlace = this.mapHandler.markers.filter(marker =>
                Places.addressesEqual(place.formatted_address, marker.item.address) &&
                Places.namesEqual(place.name, marker.item.name)
            )[0];

            if (maybeDogFriendlyPlace) {
                this.selectPlace(maybeDogFriendlyPlace);
            } else if (place.types.includes('point_of_interest')) {
                this.mapPopup.createAndShowPromptPopup(place);
            } else {
                this.popupClose();
                this.sidebarHandler.setNumberVisibleMarkers(this.mapHandler.getVisibleMarkers(), true);
            }
        });
    }

    selectPlace(marker) {
        const popup = this.mapPopup.createPlacePopup(marker.item);
        const height = parseFloat(window.getComputedStyle(popup).height.split('px')[0]);
        const OFFSET_Y = 60; //px
        this.mapHandler.selectPlace(marker, (isMobile() || !this.sidebarHandler) ? 0 : 150, (height / 2) + OFFSET_Y);
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

    static formatClassName(selector) {
        return selector.charAt(0) === '.' ? selector : ('.' + selector);
    }
}

export const MOBILE_BP = 960;
export const isMobile = () => document.body.clientWidth < MOBILE_BP; // $bp-medium;
export const SELECTOR_CLASS = 'places';

export default Places;