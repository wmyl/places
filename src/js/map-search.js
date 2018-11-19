class MapSearch {
    constructor(onPlaceChange) {
        this.input = document.querySelector('.m-search-bar__input');
        this.btn = document.querySelector('.m-search-bar__btn');
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

    static getHTML(searchOptions) {
        return '<div class="m-search-bar">' +
                    '<label for="search" class="u-visually-hidden">Sök</label>' +
                    `<input class="m-search-bar__input" id="search" placeholder="${searchOptions.placeholder ? searchOptions.placeholder : ''}" type="text" />` +
                    '<button class="m-search-bar__btn" title="sök">' +
                        (searchOptions.searchIcon ? `<img src="${searchOptions.searchIcon}" class="m-search-bar__icon" alt="sök">` : '') +
                    '</button>' +
                '</div>';
    }
}

export default MapSearch;