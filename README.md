# Exhibition Curation Platform

Welcome to **CurateFlow**, a web app that lets you explore, view, and create virtual exhibitions from multiple museum collections. Designed for researchers, students, and art enthusiasts, the platform offers an interactive way to search, filter, sort, and organize both artworks and exhibitions.

## Live Demo Links

- **Frontend (Netlify):** https://curate-flow.netlify.app/
- **Backend (Render):** https://exhibition-curation-be-image-fetcher.onrender.com  
  _Note: The backend is a standalone service that functions solely as an image fetcher to support the frontend._

---

## Project Summary

- **Search Artworks:** Explore collections from the V&A and MET museums.
- **Filter & Sort:** Narrow results by category or date range, and sort by date, artist, or title.
- **View Details:** Get comprehensive info about each artwork (artist, medium, dimensions, etc.).
- **Curate Exhibitions:** Save artworks in your personal curated exhibitions for easy access later.

---

## How to Run Locally

### Prerequisites

- **Node.js** (v14+): Check with `node -v`. Download from [nodejs.org](https://nodejs.org/) if needed.
- **npm** (v6+): Check with `npm -v`.

### Frontend Setup

1. **Clone the repository:**  
   `git clone https://github.com/Jared-Ha/art-exhibition-curation.git`
2. **Enter the folder:**  
   `cd art-exhibition-curation`
3. **Install dependencies:**  
   `npm install`
4. **Start the development server:**  
   `npm run dev`
5. **Open your browser:**  
   Visit the URL provided in your terminal (for example, `http://localhost:3000`).

### Backend Setup (Optional)

The backend is a separate, standalone service that fetches images from external websites (using Open Graph metadata) to support the frontend.

1. **Clone the repository:**  
   `git clone https://github.com/Jared-Ha/exhibition-curation-be-image-fetcher.git`
2. **Enter the folder:**  
   `cd exhibition-curation-be-image-fetcher`
3. **Install dependencies:**  
   `npm install`
4. **Start the server:**  
   `npm start`  
   (The backend runs on `http://localhost:5000` by default.)

> **Note:** When running the frontend locally, you can continue to use the hosted backend on Render by default.

---

## System Requirements

- **Node:** v14 or later
- **npm:** v6 or later

---

## Additional Information

**APIs Used:**

- [V&A Museum API](https://api.vam.ac.uk/)
- [MET Museum API](https://metmuseum.github.io/)

**Technologies:**  
React, Express, Axios, CSS

**Hosting & Deployment:**

- The frontend is hosted on Netlify with automatic rebuilds and redeployments on Git pushes.
- The backend, a standalone image fetcher service, is hosted on Render and automatically redeploys on repository updates.

**Future Enhancements:**

- User accounts for saving curated exhibitions permanently
- Advanced filtering options (e.g., multi-select categories, date sliders)
- Social media sharing of artworks or exhibitions

---

## Contributions & Contact

If you encounter any issues or have feature requests, please open an issue in the [frontend GitHub repository](https://github.com/Jared-Ha/art-exhibition-curation/issues).

---

## Acknowledgements

Special thanks to the V&A and MET museums for providing open access to their collections.

Enjoy exploring and curating art with CurateFlow!
