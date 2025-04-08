# Seed to Plate

"Seed to Plate" is a web-based tool to track seed stocks, seedlings, plants, locations, and final products, from seed to plate. It simplifies managing the cultivation process with an intuitive interface.

Live demo: [https://volkseco.github.io/seed-to-plate/](https://volkseco.github.io/seed-to-plate/)

## Features

- Seed Management: Track seeds with details like quantity, sowing months, and germination time.
- Seedling Tracking: Record seedlings with location and date.
- History: Monitor plants and harvests.
- Responsive Design: Works on desktops and smartphones (horizontal and vertical).

## Project Structure

- `index.html`: Main interface.
- `styles.css`: Responsive styling.
- `script.js`: Data and interactivity logic.
- `data/`: Markdown files (e.g., `seeds.md`, `seeding.md`) for data storage.
- `pics/`: Images of seeds and plants.

## Image Source

Images in `pics/` (e.g., `Zucchini.jpg`, `Spinach.jpg`) are from [Wikipedia](https://wikipedia.org/) or [Wikimedia Commons](https://commons.wikimedia.org/), licensed under Creative Commons Attribution-ShareAlike (CC BY-SA). Follow the license terms when using them.

## Installation and Usage

1. Clone the repository:

    ```bash
    git clone https://github.com/volkseco/seed-to-plate.git
    ```

2. Enter the project directory:

    ```bash
    cd seed-to-plate
    ```

3. Start the application:

    - On Linux/Mac:

        ```bash
        ./start.sh
        ```

    - On Windows:

        ```bat
        start.bat
        ```

    These scripts launch the app (e.g., open in a browser or start a local server if set up).

4. Or, open `index.html` in a browser for a static version (no server features).

## Limitations

- Data is stored locally via `localStorage` (no backend on GitHub Pages).
- For full server functionality, deploy `server.js` (not in GitHub Pages) on Render or Heroku.

## License

Licensed under Creative Commons Attribution-ShareAlike (CC BY-SA) by Marco Bernardo. You may:

- Share: Copy and redistribute in any medium or format.
- Adapt: Remix, transform, and build upon the material.

Terms:

- Attribution: Credit Marco Bernardo, link to the license, and note changes.
- ShareAlike: Distribute adaptations under the same license.

Details: [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/)

## Credits

- Author: Marco Bernardo
- Images: Wikipedia / Wikimedia Commons
