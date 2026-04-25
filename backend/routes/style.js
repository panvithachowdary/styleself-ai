const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/generate", async (req, res) => {
  try {
    const { type, occasion, user, itemDetails } = req.body;

    const isCompleteLook = type === "Complete the look";

    const prompt = `
You are StyleSelf, an AI personal fashion stylist.

Occasion: ${occasion}
Request type: ${type}

User profile:
Name: ${user?.name}
Gender: ${user?.gender}
Skin tone: ${user?.skinTone}
Body type: ${user?.bodyType}
Body shape: ${user?.bodyShape}
Height: ${user?.height}
Size: ${user?.size}
Top size: ${user?.topSize}
Bottom size: ${user?.bottomSize}
Shoe size: ${user?.shoeSize}
Budget from profile: ${user?.budget}
Preferred aesthetics: ${user?.aesthetics}
Pinterest inspiration link: ${user?.pinterest}

User given item / extra details:
${itemDetails || "None"}

Pinterest rule:
Use the Pinterest link only as aesthetic inspiration. Do not ignore the occasion.

STRICT OCCASION RULES:
1. Outfit MUST match the occasion exactly.
2. If occasion includes "interview":
   - Suggest ONLY formal/professional items.
   - Suitable examples: formal shirt, blazer, trousers, pencil skirt, formal flats, loafers, minimal bag, watch.
   - Use neutral colors like black, white, beige, navy, grey, cream, brown.
   - Do NOT suggest crop tops, party dresses, flashy jewelry, sneakers, casual denim, gowns, or heavy makeup.
3. If occasion includes "wedding":
   - Suggest festive/ethnic/elegant items.
4. If occasion includes "college" or "fest":
   - Suggest youthful but wearable outfits.
5. If occasion includes "office":
   - Suggest smart casual or formal office wear.
6. If occasion includes "party" or "birthday":
   - Suggest stylish party wear, but still budget-aware.

STRICT BUDGET RULES:
1. The budget mentioned in extra details is STRICT.
2. If budget is low, suggest affordable products only.
3. Do not suggest luxury brands or expensive items for low budgets.
4. Product search queries must include words like "affordable", "budget", "under budget", and "India".
5. If user says "under 2000", searchQuery must include "under 2000 India".

VERY IMPORTANT:
${isCompleteLook
  ? `
The user already owns or selected ONE clothing item.
Do NOT suggest the same item again.
Do NOT suggest another top/dress if the given item is a top/crop top/shirt.
Your job is to COMPLETE the look using matching items only.

For crop top / top / shirt:
Suggest exactly:
1. Bottom
2. Footwear
3. Bag
4. Accessories

For kurti:
Suggest exactly:
1. Bottom
2. Dupatta or layer
3. Footwear
4. Accessories

For dress:
Suggest exactly:
1. Footwear
2. Bag
3. Accessories
4. Outerwear or layer

Never include "Main Outfit" for Complete the look.
`
  : `
Suggest a full outfit from scratch.
Include exactly:
1. Main Outfit
2. Footwear
3. Bag
4. Accessories

For interview/full formal occasions, Main Outfit must be formal/professional only.
`
}

Return ONLY valid JSON.
No markdown.
No extra explanation.

Format:
{
  "title": "short outfit title",
  "summary": "2 line personalized summary",
  "products": [
    {
      "name": "specific product name",
      "type": "Bottom / Footwear / Bag / Accessories / Dupatta / Layer / Main Outfit",
      "searchQuery": "specific Indian shopping search query with occasion and budget"
    }
  ],
  "makeup": "makeup suggestion",
  "hairstyle": "hairstyle suggestion",
  "whyItSuits": "personalized reason"
}

Give exactly 4 products.
Make every searchQuery very specific for Indian shopping.
Every searchQuery must include occasion, gender, India, and budget phrase from extra details.
Output must be practical, realistic, and wearable.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const text = completion.choices[0].message.content;
    const json = JSON.parse(text);

    res.json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;