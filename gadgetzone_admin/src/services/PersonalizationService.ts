import api from './api';

export default {
    // Banners
    getBanners() {
        return api.get('/personalization/banners');
    },
    getPromotions() {
        return api.get('/promotions').then(res => res.data); // Assuming backend returns array or {data: []}
    },
    createBanner(banner: any) {
        return api.post('/personalization/banners', banner);
    },
    updateBanner(id: string | number, banner: any) {
        return api.put(`/personalization/banners/${id}`, banner);
    },
    deleteBanner(id: string | number) {
        return api.delete(`/personalization/banners/${id}`);
    },

    // Sections (Top Discovery, Featured, Weather, Deals, etc.)
    getSectionConfig(section: string) {
        return api.get(`/personalization/sections/${section}`);
    },
    updateSectionConfig(section: string, data: any) {
        return api.post(`/personalization/sections/${section}`, data);
    }
};
