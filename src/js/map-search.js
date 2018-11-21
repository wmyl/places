import { SELECTOR_CLASS } from "./index";

class MapSearch {
    constructor(onPlaceChange) {
        this.input = document.querySelector(`.${SELECTOR_CLASS}-search-bar__input`);
        this.btn = document.querySelector(`.${SELECTOR_CLASS}-search-bar__btn`);
        this.onPlaceChange = onPlaceChange;
    }

    initSearch() {
        const options = {
            componentRestrictions: {country: 'se'}
        };

        this.autocomplete = new google.maps.places.Autocomplete(this.input, options);

        this.autocomplete.addListener('place_changed', () => {
            this.onPlaceChange(this.autocomplete.getPlace());
            this.input.value = '';
        });

        this.btn.onclick = () => {
            if (this.input.value && this.input.value.length > 0) {
                this.onPlaceChange({name: this.input.value});
                this.input.value = '';
            }
        };
    }

    updateBounds(bounds) {
        this.autocomplete.setBounds(bounds);
    }

    static getHTML(searchOptions = {}) {
        return `<div class="${SELECTOR_CLASS}-search-bar">` +
                    `<label for="search" class="${SELECTOR_CLASS}-visually-hidden">Sök</label>` +
                    `<input class="${SELECTOR_CLASS}-search-bar__input" id="search" placeholder="${searchOptions.placeholder ? searchOptions.placeholder : ''}" type="text" />` +
                    `<button class="${SELECTOR_CLASS}-search-bar__btn" title="sök">` +
                        (searchOptions.searchIcon ? `<img src="${searchOptions.searchIcon}" class="${SELECTOR_CLASS}-search-bar__icon" alt="sök">` : 'Sök') +
                    '</button>' +
                '</div>';
    }
}

export default MapSearch;