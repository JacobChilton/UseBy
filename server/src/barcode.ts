export const barcode = async (p_barcode: string): Promise<{ name?: string; image?: string }> => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${p_barcode}.json`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const product = data.product;

        if (!product) {

            return {};
        }

        return {
            name: product.product_name || product.name_en || product.product_name_en || product.product_name,
            image: product.image_url
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};