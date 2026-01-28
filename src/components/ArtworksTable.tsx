import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Artwork } from '../types/artwork';

interface ArtworksTableProps {
    artworks: Artwork[];
    loading: boolean;
}

export const ArtworksTable = ({ artworks, loading }: ArtworksTableProps) => {
    return (
        <div className="card">
            <DataTable value={artworks} loading={loading} tableStyle={{ minWidth: '50rem' }}>
                <Column field="title" header="Title"></Column>
                <Column field="place_of_origin" header="Place of Origin"></Column>
                <Column field="artist_display" header="Artist"></Column>
                <Column field="date_display" header="Date" body={(rowData: Artwork) => {
                    // Combine start and end date for display
                    return `${rowData.date_start} - ${rowData.date_end}`;
                }}></Column>
            </DataTable>
        </div>
    );
};
