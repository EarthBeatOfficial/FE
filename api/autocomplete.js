export default async function handler(req, res) {
  const { input } = req.query;

  if (!input) {
    return res.status(400).json({ error: "Missing input parameter" });
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Google API call failed" });
  }
}
