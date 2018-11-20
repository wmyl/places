import { SELECTOR_CLASS } from "./index";

class MapPopup {

    constructor(popupOptions, mapDiv, onClose) {
        this.sidebar = document.querySelector(`.${SELECTOR_CLASS}-sidebar`);
        this.popupOptions = popupOptions;
        this.buttonBarIcon = document.querySelector(`.${SELECTOR_CLASS}-mobile-buttons-bar__icon--toggle`);

        this.buildPopup(mapDiv);

        this.popup = document.querySelector(`.${SELECTOR_CLASS}-popup`);
        this.popupContainer = this.popup.querySelector(`.${SELECTOR_CLASS}-popup__container`);
        this.popupClose = this.popup.querySelector(`.${SELECTOR_CLASS}-popup__close`);
        this.popupClose.addEventListener('click', () => this.closePopup(onClose));
    }

    closePopup(onClose) {
        this.popup.classList.add(`${SELECTOR_CLASS}-popup--close`);

        if (onClose) onClose();
    }

    buildPopup(mapDiv) {
        const html = `<div class="${SELECTOR_CLASS}-popup ${SELECTOR_CLASS}-popup--close">` +
            `<button class="${SELECTOR_CLASS}-popup__close">x</button>` +
            `<div class="${SELECTOR_CLASS}-popup__container"></div>` +
            '</div>';

        mapDiv.insertAdjacentHTML('beforeend', html);
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
        const name = (place.name) ? `<h2 class="${SELECTOR_CLASS}-popup__title">${place.name}</h2>` : '';
        const address = (place.address) ? `<p class="${SELECTOR_CLASS}-popup__address">${place.address}</p>` : '';
        const comment = (place.comment) ? `<p>${place.comment}</p>` : '';
        const phone = (place.phone) ? `<a href="tel:${place.phone}">${place.phone}</a>` : '';
        const link = (place.link) ? `<a href="${this.addHTTP(place.link)}" target="_blank" rel="noreferrer nofollow">Webbplats</a>` : '';

        const html =
            name +
            address +
            comment +
            `<div class="${SELECTOR_CLASS}-popup__contact">` +
            phone +
            link +
            '</div>';

        this.popupContainer.innerHTML = html;

        return this.popupContainer;
    }

    createAndShowPromptPopup(place) {
        const {
            link,
            textLink,
            noResultHTML,
        } = this.popupOptions;

        let html = '';

        if (noResultHTML) {
            html =
                "<div>" +
                noResultHTML +
                "</div>";

        } else {
            const title = (place.name) ? `<h2 class="${SELECTOR_CLASS}-popup__title">Tyvärr!</h2>` : '';
            const text = `<p>Vi hittar tyvärr inte några resultat på <i>"${place.name}"</i>.</p>`;

            const contactUs = link && textLink ? `<p><a href="${link}">${textLink}</a></p>` : '';

            html =
                '<div>' +
                title +
                text +
                contactUs +
                '</div>';
        }



        this.popupContainer.innerHTML = html;

        this.showPopup();

        return this.popupContainer;
    }

    addHTTP(word) {
        if(word.charAt(0) === 'w') {
            return 'http://'+word;
        }
        return word;
    }
}

export default MapPopup;