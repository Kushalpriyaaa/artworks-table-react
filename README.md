# Artworks Table (React + TypeScript)

This project displays a paginated table of artworks fetched from the Art Institute of Chicago API. Ideally suited for viewing artwork metadata with capabilities for persistent selection across pages.

## Tech Stack
- **Framework:** Vite + React + TypeScript
- **UI Library:** PrimeReact (DataTable, OverlayPanel)
- **Styling:** PrimeIcons, PrimeReact Themes (Lara Light Indigo)
- **API:** Art Institute of Chicago Public API

## Features
- **Server-Side Pagination:** Efficiently loads data in chunks (default 5 rows per page) to handle large datasets.
- **Persistent Selection:** Row selection state is preserved across page navigations using a custom ID-based tracking strategy.
- **Custom Row Selection:** An overlay allows users to select a specific number of rows on the current page.
- **Robust Type Safety:** Fully typed with TypeScript, including strict API response interfaces.

## Constraints Handled
- **No Data Prefetching:** Data is fetched strictly on demand per page to minimize network usage.
- **ID-Based Selection:** Selection logic relies solely on artwork IDs (`rowSelection` map) rather than retaining full object references, optimizing memory usage.

## Setup & Run
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```
