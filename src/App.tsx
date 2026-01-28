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

  // Selection state (storing IDs to persist across pages)
  const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});

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
    setPage((event.page || 0) + 1);
    setRows(event.rows);
  };

  const onSelectionChange = (e: any) => {
    // e.value contains the array of selected Artwork objects currently visible
    const selectedOnCurrentPage = e.value as Artwork[];

    // Create a set of IDs that are currently selected on this page
    const selectedIdsOnPage = new Set(selectedOnCurrentPage.map((a) => a.id));

    // Create a new selection state based on previous state
    const newSelection = { ...rowSelection };

    // Update state for ALL items on the current page
    // If they are in the 'selectedIdsOnPage' set, mark as true (selected)
    // If not, remove them from the 'newSelection' object (deselected)
    artworks.forEach((artwork) => {
      if (selectedIdsOnPage.has(artwork.id)) {
        newSelection[artwork.id] = true;
      } else {
        delete newSelection[artwork.id];
      }
    });

    setRowSelection(newSelection);
  };

  // derived state for the DataTable 'selection' prop
  // filtering the current 'artworks' based on what is in 'rowSelection'
  const selectedArtworks = artworks.filter((artwork) => rowSelection[artwork.id]);

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
          selection={selectedArtworks}
          onSelectionChange={onSelectionChange}
          selectionMode="multiple"
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
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