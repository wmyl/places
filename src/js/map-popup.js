import { SELECTOR_CLASS, isMobile } from "./index";

class MapPopup {

    constructor(popupOptions, hasSidebar, onClose) {
        this.sidebar = document.querySelector(`.${SELECTOR_CLASS}-sidebar`);
        this.popupOptions = popupOptions;
        this.buttonBarIcon = document.querySelector(`.${SELECTOR_CLASS}-mobile-buttons-bar__icon--toggle`);

        MapPopup._buildPopup(hasSidebar);

        this.popup = document.querySelector(`.${SELECTOR_CLASS}-popup`);
        this.popupContainer = this.popup.querySelector(`.${SELECTOR_CLASS}-popup__container`);
        this.popupClose = this.popup.querySelector(`.${SELECTOR_CLASS}-popup__close`);
        this.popupClose.addEventListener('click', () => this.closePopup(onClose));
    }

    closePopup(onClose) {
        this.popup.classList.add(`${SELECTOR_CLASS}-popup--close`);

        if (onClose) onClose();
    }

    showPopup() {
        if(this.popup.classList.contains(`${SELECTOR_CLASS}-popup--close`)) {
            this.popup.classList.remove(`${SELECTOR_CLASS}-popup--close`);

            if (this.sidebar) {
                this.sidebar.classList.add(`${SELECTOR_CLASS}-sidebar--hidden`);
            }

            if (this.buttonBarIcon) {
                this.buttonBarIcon.classList.add(`${SELECTOR_CLASS}-mobile-buttons-bar__icon--up`);
            }
        }
    }

    createPlacePopup(place) {
        this.popupContainer.innerHTML = ((place.name) ? `<h2 class="${SELECTOR_CLASS}-popup__title">${place.name}</h2>` : '') +
                   ((place.address) ? `<p class="${SELECTOR_CLASS}-popup__address">${place.address}</p>` : '') +
                   ((place.comment) ? `<p>${place.comment}</p>` : '') +
                   `<div class="${SELECTOR_CLASS}-popup__contact">` +
                       ((place.phone) ? `<a href="tel:${place.phone}">${place.phone}</a>` : '') +
                       ((place.link) ? `<a href="${MapPopup._addHTTP(place.link)}" target="_blank" rel="noreferrer nofollow">Webbplats</a>` : '') +
                   '</div>';

        return this.popupContainer;
    }

    createAndShowPromptPopup(place) {
        const { link, textLink, noResultHTML, noResultText } = this.popupOptions;

        if (noResultHTML) {
            this.popupContainer.innerHTML = `<div>${noResultHTML}</div>`;
        } else {
            this.popupContainer.innerHTML = '<div>' +
                    `<h2 class="${SELECTOR_CLASS}-popup__title">Tyvärr!</h2>`;

            if (noResultText) {
                this.popupContainer.innerHTML += `<p>${noResultText.replace('<PLACE_NAME>', place.name)}</p>`;
            } else {
                this.popupContainer.innerHTML += `<p>Vi hittar tyvärr inte några resultat på <i>"${place.name}"</i>.</p>`;
            }

            this.popupContainer.innerHTML += (link && textLink ? `<p><a href="${link}">${textLink}</a></p>` : '') +
                                        '</div>';
        }
        this.showPopup();
        return this.popupContainer;
    }

    static _addHTTP(word) {
        if(word.charAt(0) === 'w') {
            return 'http://'+word;
        }
        return word;
    }

    static _buildPopup(hasSidebar) {
        const mapDiv = document.querySelector('.' + SELECTOR_CLASS);

        const html = `<div class="${SELECTOR_CLASS}-popup ${SELECTOR_CLASS}-popup--close ` +
            `${hasSidebar && !isMobile() ? (SELECTOR_CLASS + '-popup--sidebar') : ''}">` +
            `<button class="${SELECTOR_CLASS}-popup__close">x</button>` +
            `<div class="${SELECTOR_CLASS}-popup__container"></div>` +
            '</div>';

        mapDiv.insertAdjacentHTML('beforeend', html);
    }
}

export default MapPopup;