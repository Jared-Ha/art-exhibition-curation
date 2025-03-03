# Exhibition Curation Platform

Welcome to the Exhibition Curation Platform, a web application designed to let you explore and curate virtual exhibitions from multiple museum collections. This platform aims to serve researchers, students, and art enthusiasts by providing an interactive way to search for and organize artworks.

## Live Demo Links

- **Frontend (Netlify)**  
  https://curate-flow.netlify.app/  
  You can explore the platform by visiting this link in your browser.

- **Backend (Render)**  
  https://exhibition-curation-be-image-fetcher.onrender.com  
  This is a small service that fetches image data for the frontend. You normally don’t need to access it directly—just let the frontend handle it.

---

## Project Summary

The Exhibition Curation Platform allows you to:

1. **Search Artworks**  
   Search through at least two different museum collections (V&A and MET).
2. **Filter & Sort**  
   Narrow down your results by category or date range, and sort them by date, artist, or title.
3. **View Details**  
   See detailed information about each artwork, including artist, medium, and dimensions.
4. **Curate Exhibitions**  
   Save artworks into a personal “exhibition” for easy viewing later.
5. **Responsive Design**  
   The layout adjusts for different screen sizes, whether you’re on mobile, tablet, or desktop.

---

## How to Install and Run This Project on Your PC

### Prerequisites

- **Node.js** (version 14 or later is recommended)  
  Check if you have Node installed by running `node -v`. If not, download it from [https://nodejs.org/](https://nodejs.org/).
- **npm** (usually bundled with Node)  
  Check your npm version by running `npm -v`.

### Step 1: Cloning the Frontend Repository

1. **Open a terminal** (Command Prompt, PowerShell, or Terminal on macOS).
2. **Navigate** to the folder where you want to store the project:

   ```bash
   cd Documents/projects
   ```

3. **Clone** the frontend repository:

   ```
   bash
   git clone https://github.com/Jared-Ha/art-exhibition-curation.git
   ```

4. **Enter** the new folder:

   ```
   bash
   cd art-exhibition-curation
   ```

### Step 2: Installing Dependencies (Frontend)

1. **Install** all the packages needed to run the app:
   ```
   bash
      npm install
   ```
2. **Start** the development server:

   ```
   bash
      npm run dev
   ```

3. **Open** your browser and go to http://localhost:3000 (or whichever port is shown in your terminal). You should now see the Exhibition Curation Platform running locally.

### Step 3: Cloning & Running the Backend (Optional)

The backend is a separate service that fetches images from external websites (Open Graph metadata). If you want to run it locally as well:

1. **Open a new terminal** window or tab.
2. **Navigate** to your desired folder:
   ```bash
      cd Documents/projects
   ```
3. **Clone** the backend repository:
   ```bash
      git clone https://github.com/Jared-Ha/exhibition-curation-be-image-fetcher.git
   ```
4. **Enter** the folder:
   ```bash
      cd exhibition-curation-be-image-fetcher
   ```
5. **Install** dependencies:
   ```bash
      npm install
   ```
6. **Start** the server:
   ```bash
      npm start
   ```
7. The backend will run on http://localhost:5000 by default, or the port specified in your environment variables.

> **Note:** If you’re just testing the frontend, you don’t need to run the backend locally. The frontend can point to the hosted backend on Render by default.

---

## Minimum Required Versions of Node.js

- **Node:** v14 or later
- **npm:** v6 or later

These versions help ensure compatibility with all dependencies.

---

## Additional Notes

- **APIs Used**
  - [V&A Museum API](https://api.vam.ac.uk/)
  - [MET Museum API](https://metmuseum.github.io/)
- **Technologies**
  - **React** for the frontend
  - **Express** for the backend
  - **Axios** for fetching data
  - **CSS** for styling
  - **Netlify** for frontend hosting
  - **Render** for backend hosting
- **Continuous Deployment**
  - Netlify automatically rebuilds and redeploys the frontend whenever you push changes to the main branch.
  - Render automatically redeploys the backend whenever you push changes to its repository.
- **Future Enhancements**
  - User accounts for saving curated exhibitions permanently
  - Advanced filtering options (multi-select categories, date sliders)
  - Social media sharing of exhibitions or individual artworks

---

## Contact & Contributions

- If you encounter any issues or have feature requests, please open an issue in the [frontend GitHub repository](https://github.com/Jared-Ha/art-exhibition-curation/issues).
- Pull requests are welcome! Please create a new branch for your feature or bug fix and open a pull request when ready.

---

## Acknowledgements

- **Museums & Universities:** Special thanks to the V&A and MET museums for providing open access to their collections.
- **Support & Collaboration:** Developed as part of a Digital Skills Bootcamp in Software Engineering, guided by Northcoders.

Enjoy exploring and curating art! If you have any questions or feedback, don’t hesitate to reach out via GitHub Issues.
