export const normalizeImageUrl = (input: string | any | null | undefined): string => {
    if (!input) return '/placeholder-product.jpg';

    const url = typeof input === 'object' ? (input.url || input.fallback || input.logoUrl || input.bannerUrl) : input;

    if (!url || typeof url !== 'string') return '/placeholder-product.jpg';

    let normalized = url.trim();

    // Strip localhost origin to keep image URLs relative (/uploads/...)
    if (normalized.includes('localhost')) {
        try {
            const parsed = new URL(normalized);
            normalized = parsed.pathname;
        } catch (e) {
            normalized = normalized.replace(/^https?:\/\/localhost:\d+/i, '');
        }
    }

    if (normalized.startsWith('uploads/')) {
        normalized = '/' + normalized;
    }

    if (normalized.startsWith('/uploads/')) {
        return normalized;
    }

    if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
        return normalized;
    }

    if (!normalized.startsWith('/')) {
        normalized = '/' + normalized;
    }

    return normalized;
};
