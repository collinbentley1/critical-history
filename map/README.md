<!-- PROJECT SHIELDS -->
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
![Netlify][netlify-shield]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://ycriticalhistory.org/">
    <img src="public/images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Critical History Map</h3>

  <p align="center">
    <!-- project_breadcrumbs -->
    <a href="https://clever-curie-4b211b.netlify.app/">View Demo</a>
    ·
    <a href="https://github.com/collinbentley1/critical-history/issues">Report Bug</a>
    ·
    <a href="https://github.com/collinbentley1/critical-history/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a>
      <ul>
        <li><a href="#technical-contributions">Technical Contributions</a></li>
        <li><a href="#leadership-contributions">Leadership Contributions</a></li>
        <li><a href="#map-contributions">Map Contributions</a></li>
      </ul>
      </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This project is adapted from an in-person tour developed by Esul Burton and Janis Jin. Context and state in functional React control a Mapbox visualization, and content is managed on the backend via NetlifyCMS. Typeform captures new locations and questions from site guests. The live project is served by Netlify.

The project was developed with two ambitions in mind: (1) to think about how Yale’s history as a colonial institution remains embedded in its architecture and landscape in the present-day and (2) to highlight sites where Yale students and New Haven residents have changed the course of the university’s history through remarkable moments of struggle.

### Built With

* [React](https://reactjs.org)
* [Bootstrap](https://getbootstrap.com)
* [NetlifyCMS](https://www.netlifycms.org)
* [Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/)
* [Typeform](https://github.com/Typeform/embed)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

1. Install or update NPM
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the critical-history
   ```sh
   git clone https://github.com/collinbentley1/critical-history.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create new file for environment variables in root of project called `.env.local` with the following:
    ```sh
    REACT_APP_MAPBOX_API_KEY=REPLACE-WITH-YOUR-KEY
    ```
4. You must replace `REPLACE-WITH-YOUR-KEY` with a personal Mapbox API key that you can generate by visiting the [Mapbox Access Tokens](https://account.mapbox.com/access-tokens) page or by using the [Mapbox Tokens API](https://docs.mapbox.com/api/accounts/#tokens).
<!-- USAGE EXAMPLES -->
## Usage

NPM will use `create-react-app` to build a production package or deploy a locally hosted version of the project for development purposes.

* Build production package
   ```sh
   npm run build
   ```

* Deploy development version
   ```sh
   npm start
   ```

* Deploy to `ycriticalhistory.org`: Netlify will automatically detect and deploy any changes to the `main` branch. If you'd like to push to your own site, read more about [Netlify build configurations](https://docs.netlify.com/configure-builds/get-started/#basic-build-settings).
<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/collinbentley1/critical-history/issues) for a list of proposed features (and known issues). There are many opportunities for current students to improve the project or adapt it for other purposes.



<!-- CONTRIBUTING -->
## Contributing
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**. 

### Technical Contributions

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Leadership Contributions
We are looking for an interested student or group of students to take **full** ownership of the project. Contact us below for more details.

### Map Contributions
We also welcome content contributions in the form of new locations or updates to existing locations. These can be made directly on the live project site.

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

* Esul - `email@example.com`
* Janis - `email@example.com`
* Collin Bentley - `collin.bentley@aya.yale.edu`


Project Link: [https://github.com/collinbentley1/critical-history](https://github.com/collinbentley1/critical-history_name)

<!-- ACKNOWLEDGEMENTS
## Acknowledgements

* []()
* []()
* []() -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[issues-shield]: https://img.shields.io/github/issues/collinbentley1/critical-history.svg?style=for-the-badge
[issues-url]: https://github.com/collinbentley1/critical-history/issues

[license-shield]: https://img.shields.io/github/license/collinbentley1/critical-history.svg?style=for-the-badge
[license-url]: https://github.com/collinbentley1/critical-history/blob/master/LICENSE.txt

[netlify-shield]: https://img.shields.io/netlify/760047ea-9eef-446f-84c4-8e8364e116e2?logo=netlify&style=for-the-badge

[linkedin-url]: https://linkedin.com/in/collinbentley1

[product-screenshot]: public/images/screenshot.png