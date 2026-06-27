import reviewRepository from '../repositories/ReviewRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import TrustScoreService from './TrustScoreService.js';
import { OrderItem, Order } from '../models/index.js';

class ReviewService {
    async getProductReviews(productIdOrSlug) {
        let productId = productIdOrSlug;
        
        // Si c'est un slug (non numérique), on doit trouver l'ID du produit d'abord
        if (isNaN(Number(productIdOrSlug))) {
            const productRepo = new ProductRepository();
            const product = await productRepo.findBySlug(productIdOrSlug);
            if (!product) return [];
            productId = product.id;
        }
        
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

        // 🛡️ ACHAT VÉRIFIÉ : Vérifier si l'utilisateur a commandé ce produit
        const verifiedPurchase = await OrderItem.findOne({
            where: { product_id: productId },
            include: [{
                model: Order,
                where: { user_id: userId, status: 'delivered' },
                required: true
            }]
        });
        const is_verified_purchase = !!verifiedPurchase;

        const review = await reviewRepository.create({
            product_id: productId,
            user_id: userId,
            rating,
            comment,
            images: images || [],
            status: reviewData.status || 'approved',
            is_verified_purchase
        });

        // 📊 TRUST SCORE : Recalculer le score de confiance du vendeur
        // si l'avis est directement approuvé et que le produit appartient à une boutique
        if ((reviewData.status || 'approved') === 'approved' && product.storeId) {
            setImmediate(() =>
                TrustScoreService.calculateStoreScore(product.storeId).catch(
                    (err) => console.error(`❌ TrustScore [addReview] Store:${product.storeId}:`, err.message)
                )
            );
        }

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

        // 📊 Récupérer le storeId AVANT la suppression pour le recalcul
        let storeIdToRecalculate = null;
        if (review.status === 'approved') {
            const productRepo = new ProductRepository();
            const product = await productRepo.findById(review.product_id);
            if (product && product.storeId) {
                storeIdToRecalculate = product.storeId;
            }
        }

        const result = await reviewRepository.delete(reviewId);

        // 📊 TRUST SCORE : Recalculer après suppression d'un avis approuvé
        if (storeIdToRecalculate) {
            setImmediate(() =>
                TrustScoreService.calculateStoreScore(storeIdToRecalculate).catch(
                    (err) => console.error(`❌ TrustScore [deleteReview] Store:${storeIdToRecalculate}:`, err.message)
                )
            );
        }

        return result;
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

        const updated = await reviewRepository.update(reviewId, { status });

        // 📊 TRUST SCORE : Recalculer si le statut impacte les avis comptabilisés
        // Un changement approved <-> rejected/pending modifie la moyenne du vendeur
        const impactsScore = review.status !== status &&
            (review.status === 'approved' || status === 'approved');

        if (impactsScore) {
            const productRepo = new ProductRepository();
            const product = await productRepo.findById(review.product_id);
            if (product && product.storeId) {
                setImmediate(() =>
                    TrustScoreService.calculateStoreScore(product.storeId).catch(
                        (err) => console.error(`❌ TrustScore [updateStatus] Store:${product.storeId}:`, err.message)
                    )
                );
            }
        }

        return updated;
    }
}

export default new ReviewService();

