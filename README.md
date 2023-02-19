# FlagWaver

> A web app for simulating a waving flag.

[krikienoid.github.io/flagwaver](https://krikienoid.github.io/flagwaver/)

## Description

FlagWaver is a web app that lets you upload your own image and turn it into a flag. It is a visualization tool that simulates a waving flag in 3D. You can change the hoist direction, wind, background, and more.

See the [wiki](https://github.com/krikienoid/flagwaver/wiki) for details.

## Development

This project uses a Gulp powered build system to manage tasks such as transpilation and minification. Code files from the ```src``` directory are compiled and output to the ```dist``` directory.

**Dev tools** - Gulp, Rollup, Babel, Terser, Sass, Autoprefixer, clean-css

**Frontend** - Preact, React Redux, Redux, Spectre.css, three.js

### Build

- Run ```npm install``` to install dependencies after pulling down the repository for the first time.
- Run ```npm run start``` to build the project and run the website locally. The finished site will be created in a folder called ```dist``` and will be viewable in the browser at ```http://localhost:8000```.
- Run ```npm run start-test``` to build the project to the ```dist``` directory with production ready assets.

## Resources

- [Advanced Character Physics by Thomas Jakobsen Character](http://web.archive.org/web/20070610223835/http:/www.teknikus.dk/tj/gdc2001.htm)
- [Cloth modeling - Wikipedia](https://en.wikipedia.org/wiki/Cloth_modeling)
- [Real-time Cloth Animation](http://www.darwin3d.com/gamedev/articles/col0599.pdf)

## Credits

Written by [krikienoid](https://github.com/krikienoid/flagwaver). Based on previous work by [flagtest.nz](http://flagtest.nz/) and [Joshua Koo](https://github.com/zz85).

## License

### Code

Code released under the MIT License.

### Assets

All art assets included in this project are distributed under their respective licenses.

- [Material Design icons](https://google.github.io/material-design-icons/) - Apache License 2.0
- [Montserrat](https://fonts.google.com/specimen/Montserrat) - SIL Open Font License 1.1
- [Sky over Washington Monument.jpg](https://commons.wikimedia.org/wiki/File:Sky_over_Washington_Monument.JPG) - This work has been released into the public domain by its author, Andypham3000 at English Wikipedia. This applies worldwide.
- [Blue Clouds Sky](https://pixabay.com/photos/blue-clouds-sky-background-white-69383/) - Pixabay License. Free for commercial use. No attribution required.
- [Moon Sky Clouds](https://pixabay.com/photos/moon-sky-clouds-nature-outdoor-1833172/) - Pixabay License. Free for commercial use. No attribution required.
