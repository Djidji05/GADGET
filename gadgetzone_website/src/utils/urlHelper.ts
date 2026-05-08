export const normalizeImageUrl = (input: string | any | null | undefined): string => {
    if (!input) return '/placeholder-product.jpg';

    // Si on reçoit un objet hybride { url, fallback }
    const url = typeof input === 'object' ? (input.url || input.fallback) : input;

    if (!url || typeof url !== 'string') return '/placeholder-product.jpg';

    // Si l'URL contient localhost:3001, on le remplace par localhost:3003
    let normalized = url;
    if (normalized.includes('localhost:3001')) {
        normalized = normalized.replace('localhost:3001', 'localhost:3003');
    }

    // Si c'est un chemin relatif (commence par /uploads), on ajoute le base URL
    if (normalized.startsWith('/uploads')) {
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3003';
        normalized = `${baseUrl}${normalized}`;
    }

    return normalized;
};
