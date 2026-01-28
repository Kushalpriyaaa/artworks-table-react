import { useState, useEffect, useRef } from 'react';
import { DataTable, type DataTablePageEvent, type DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import type { Artwork, ArtworksResponse } from './types/artwork';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // Ensure icons are available

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState<number>(5);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Selection state
  const [rowSelection, setRowSelection] = useState<{ [key: number]: boolean }>({});

  // Overlay Panel state
  const op = useRef<OverlayPanel>(null);
  const [customSelectionCount, setCustomSelectionCount] = useState<number | null>(null);

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

  const onSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => {
    const selectedOnCurrentPage = e.value as Artwork[];
    const selectedIdsOnPage = new Set(selectedOnCurrentPage.map((a) => a.id));
    const newSelection = { ...rowSelection };

    artworks.forEach((artwork) => {
      if (selectedIdsOnPage.has(artwork.id)) {
        newSelection[artwork.id] = true;
      } else {
        delete newSelection[artwork.id];
      }
    });

    setRowSelection(newSelection);
  };

  const onCustomSelectSubmit = () => {
    if (customSelectionCount && customSelectionCount > 0) {
      const newSelection = { ...rowSelection };

      // Select first 'n' rows from the currently loaded artworks
      // Math.min ensures we don't try to slice more than available
      const itemsToSelect = artworks.slice(0, customSelectionCount);

      itemsToSelect.forEach((item) => {
        newSelection[item.id] = true;
      });

      setRowSelection(newSelection);

      // Hide overlay after selection
      op.current?.hide();
    }
  };

  const selectedArtworks = artworks.filter((artwork) => rowSelection[artwork.id]);

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Artworks Gallery</h1>

      {/* Custom Selection Overlay Trigger */}
      <div style={{ marginBottom: '10px' }}>
        <Button
          type="button"
          icon="pi pi-chevron-down"
          label="Select Rows"
          onClick={(e) => op.current?.toggle(e)}
        />

        <OverlayPanel ref={op} showCloseIcon>
          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label htmlFor="row-count">Select valid rows:</label>
            <InputNumber
              id="row-count"
              value={customSelectionCount}
              onValueChange={(e) => setCustomSelectionCount(e.value as number | null)}
              placeholder="Enter count..."
              min={0}
              max={rows} // Limit to current page size logic
            />
            <Button label="Submit" onClick={onCustomSelectSubmit} />
          </div>
        </OverlayPanel>
      </div>

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