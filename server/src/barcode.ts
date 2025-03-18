import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

const client = new OpenAI({
    baseURL: 'https://api.deepseek.com/'
});

export const generate_name = async (productData: string) => {

    console.log(productData);

    const completion = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [{
            role: "system",
            content: "You're a product name generator, for generating a more concise product name based on various longer names and other data for the product given. Include the brand name in the product name, if it's defined. Keep it around at most three words, but more if its vague. Don't include things like certifications. Reply in plain text, no markdown.",
        },
        {
            role: "user",
            content: productData,
        }]
    });
    return completion.choices[0].message.content;
}

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

        const productNameData = {
            product_name: product.product_name,
            product_name_en: product.product_name_en,
            name_en: product.name_en,
            generic_name: product.generate_name,
            brands: product.brands
        };

        const product_description = await generate_name(JSON.stringify(productNameData));

        return {
            name: JSON.stringify(product_description),
            image: product.image_url
            
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};

barcode("5010003065604").then(console.log);