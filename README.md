# @wmyl/places [![npm version](https://img.shields.io/npm/v/@wmyl/places.svg?style=flat-square)](https://www.npmjs.com/package/@wmyl/places)</a>

Interactive map based on Google Maps. Each place can have a popup with information, along with other features such as in-view list and clustering.

<!-- EXAMPLE PICS HERE -->

## Installation

`npm install --save @wmyl/places`

## Usage

**Step 1 - Add HTML**

Add container such as `div` with class name `places` in HTML

`<div class="places"></div>`

**Step 2 - Init JavaScript**
```
import Places from '@wmyl/places';

...

const options = {
    tag: "https://maps.googleapis.com/maps/api/js?key=<YOUR_KEY_HERE>",
    places: [{
        lat: 57.682909,
        lng: 11.932970,
        name: 'My First Place'
        address: 'Exampleroad 23',
        link: 'https://github.com/wmyl/places',
        phone: '555-1234567',
        comment: 'This place is wonderful!'
    }, {
        lat: 58.232909,
        lng: 07.562970,
        name: 'My Second Place'
        address: 'Exampleroad 25',
        link: 'https://github.com/wmyl/places',
        phone: '555-1234569',
        comment: 'This place is almost as wonderful!'
    }],
    popup: true,
    mapStyle: 'minimalistic',
    imagePath: '/assets/static/images/dog',
    sidebar: {
        footer: {
            text: 'Visit our site!',
            logo: '/assets/static/images/companyLogo.png',
            logoLink: 'https://github.com/wmyl/places'
        }
    },
};

new Places(options);

...

```

