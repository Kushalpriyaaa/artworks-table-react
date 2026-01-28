import type { Artwork, ArtworksResponse } from '../types/artwork';

const API_BASE_URL = 'https://api.artic.edu/api/v1';

export const getArtworks = async (): Promise<Artwork[]> => {
    const response = await fetch(`${API_BASE_URL}/artworks`);
    if (!response.ok) {
        throw new Error('Failed to fetch artworks');
    }
    const data: ArtworksResponse = await response.json();
    return data.data;
};
