export const normalizeImageUrl = (input: string | any | null | undefined): string => {
    if (!input) return '/placeholder-product.jpg';

    // Si on reçoit un objet hybride { url, fallback }
    const url = typeof input === 'object' ? (input.url || input.fallback) : input;

    if (!url || typeof url !== 'string') return '/placeholder-product.jpg';

    let normalized = url.trim();

    // Si l'URL contient localhost, extraire le chemin relatif
    if (normalized.includes('localhost')) {
        try {
            const parsed = new URL(normalized);
            normalized = parsed.pathname;
        } catch (e) {
            normalized = normalized.replace(/^https?:\/\/localhost:\d+/i, '');
        }
    }

    // Normaliser /uploads
    if (normalized.startsWith('uploads/')) {
        normalized = '/' + normalized;
    }

    if (normalized.startsWith('/uploads/')) {
        return normalized;
    }

    // Images fictives du seeder -> placeholder
    if (
        normalized.includes('smartphone.jpg') ||
        normalized.includes('laptop.jpg') ||
        normalized.includes('earbuds.jpg') ||
        normalized.includes('smartwatch.jpg') ||
        normalized.includes('console.jpg')
    ) {
        return '/placeholder-product.jpg';
    }

    if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
        return normalized;
    }

    if (!normalized.startsWith('/')) {
        normalized = '/' + normalized;
    }

    return normalized;
};
