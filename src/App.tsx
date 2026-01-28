import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import type { DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Artwork, ArtworksResponse } from './types/artwork';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setLoading(true);
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
  }, [page, rows]);

  const onPageChange = (event: DataTablePageEvent) => {
    setPage((event.page || 0) + 1); // PrimeReact uses 0-based index
    setRows(event.rows);
  };

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Artworks Gallery</h1>

      <div className="card">
        <DataTable
          value={artworks}
          lazy
          dataKey="id"
          paginator
          first={(page - 1) * rows}
          rows={rows}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 25]}
          onPage={onPageChange}
          loading={loading}
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="title" header="Title"></Column>
          <Column field="place_of_origin" header="Place of Origin"></Column>
          <Column field="artist_display" header="Artist"></Column>
          <Column field="inscriptions" header="Inscriptions"></Column>
          <Column field="date_start" header="Start Date"></Column>
          <Column field="date_end" header="End Date"></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default App;