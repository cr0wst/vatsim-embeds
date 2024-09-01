import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const VATSIM_METAR_BASE_URL = 'https://metar.vatsim.net/metar.php?format=json&id=';
const VATSIM_DATA_URL = 'https://data.vatsim.net/v3/vatsim-data.json';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const ids = url.searchParams.get('ids');

	if (!ids) {
		return json({ error: 'No IDs provided' });
	}

	const vatsimData = await fetchVatsimData();
	const atisData = vatsimData.atis.filter((atis: any) =>
		ids?.split(',').includes(atis.callsign.substring(0, 4))
	);
	const metarData = await fetchMetarData(ids?.split(','));

	const weatherResponses: WeatherResponse[] = metarData.flatMap((metar: any) => {
		const matchedAtises = atisData.filter(
			(atis: any) => atis.callsign.substring(0, 4) === metar.id
		);

		if (matchedAtises.length > 0) {
			const response = matchedAtises.map((atis: any) => {
				return {
					id: metar.id,
					metar: metar.metar,
					atis: {
						callsign: atis.callsign,
						code: atis.atis_code,
						text: atis.text_atis.join(' '),
						frequency: atis.frequency
					}
				};
			});

			return response;
		}

		return [
			{
				id: metar.id,
				metar: metar.metar,
				atis: null
			}
		];
	});

	return json(weatherResponses);
};

async function fetchVatsimData() {
	return fetch(VATSIM_DATA_URL).then((response) => response.json());
}

async function fetchMetarData(ids: string[]) {
	const response = await fetch(buildMetarUrl(ids));
	return response.json();
}

function buildMetarUrl(ids: string[]): string {
	return `${VATSIM_METAR_BASE_URL}${ids.join(',')}`;
}

export type WeatherResponse = {
	id: string;
	metar: string;
	atis: {
		code: string;
		text: string;
		frequency: string;
	};
};
