import { useState, useEffect } from 'react';
// We remove the old API import since we need custom fetch for pagination
// import { getArtworks } from './api/artworks'; 
import type { Artwork, ArtworksResponse } from './types/artwork';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5); // Using 5 for easy testing
  const [totalRecords, setTotalRecords] = useState<number>(0);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setLoading(true);
        // Fetching directly to include pagination params
        const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data: ArtworksResponse = await response.json();

        setArtworks(data.data);
        setTotalRecords(data.pagination.total);
        setError(null);
      } catch (err) {
        setError('Failed to load artworks data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, [page, rows]); // Re-run when page or rows changes

  const onNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const onPrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Artworks Gallery (Page {page})</h1>

      {/* Temporary Pagination Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={onPrevPage} disabled={page === 1 || loading}>
          Previous
        </button>
        <span>
          Page {page} (Displaying {rows} items)
        </span>
        <button onClick={onNextPage} disabled={loading}>
          Next
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {artworks.map((artwork) => (
            <li key={artwork.id}>
              <strong>{artwork.title}</strong>
              {artwork.artist_display && ` - ${artwork.artist_display}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;