<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import Atis from './Atis.svelte';

	let atises: any[] = [];
	let currentIndex = 0;
	let intervalId: any;
	let fetchIntervalId: any;
	let intervalDuration = 10000; // Default interval duration in milliseconds
	let showAll = false; // Default to not showing all ATIS components at once

	async function fetchWeatherData(ids: string) {
		const response = await fetch(`/api/atis?ids=${ids}`).then((res) => res.json());
		// If the response length is smaller than the current atises length, reset the currentIndex
		if (atises.length > 0 && atises.length > response.length) {
			currentIndex = 0;
		}

		atises = response;
	}

	function startCycle() {
		intervalId = setInterval(() => {
			currentIndex = (currentIndex + 1) % atises.length;
		}, intervalDuration);
	}

	function startFetching(ids: string) {
		fetchWeatherData(ids);
		fetchIntervalId = setInterval(() => {
			fetchWeatherData(ids);
		}, 15000); // Fetch new data every 15 seconds
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

		// Check if showAll parameter is set to true
		const showAllParam = params.get('showAll');
		showAll = showAllParam === 'true';

		// Start the fetching and cycling processes
		startFetching(idsParam);

		// Start the cycling process only if showAll is false
		if (!showAll) {
			startCycle();
		}
	});

	onDestroy(() => {
		clearInterval(intervalId);
		clearInterval(fetchIntervalId);
	});
</script>

<div class="w-full">
	{#if atises && atises.length > 0}
		{#if showAll}
			<!-- Show all ATIS components stacked -->
			{#each atises as wx (wx.callsign)}
				{#if wx}
					<div class="my-2">
						<Atis atis={wx} />
					</div>
				{/if}
			{/each}
		{:else}
			<!-- Show ATIS components with animation, one at a time -->
			{#key currentIndex}
				<div in:slide={{ duration: 200 }} out:slide={{ duration: 200 }}>
					{#if atises[currentIndex] && atises[currentIndex]}
						<Atis atis={atises[currentIndex]} />
					{/if}
				</div>
			{/key}
		{/if}
	{:else}
		<p>No ATIS data available.</p>
	{/if}
</div>
