import reviewRepository from '../repositories/ReviewRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';

class ReviewService {
    async getProductReviews(productId) {
        return await reviewRepository.findByProduct(productId);
    }

    async addReview(userId, reviewData) {
        // Front-end could send product_id or productId depending on version, normalize it
        const productId = reviewData.productId || reviewData.product_id;
        const { rating, comment, images } = reviewData;

        if (!productId || !rating) {
            throw new Error('Produit et note requis');
        }

        const productRepo = new ProductRepository();
        const product = await productRepo.findById(productId);
        if (!product) {
            throw new Error('Produit non trouvé');
        }

        const review = await reviewRepository.create({
            product_id: productId,
            user_id: userId,
            rating,
            comment,
            images: images || [],
            status: 'pending'
        });

        return await reviewRepository.findFullReview(review.id);
    }

    async deleteReview(reviewId, userId, isAdmin = false) {
        const review = await reviewRepository.findById(reviewId);

        if (!review) {
            throw new Error('Avis non trouvé');
        }

        if (review.user_id !== userId && !isAdmin) {
            throw new Error('Non autorisé');
        }

        return await reviewRepository.delete(reviewId);
    }

    async getPendingReviews() {
        return await reviewRepository.findPending();
    }

    async updateStatus(reviewId, status) {
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            throw new Error('Statut invalide');
        }

        const review = await reviewRepository.findById(reviewId);
        if (!review) {
            throw new Error('Avis non trouvé');
        }

        return await reviewRepository.update(reviewId, { status });
    }
}

export default new ReviewService();
