<script lang="ts">
	export let atis: {
		callsign: string;
		text_atis: string;
		atis_code: string;
		frequency: string;
	};
</script>

<div class="items-center flex text-xs m-2 border border-slate-500 bg-slate-900">
	<div
		class="w-fit min-h-24 min-w-32 p-2 flex flex-col justify-center items-center border-r border-r-slate-600 bg-slate-900"
	>
		<p class="text-sm font-mono text-white">{atis.callsign}</p>
		<p class="text-4xl font-bold text-slate-500">{atis.atis_code}</p>
		<p class="text-sm font-mono text-white">{atis.frequency}</p>
	</div>
	<div class="min-h-24 w-full p-2 bg-slate-700 m-1 text-white font-mono text-justify h-full">
		{atis.text_atis}
	</div>
</div>
