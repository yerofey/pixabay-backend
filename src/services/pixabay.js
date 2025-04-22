const API_KEY = process.env.PIXABAY_API_KEY;

export async function fetchImages(query, count = 10) {
	const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
		query
	)}&per_page=${count}`;

	try {
		const res = await fetch(url);
		const json = await res.json();
		return json.hits.map((img) => ({
			image: img.webformatURL,
			tags: img.tags,
		}));
	} catch (err) {
		return { error: true };
	}
}
