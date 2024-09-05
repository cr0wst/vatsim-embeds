import { json, RequestHandler } from '@sveltejs/kit';

const VATSIM_DATA_URL = 'https://data.vatsim.net/v3/vatsim-data.json';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const ids = url.searchParams.get('ids').toUpperCase();

	if (!ids) {
		return json({ error: 'No IDs provided' });
	}
	const vatsimData = await fetchVatsimData();

	const atisData = vatsimData.atis.filter((atis: any) =>
		ids?.split(',').includes(atis.callsign.substring(0, 4))
	);

	return json(atisData);
};

async function fetchVatsimData() {
	return fetch(VATSIM_DATA_URL).then((response) => response.json());
}

export type AtisResponse = {
	code: string;
	text: string;
	frequency: string;
}[];
