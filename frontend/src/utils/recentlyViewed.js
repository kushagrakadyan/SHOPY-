const STORAGE_KEY = 'shopy_recently_viewed';
const MAX_ITEMS = 10;

const getStorage = () => {
    try {
        return window.localStorage;
    } catch (error) {
        return null;
    }
};

const toSnapshot = product => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    ratings: product.ratings,
    numOfReviews: product.numOfReviews,
    Stock: product.Stock,
    category: product.category,
    images: Array.isArray(product.images)
        ? product.images.map(image => ({ _id: image._id, url: image.url }))
        : []
});

const fromStorage = item => {
    if (!item || !item._id || typeof item !== 'object') return null;
    return toSnapshot({
        ...item,
        images: Array.isArray(item.images) ? item.images : []
    });
};

export const getRecentlyViewed = () => {
    const storage = getStorage();
    if (!storage) return [];

    try {
        const stored = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
        if (!Array.isArray(stored)) throw new Error('Invalid recently viewed data');
        return stored.map(fromStorage).filter(Boolean).slice(0, MAX_ITEMS);
    } catch (error) {
        try {
            storage.removeItem(STORAGE_KEY);
        } catch (storageError) {
            // Storage is unavailable; keep the feature non-blocking.
        }
        return [];
    }
};

export const addRecentlyViewed = product => {
    if (!product || !product._id) return getRecentlyViewed();

    const storage = getStorage();
    if (!storage) return [];

    const nextItems = [
        toSnapshot(product),
        ...getRecentlyViewed().filter(item => String(item._id) !== String(product._id))
    ].slice(0, MAX_ITEMS);

    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    } catch (error) {
        return [];
    }
    return nextItems;
};

export const clearRecentlyViewed = () => {
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.removeItem(STORAGE_KEY);
    } catch (error) {
        // Storage is unavailable; keep the feature non-blocking.
    }
};

export { MAX_ITEMS, STORAGE_KEY };