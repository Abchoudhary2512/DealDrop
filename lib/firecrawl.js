import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          prompt: "Extract the product name as productName, current price as currentPrice (number only), currency code as currencyCode (USD, EUR, etc), and product image URL as productImageUrl if available.",
          schema: {
            type: "object",
            properties: {
              productName: { type: "string" },
              currentPrice: { type: "number" },
              currencyCode: { type: "string" },
              productImageUrl: { type: "string" },
            },
            required: ["productName", "currentPrice"],
          },
        },
      ],
    });

    
   
    const extractedData = 
      result?.data?.json ||
      result?.json ||
      result?.extract ||
      result?.data;
    
    console.log("Extracted data:", extractedData);

    if (!extractedData?.productName) {
      throw new Error("No product data extracted");
    }

    return extractedData;
  } catch (error) {
    console.error("Firecrawl scrape error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}