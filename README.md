# @wmyl/places [![npm version](https://img.shields.io/npm/v/@wmyl/places.svg?style=flat-square)](https://www.npmjs.com/package/@wmyl/places)</a>

Interactive map based on Google Maps. Each place can have a popup with information, along with other features such as in-view list and clustering.

<!-- EXAMPLE PICS HERE -->

## Installation

`npm install --save @wmyl/places`

## Usage

**Step 1 - Get Google Maps API key**

Don't worry! It's free, at least for a smaller amount of request.

https://developers.google.com/maps/documentation/javascript/get-api-key 

**Step 2 - Add HTML**

Add container such as `div` with class name `places` in HTML

`<div class="places"></div>`

**Step 3 - Init JavaScript**
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

**Step 4 (Optional) - Add custom styling**

You can override all styling on the map with your own css.

<!-- TODO: Describe how -->

## Options

|Option    | Type    | Required | Default                                | Example use                         | Description                                                                  
| -------- | ------- | -------- |--------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------- |
|tag       | string  | Yes      |                                        |                                     | Google Maps Script tag with API Key |
|places    | array   | No       | `[]`                                   |                                     | List of place objects |
|popup     | Boolean | No       | `false`                                |                                     | Whether or not to show popup when a marker is clicked |
|mapStyle  | any     | No       | `'default'`                            |                                     | Use one of predefined map styles or provide own |
|startPos  | object  | No       | `{ lon: 57.7004286, lat: 11.9543521 }` |                                     | Start position of map. Will change if geoloc is enabled and position is found
|noGeoloc  | Boolean | No       | `false`                                | `true`                              | Set to true to disable geolocation in map |
|imagePath | string  | No       |                                        | `'/assets/images/marker'`           | Path to image. Will pick different depending on place type. |
|sidebar   | any     | No       |                                        | `{ footer: { text: 'Visit us!' } }` | Whether to use sidebar or not and if so, specify options |
|clusterer | any     | No       | `false`                                |                                     | Whether to use marker clustering or not and if so, specify clusterer options

