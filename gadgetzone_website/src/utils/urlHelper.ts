export const normalizeImageUrl = (input: string | any | null | undefined): string => {
    if (!input) return '/placeholder-product.svg';

    // Si on reçoit un objet hybride { url, fallback }
    const url = typeof input === 'object' ? (input.url || input.fallback) : input;

    if (!url || typeof url !== 'string') return '/placeholder-product.svg';

    let normalized = url.trim();

    // Optimize Unsplash images for WebP/AVIF compression & auto format
    if (normalized.includes('images.unsplash.com')) {
        if (normalized.includes('w=600')) {
            normalized = normalized.replace('w=600', 'w=300');
        }
        if (!normalized.includes('auto=format')) {
            normalized += (normalized.includes('?') ? '&' : '?') + 'auto=format&fit=crop&q=70';
        }
    }

    // Si l'URL contient localhost, extraire le chemin relatif
    if (normalized.includes('localhost')) {
        try {
            const parsed = new URL(normalized);
            normalized = parsed.pathname;
        } catch (e) {
            normalized = normalized.replace(/^https?:\/\/localhost:\d+/i, '');
        }
    }

    // Normaliser /uploads et privilégier .webp
    if (normalized.startsWith('uploads/')) {
        normalized = '/' + normalized;
    }

    if (normalized.startsWith('/uploads/')) {
        if (/\.(jpg|jpeg|png)$/i.test(normalized)) {
            return normalized.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
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
        return '/placeholder-product.svg';
    }

    if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
        return normalized;
    }

    if (!normalized.startsWith('/')) {
        normalized = '/' + normalized;
    }

    return normalized;
};
