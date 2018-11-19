class MapPopup {

    constructor(popupOptions, mapDiv, onClose) {
        this.sidebar = document.querySelector('.m-sidebar');
        this.popupOptions = popupOptions;
        this.buttonBarIcon = document.querySelector('.m-mobile-buttons-bar__icon--toggle');

        this.buildPopup(mapDiv);

        this.popup = document.querySelector('.m-popup');
        this.popupContainer = this.popup.querySelector('.m-popup__container');
        this.popupClose = this.popup.querySelector('.m-popup__close');
        this.popupClose.addEventListener('click', () => this.closePopup(onClose));
    }

    closePopup(onClose) {
        this.popup.classList.add('m-popup--close');

        if (onClose) onClose();
    }

    buildPopup(mapDiv) {
        const html = '<div class="m-popup m-popup--close">' +
            '<button class="m-popup__close">x</button>' +
            '<div class="m-popup__container"></div>' +
            '</div>';

        mapDiv.insertAdjacentHTML('beforeend', html);
    }

    showPopup() {
        if(this.popup.classList.contains('m-popup--close')) {
            this.popup.classList.remove('m-popup--close');

            if (this.sidebar) {
                this.sidebar.classList.add('m-sidebar--hidden');
            }

            if (this.buttonBarIcon) {
                this.buttonBarIcon.classList.add('m-mobile-buttons-bar__icon--up');
            }
        }
    }

    createPlacePopup(place) {
        const name = (place.name) ? "<h2 class='m-popup__title'>"+place.name+"</h2>" : '';
        const address = (place.address) ? "<p class='m-popup__address'>"+place.address+"</p>" : '';
        const comment = (place.comment) ? "<p>"+place.comment+"</p>" : '';
        const phone = (place.phone) ? "<a href='tel:"+place.phone+"'>"+place.phone+"</a>" : '';
        const link = (place.link) ? "<a href='"+this.addHTTP(place.link)+"' target='_blank' rel='noreferrer nofollow'>Webbplats</a>" : '';

        const html =
            name +
            address +
            comment +
            "<div class='m-popup__contact'>" +
            phone +
            link +
            "</div>";

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
            const title = (place.name) ? "<h2 class='m-popup__title'>Tyvärr!</h2>" : '';
            const text = `<p>Vi hittar tyvärr inte några resultat på <i>"${place.name}"</i>.</p>`;

            const contactUs = link && textLink ? `<p><a href="${link}">${textLink}</a></p>` : '';

            html =
                "<div>" +
                title +
                text +
                contactUs +
                "</div>";
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