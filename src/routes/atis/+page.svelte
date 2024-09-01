<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import Atis from './Atis.svelte';

	let weather: any = null;
	let currentIndex = 0;
	let intervalId: any;
	let fetchIntervalId: any;
	let intervalDuration = 10000; // Default interval duration in milliseconds

	async function fetchWeatherData(ids: string) {
		weather = await fetch(`/api/wx?ids=${ids}`).then((res) => res.json());
	}

	function startCycle() {
		intervalId = setInterval(() => {
			currentIndex = (currentIndex + 1) % weather.length;
		}, intervalDuration);
	}

	function startFetching(ids: string) {
		fetchWeatherData(ids);
		fetchIntervalId = setInterval(() => {
			fetchWeatherData(ids);
		}, 30000); // Fetch new data every 30 seconds
	}

	onMount(() => {
		// Access the query parameters
		const params = new URLSearchParams($page.url.search);

		// Get the interval duration from query parameter or use default
		const intervalParam = params.get('interval');
		if (intervalParam) {
			intervalDuration = parseInt(intervalParam, 10) * 1000;
		}

		// Get the ids from query parameter or use a default value
		const idsParam = params.get('ids') || 'KCVG';

		// Start the fetching and cycling processes
		startFetching(idsParam);
		startCycle();
	});

	onDestroy(() => {
		clearInterval(intervalId);
		clearInterval(fetchIntervalId);
	});
</script>

<div class="w-full">
	{#if weather && weather.length > 0}
		{#key currentIndex}
			<div in:slide={{ duration: 200 }} out:slide={{ duration: 200 }}>
				{#if weather[currentIndex] && weather[currentIndex].atis}
					<Atis atis={weather[currentIndex].atis} />
				{/if}
			</div>
		{/key}
	{:else}
		<p>No ATIS data available.</p>
	{/if}
</div>
