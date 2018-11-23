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

|Option    | Type    | Required | Default                                | Description                                                                  
| -------- | ------- | -------- |--------------------------------------- | ----------------------------------------------------------------------------- 
|tag       | string  | Yes      |                                        | Google Maps Script tag with API Key 
|places    | array   | No       | `[]`                                   | List of place objects 
|popup     | any     | No       |                                        | Whether to show popup on marker click or not and if so, specify popup options 
|mapStyle  | any     | No       | `'default'`                            | Use one of predefined map styles or provide own 
|startPos  | object  | No       | `{ lon: 57.7004286, lat: 11.9543521 }` | Start position of map. Will change if geoloc is enabled and position is found
|noGeoloc  | Boolean | No       | `false`                                | Set to true to disable geolocation in map 
|imagePath | string  | No       |                                        | Path to image. Will pick different depending on place type. See below.
|sidebar   | any     | No       |                                        | Whether to use sidebar or not and if so, specify options 
|clusterer | any     | No       | `false`                                | Whether to use marker clustering or not and if so, specify clusterer options

**Place object**

|Property | Type   | Required | Default | Description
| --------| ------ | -------- | ------- | -----------------------------------------------------------------------------------------------------
|lat      | number | Yes      |         | The latitude of the place
|lng      | number | Yes      |         | The longitude of the place
|type     | string | No       |         | The type of the place. Not predefined, so it can be anything. Will only affect the icon of the place.
|name     | string | Yes      |         | The name of the place. This must match the name in Google Maps for the search to work properly.
|address  | string | Yes      |         | The address of the place. This must match the address in Google Maps for the search to work properly.
|link     | string | No       |         | URL to the link for the place
|phone    | string | No       |         | Phone number to the place
|comment  | string | No       |         | Short description or comment of the place

**Popup options**

|Option       | Type    | Required | Default | Description                                                                  
| ----------- | ------- | -------- | ------- | -------------------------------------------------------------------------------------
|link         | string  | No       |         | URL for link shown when a place is searched for but not present, such as "Contact Us". Both link and link text is required.      
|textLink     | string  | No       |         | Text for link shown when a place is searched for but not present, such as "Contact Us". Both link and link text is required.
|noResultHTML | string  | No       |         | Custom HTML to override all other HTML in the popup, when place is not present.

**Map styling**

It is possible to either specify a custom array of Google Map styles, see more 
here: https://mapstyle.withgoogle.com/

It is also possible to specify one of predefined styles. Current valid stlyes are:
* default
* minimalistic

**Image path**

Path to the collection of images for the place icons. The images need to be in .png-format.
The file ending (.png) will automatically be appended. If types are used, this will be appended to the image path as well.
Note that if `imagePath` is not specified, Google Maps default pins will be used for the map 
and no icons will be shown in sidebar.

For example, if image path is `place_` and a place has type "hotel" the map will expect there is an image named 
`place_hotel.png`. If the place has no type, simply `place_.png` will be expected.

**Sidebar options**

Options can be specified but for default usage `true` is enough. Will display a sidebar to the leftwith all places in viewport.
Has a search bar at the top. On mobile, the sidebar will be on the lower half of the screen and is minimizable. 
On mobile phones, the sidebar will be minimized when tapping a marker on the map.

|Option           | Type    | Required | Default | Description
| --------------- | ------- | -------- | ------- | ------------------------------------------------------------------------------------------                                                                  
|searchBar        | object  | No       |         | Search bar options object. If the sidebar is enabled, the searchbar is always enabled too.
|footer           | any     | No       | false   | Whether to use sidebar footer or not and if so, specify options.
|mobileListToggle | string  | No       |         | Image to use for closing and opening sidebar on smaller devices

**Footer options**

|Option    | Type   | Required | Default | Description 
| -------- | ------ | -------- | ------- | ------------------------------------------------------------
|html      | string | No       |         | Replaces all HTML in the footer with this string.
|text      | string | No       |         | Text shown in footer
|logo      | string | No       |         | Path to image to use in logo
|logoLink  | string | No       |         | URL for the logo (requires logo image)
|logoTitle | string | No       |         | Title property for the logo image (requires logo image)

**Clusterer options**

Clusterer will put close places together in a cluster with a number showing how many places are clustered in the cluster.

|Option    | Type   | Required | Default                | Description
| -------- | ------ | -------- | ---------------------- | ---------------------------------------------------------------------------
|imagePath | string | No       |                        | See below.
|textSize  | number | No       | `16`                   | Textsize of the numbers in the clusters
|textColor | string | No       | `'#000'`               | Textcolor of the numbers in the clusters
|sizes     | array  | No       | `[10, 10, 10, 10, 10]` | Array of pixel sizes for the different images
 
The `imagePath` is similar to the `imagePath` of the main options but more strict. It requires that there are five different
square PNG images, each ending with a number from 1 to 5. For example, if `imagePath` is `cluster_ball_`, the clusterer will expect
that there are five images; `cluster_ball_1.png`, `cluster_ball_2.png`, `cluster_ball_3.png`, `cluster_ball_4.png` and 
`cluster_ball_5.png`. This is unfortunately how the used library `js-marker-clusterer` works.

## Examples

### Bare minimum map

