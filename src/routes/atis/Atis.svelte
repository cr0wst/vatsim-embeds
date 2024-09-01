<script lang="ts">
	export let atis: {
		callsign: string;
		code: string;
		text: string;
		frequency: string;
	};
</script>

<div class="items-center justify-center flex text-xs m-2 border border-slate-500 bg-slate-800">
	<div
		class="w-fit p-2 flex flex-col justify-center items-center border-r border-r-slate-600 bg-slate-900"
	>
		<p class="text-sm font-mono text-white">{atis.callsign}</p>
		<p class="text-4xl font-bold text-slate-500">{atis.code}</p>
		<p class="text-sm font-mono text-white">{atis.frequency}</p>
	</div>
	<div class="w-fit p-2 text-white font-mono text-justify h-full">
		{atis.text}
	</div>
</div>
