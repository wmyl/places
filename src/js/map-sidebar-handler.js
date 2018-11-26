import MapSearch from './map-search';
import MobileButtonsBar from './mobile-buttons-bar';

import {isMobile, SELECTOR_CLASS} from "./index";

class MapSidebarHandler {
    constructor(sidebarOptions, imagePath) {

        this.imagePath = imagePath;
        MapSidebarHandler._buildSidebar(sidebarOptions);

        this.resultWrapper = document.querySelector(`.${SELECTOR_CLASS}-sidebar__results`);
        this.buttonBarResult = document.querySelector(`.${SELECTOR_CLASS}-mobile-buttons-bar__result`);
        this.sidebarNumberPlaces = document.querySelector(`.${SELECTOR_CLASS}-sidebar__number-places`);


        new MobileButtonsBar();
    }

    populateSidebar(visibleMarkers, onclick, position) {

        this._sortMarkers(visibleMarkers, position).forEach(marker => {
            const {name, type,} = marker.item;

            const item = document.createElement("BUTTON");
            item.classList.add(`${SELECTOR_CLASS}-sidebar-item`);
            item.onclick = () => onclick(marker);
            item.innerHTML = `<span class="${SELECTOR_CLASS}-sidebar-item__name">${name}</span>` +
                (this.imagePath ?
                        `<img class="${SELECTOR_CLASS}-sidebar-item__logo " src="${this.imagePath}${marker.item.type ? marker.item.type : ''}.png" alt="${type}"/>` :
                        `<div></div>`
                );

            this.resultWrapper.appendChild(item);
        });

        this.setNumberVisibleMarkers(visibleMarkers);
    }

    setNumberVisibleMarkers(visibleMarkers, isArea) {
        const content = visibleMarkers.length + ' plats' + (visibleMarkers.length !== 1 ? 'er' : '') + (isArea ? ' i närheten' : '');
        if (isMobile()) {
            this.buttonBarResult.innerHTML = content;
        } else {
            this.sidebarNumberPlaces.innerHTML = content;
        }
    }

    static _buildSidebar({searchBar, footer, mobileListToggleIcon}) {
        let html = `<div class="${SELECTOR_CLASS}-sidebar">`;

        html += `<div class="${SELECTOR_CLASS}-sidebar__search">` +
            MapSearch.getHTML(searchBar) +
            '</div>';
        html += MapSidebarHandler._getMobileBarHTML({searchBar, mobileListToggleIcon})
        html += `<div class="${SELECTOR_CLASS}-sidebar__wrapper">` +
            `<div class="${SELECTOR_CLASS}-sidebar__results"></div>` +
            `<span class="${SELECTOR_CLASS}-sidebar__number-places">0 platser</span>` +
            MapSidebarHandler._getFooterHTML(footer) +

            '</div>' +
            '</div>';

        document.querySelector(`.${SELECTOR_CLASS}`).insertAdjacentHTML('beforeend', html);
    }

    static _getFooterHTML(footerOptions) {
        if (footerOptions && footerOptions.html) {
            return footerOptions.html;
        }

        let html = `<footer class="${SELECTOR_CLASS}-footer">`;

        if (!footerOptions) return '<footer></footer>';

        const {text, logo, logoLink, logoTitle, logoSVG} = footerOptions;

        if (text) {
            html += `<p class="${SELECTOR_CLASS}-footer__text">${text}</p>`;
        }

        if (logo) {
            if (logoLink) {
                html += `<a class="${SELECTOR_CLASS}-footer__logo ${SELECTOR_CLASS}-footer__logo--link" ` +
                    `href="${logoLink}" title="${logoTitle ? logoTitle : 'Footer Logo'}" target="_blank" rel="noopener noreferrer nofollow">`
            } else {
                html += `<div class=${SELECTOR_CLASS}-footer__logo>`
            }


            if (logoSVG) {
                html += `<svg role="img" class="${SELECTOR_CLASS}-footer__image">` +
                    `<use xlink:href="${logo}"/>` +
                    '</svg>';
            } else {
                html += `<img src="${logo}" class="${SELECTOR_CLASS}-footer__image"/>`
            }

            if (logoLink) {
                html += '</a>';
            } else {
                html += '</div>';
            }
        }

        html += '</footer>';

        return html;
    }

    static _getMobileBarHTML(sidebarOptions) {
        return `<div class="${SELECTOR_CLASS}-mobile-buttons-bar">` +
            `<span class="${SELECTOR_CLASS}-mobile-buttons-bar__result">` +
            '0 platser' +
            '</span>' +
            `<button class="${SELECTOR_CLASS}-mobile-buttons-bar__btn ${SELECTOR_CLASS}-mobile-buttons-bar__btn--search">` +
            (sidebarOptions.searchBar && sidebarOptions.searchBar.searchIcon ? `<img src="${sidebarOptions.searchBar.searchIcon}" class="${SELECTOR_CLASS}-search-bar__icon" alt="sök">` : 'Sök') +
            '</button>' +
            `<button class="${SELECTOR_CLASS}-mobile-buttons-bar__btn ${SELECTOR_CLASS}-mobile-buttons-bar__btn--toggle">` +
            (sidebarOptions.mobileListToggleIcon ?
                `<img src="${sidebarOptions.mobileListToggleIcon}" class="${SELECTOR_CLASS}-mobile-buttons-bar__icon ${SELECTOR_CLASS}-mobile-buttons-bar__icon--toggle">` :
                `<span class="${SELECTOR_CLASS}-mobile-buttons-bar__icon ${SELECTOR_CLASS}-mobile-buttons-bar__icon--toggle">V</span>`) +
            '</button>' +
            '</div>';
    }

    _sortMarkers(markers, position) {
        if (position) { // Sort by distance
            return markers.sort((a, b) =>
                MapSidebarHandler._getDistance(
                    position,
                    {
                        lat: parseFloat(a.item.lat),
                        lng: parseFloat(a.item.lng)
                    }
                ) < MapSidebarHandler._getDistance(
                position,
                {
                    lat: parseFloat(b.item.lat),
                    lng: parseFloat(b.item.lng)
                }
                ));
        } else { // Sort in alphabetic order
            return markers.sort((a, b) => a.item.name < b.item.name ? -1 : 1);
        }
    }

    static _getDistance(pos1, pos2) {
        const dx = pos2.lat - pos1.lat;
        const dy = pos2.lng - pos2.lng;

        return Math.sqrt(Math.pow(2, dx) + Math.pow(2, dy));
    }
}

export default MapSidebarHandler;