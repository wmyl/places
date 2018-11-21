import MapSearch from './map-search';
import MobileButtonsBar from './mobile-buttons-bar';

import { SELECTOR_CLASS } from "./index";

class MapSidebarHandler {
    constructor(sidebarOptions, imagePath) {

        this.imagePath = imagePath;
        this.sidebarOptions = sidebarOptions;
        this.buildSidebar(sidebarOptions);

        this.resultWrapper = document.querySelector(`.${SELECTOR_CLASS}-sidebar__results`);
        this.buttonBarResult = document.querySelector(`.${SELECTOR_CLASS}-mobile-buttons-bar__result`);
        this.sidebarNumberPlaces = document.querySelector(`.${SELECTOR_CLASS}-sidebar__number-places`);

        if (this.resultWrapper) {
            this.resultWrapperHTML = this.resultWrapper.innerHTML;
        }

        if (sidebarOptions.mobileBreakpoint) {
            new MobileButtonsBar();
        }
    }

    buildSidebar ({ mobileBreakpoint, searchBar }) {
        let html = `<div class="${SELECTOR_CLASS}-sidebar">`;

        if (searchBar) {
            html += `<div class="${SELECTOR_CLASS}-sidebar__search">` +
                                    MapSearch.getHTML(searchBar) +
                                '</div>';
        }

        if (mobileBreakpoint) {
            html += this.getMobileBarHTML({mobileBreakpoint, searchBar})
        }

        html += `<div class="${SELECTOR_CLASS}-sidebar__wrapper">` +
                                `<div class="${SELECTOR_CLASS}-sidebar__results"></div>` +
                                `<span class="${SELECTOR_CLASS}-sidebar__number-places">0 platser</span>` +
                                // Footer
                            '</div>' +
                        '</div>';

        document.querySelector(`.${SELECTOR_CLASS}`).insertAdjacentHTML('beforeend', html);
    }

    getMobileBarHTML(sidebarOptions) {
        return `<div class="${SELECTOR_CLASS}-mobile-buttons-bar">` +
                       `<span class="${SELECTOR_CLASS}-mobile-buttons-bar__result">` +
                           '0 platser' +
                       '</span>' +
                       `<button class="${SELECTOR_CLASS}-mobile-buttons-bar__btn ${SELECTOR_CLASS}-mobile-buttons-bar__btn--search">` +
                            (sidebarOptions.searchBar.searchIcon ? `<img src="${sidebarOptions.searchBar.searchIcon}" class="${SELECTOR_CLASS}-search-bar__icon" alt="sök">` : '') +
                        '</button>' +
                       `<button class="${SELECTOR_CLASS}-mobile-buttons-bar__btn m-mobile-buttons-bar__btn--toggle">` +
                           `<img src="${sidebarOptions.mobileListToggle}" class="${SELECTOR_CLASS}-mobile-buttons-bar__icon ${SELECTOR_CLASS}-mobile-buttons-bar__icon--toggle">` +
                       '</button>' +
                   '</div>';
    }

    populateSidebar(visibleMarkers, onclick, position) {
        const { resultWrapper, resultWrapperHTML } = this;
        if (!resultWrapper) return;

        resultWrapper.innerHTML = resultWrapperHTML;

        this.sortMarkers(visibleMarkers, position).forEach(marker => {
            const {
                name,
                type,
                address,
                long,
                lat,
                link,
                phone,
                comment,
            } = marker.item;

            const item = document.createElement("BUTTON");
            item.classList.add(`${SELECTOR_CLASS}-sidebar-item`);
            item.onclick = () => onclick(marker);
            item.innerHTML = `<span class="${SELECTOR_CLASS}-sidebar-item__name">${name}</span>` +
                             `<img class="${SELECTOR_CLASS}-sidebar-item__logo " src="${this.imagePath}${marker.item.type ? marker.item.type : ''}.png" alt="${type}"/>`;

            resultWrapper.appendChild(item);
        });

        this.setNumberVisibleMarkers(visibleMarkers);
    }

    setNumberVisibleMarkers(visibleMarkers, fromSearch) {
        const content = visibleMarkers.length + ' plats' + (visibleMarkers.length !== 1 ? 'er' : '') + (fromSearch ? ' i närheten' : '');
        if (!!this.sidebarOptions.mobileBreakpoint) {
            this.buttonBarResult.innerHTML = content;
        } else {
            this.sidebarNumberPlaces.innerHTML = content;
        }
    }

    sortMarkers(markers, position) {
        if (position) { // Sort by distance
            return markers.sort((a,b) =>
                MapSidebarHandler.getDistance(
                    position,
                    {
                        lat: parseFloat(a.item.lat),
                        lng: parseFloat(a.item.lng)
                    }
                ) < MapSidebarHandler.getDistance(
                    position,
                    {
                        lat: parseFloat(b.item.lat),
                        lng: parseFloat(b.item.lng)
                    }
                ));
        } else { // Sort in alphabetic order
            return markers.sort((a,b) => a.item.name < b.item.name ? -1 : 1);
        }
    }

    static getDistance(pos1, pos2) {
        const dx = pos2.lat - pos1.lat;
        const dy = pos2.lng - pos2.lng;

        return Math.sqrt(Math.pow(2, dx) + Math.pow(2, dy));
    }
}

export default MapSidebarHandler;