<h1 align="center"> Crime Map 🔍 </h1>

This project is a web application that displays crime data on a map. Users can filter crimes by location, type, and date, and view crime statistics. The application uses the HERE API for map rendering, MapTiler for geocoding, and the Police API for crime data. The backend is built with Node.js and Express.
Further information on the project brief can be found [here](https://learn.foundersandcoders.com/course/syllabus/foundation/full-stack/project/).

## What is this project about?
It aims to provide an interactive map for users to explore crime data visually. By integrating various APIs, the application allows users to:

* View crime incidents on a map.
* Filter crimes based on location, type, and date.
* Access detailed information about individual crimes.
* View crime statistics for selected areas.

## What tools do you need to set it up?
To set up this project locally, you will need the following tools:

* Node.js: JavaScript runtime environment.
* npm: Node package manager (comes with Node.js).
* Git: Version control system to clone the repository.
* A web browser: To view the application.

## Installation

1. Clone the repository:
```diff
git clone https://github.com/fac31/Angela-Dexter-Full-Stack
```
2. Install dependencies
```diff
npm install
```
3. Set up environment variables:
   Create a .env file in the root directory and add the following variables:
```diff
PORT=3000
HERE_API_KEY=your_here_api_key
MAPTILER_API_KEY=your_maptiler_api_key
POLICE_API_URL=https://data.police.uk/api
```
4. Start the server:
```diff
npm start
```
The application should now be running on http://localhost:3000.


## Usage
1. Open the application:

Navigate to http://localhost:3000 in your web browser.

2. Interact with the map:

* Use the filters to select location, crime type, and date.
* Click on map markers to view detailed information about specific crimes.
* View statistics in the dedicated section.

## Technologies Used

Frontend:

* HTML, CSS, JavaScript
* HERE API for map rendering
* MapTiler for geocoding

Backend:

* Node.js
* Express
* Police API for crime data
