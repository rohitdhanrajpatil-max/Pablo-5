
import { GoogleGenAI, Type } from "@google/genai";
import { Hotel, DemandEvent, PricingInsights } from "../types";

// Always initialize with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchMarketIntelligence = async (hotelName: string, city: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the hotel market in ${city} for a hotel named "${hotelName}". 
    1. Identify 5-7 major competitor hotels located within a strict 2km radius of "${hotelName}" that are in the SAME CATEGORY (e.g., Luxury, Upscale, Midscale, Economy) as "${hotelName}".
    2. Search for 6-10 major upcoming events (concerts, conferences, festivals, local holidays) in ${city} for the next 45 days. 
       For each event, provide a "category" (Music, Business, Holiday, Sports, Culture) and a "recommendedStrategy" (e.g., "Implement 2-night MLOS", "Close all discount channels", "Increase base rate by 15%").
    3. Provide current market rate trends and positioning for "${hotelName}".
    4. For each competitor, simulate/find OTA parity data across Booking.com, MMT, and Agoda. Include parity gaps and specific room types (e.g., "Deluxe Room", "King Suite").
    5. Generate a 7-day historical trend of rate parity gaps (as percentages) for "${hotelName}" across Booking.com, MakeMyTrip, and Agoda.
    Return the data as a clean JSON object.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                starLevel: { type: Type.NUMBER },
                distance: { type: Type.STRING },
                currentRate: { type: Type.NUMBER },
                rating: { type: Type.NUMBER },
                reviewCount: { type: Type.NUMBER },
                positioning: { type: Type.STRING },
                otaData: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      platform: { type: Type.STRING },
                      rate: { type: Type.NUMBER },
                      roomType: { type: Type.STRING },
                      cancellationPolicy: { type: Type.STRING },
                      breakfast: { type: Type.BOOLEAN },
                      visibilityScore: { type: Type.NUMBER },
                      parityGap: { type: Type.NUMBER }
                    }
                  }
                }
              },
              required: ['name', 'currentRate', 'distance']
            }
          },
          historicalParity: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                bookingGap: { type: Type.NUMBER },
                mmtGap: { type: Type.NUMBER },
                agodaGap: { type: Type.NUMBER }
              },
              required: ['date', 'bookingGap', 'mmtGap', 'agodaGap']
            }
          },
          events: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                date: { type: Type.STRING },
                distance: { type: Type.STRING },
                impact: { type: Type.STRING },
                description: { type: Type.STRING },
                suggestedUplift: { type: Type.NUMBER },
                category: { type: Type.STRING },
                recommendedStrategy: { type: Type.STRING }
              }
            }
          },
          insights: {
            type: Type.OBJECT,
            properties: {
              recommendedBar: { type: Type.NUMBER },
              cpi: { type: Type.NUMBER },
              visibilityScore: { type: Type.NUMBER },
              revenueOpportunity: { type: Type.NUMBER },
              status: { type: Type.STRING },
              summary: { type: Type.STRING }
            }
          }
        },
        required: ['competitors', 'historicalParity', 'events', 'insights']
      }
    }
  });

  try {
    const text = response.text || '{}';
    const cleanJson = text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const data = JSON.parse(cleanJson);
    
    return {
      ...data,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (e) {
    console.error("Failed to parse market intelligence", e);
    throw e;
  }
};

export const generatePricingReport = async (data: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this hotel data: ${JSON.stringify(data)}, specifically the identified Demand Drivers and Parity Gaps, write an ultra-concise 40-word executive strategy report.
    Format as:
    1. ACTION: [Immediate Rate Parity fix]
    2. TACTIC: [Pricing for highest impact event]
    3. YIELD: [Constraint like MLOS or Overbooking]`,
  });
  return response.text;
};
