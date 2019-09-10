# React Table It

<img src="https://user-images.githubusercontent.com/9393444/64570426-809f0a00-d358-11e9-9f2d-70c4ba4b5c51.png" width="48" alt="Logo">

[![CircleCI](https://circleci.com/gh/emp-daisy/react-table-it.svg?style=svg)](https://circleci.com/gh/emp-daisy/react-table-it)
[![Test Coverage](https://api.codeclimate.com/v1/badges/16a560e1dcd231b3ef99/test_coverage)](https://codeclimate.com/github/emp-daisy/react-table-it/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/16a560e1dcd231b3ef99/maintainability)](https://codeclimate.com/github/emp-daisy/react-table-it/maintainability)

Data table component with React

## [Demo](https://emp-daisy.github.io/react-table-it)

### Definition

| Props  | Required | Description | Type | Default |
| ------- | :----: | ----------------- | :-------------:|:---------:|
| `data` | - | Data to load on table | `[]` | `[]` |
| `columns` | - | Table column settings | `array` of objects <br> Object contains some/ all properties below <br>`name: string or element (required)` <br> `class: string` <br> `selector: string` <br> `sortable: boolean` <br> `unsearchable: boolean` <br> `cell: element or function` function passes current row data and returns element<br> | `[]` |
| `emptyPlaceholder` | - | Data to load on table | `[]` | `[]` |
| `dataLength` | - | Specify length of all data when loading from server. `Note: server props must true` | `[]` | `[]` |
| `emptyPlaceholder` | - | Placeholder when table is empty. | `string | element` | 'No data found' |
| `pageOptions` | - | Data to load on table | `array` of numbers | `[10, 30, 50]` |
| `server` | - | Set if pagination is handled by asynchronously | `boolean` | `false` |
| `customPagination` | - | Render custom pagination | `boolean` | `false` |
| `paginationComponent` | - | Custom pagination component | `function` | `undefined` |
| `paginationPosition` | - | Position of pagination component | One of `['top', 'bottom', 'both', 'none']` | 'top' |
| `onPageChange` | - | Custom page change function | `function` with params `(offset, limit, searchValue)` <br> `Note: server props must true` | - |
| `onSort` | - | Custom sort function | `function` with params `(selector/key, ascending(boolean))` | `undefined` |
| `searchPlaceholder` | - | Search box placeholder | `string` | 'Search' |
| `search` | - | Set visibility of search box | `boolean` | `true` |
| `containerClass` | - | CSS class for package component | `string` | '' |
| `tableClass` | - | CSS class for table | `string` | '' |
| `rowClass` | - | CSS class for table row | `string` | '' |
| `header` | - | Custom header component | `element` | `null` |
| `footer` | - | Custom footer component | `element` | `null` |

### Technology

Table It uses a number of open source projects to work properly:

* [ReactJS] - HTML enhanced for web apps!
* [Bootstrap] - great UI boilerplate for modern web apps
* [Storybook] - great UI docs

### Installation

Link to package **coming soon**

### Development

Want to contribute? Great!

We use Webpack for fast developing.
Make a change in your file and instantanously see your updates!

Open your favorite Terminal and run these commands.

Install dependenies: `$ yarn`

Start application:`$ yarn start`

Ensure the tests are stable with good coverage: `$ yarn test`

Ensure the test have good coverage: `$ yarn test:coverage`

(optional) Run storybook: `$ yarn storybook`

### License

[MIT](https://github.com/emp-daisy/react-table-it/blob/master/LICENSE)
