import { useState, useEffect } from 'react';
import { getArtworks } from './api/artworks';
import { ArtworksTable } from './components/ArtworksTable';
import type { Artwork } from './types/artwork';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

function App() {
  // Explicitly defining state types for clarity
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to handle the async fetch
    const loadArtworks = async () => {
      try {
        setLoading(true);
        const data = await getArtworks();
        setArtworks(data);
      } catch (err) {
        setError('Failed to load artworks data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []); // Empty dependency array means this runs once on mount

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Artworks Gallery</h1>
      <ArtworksTable artworks={artworks} loading={loading} />
    </div>
  );
}

export default App;
