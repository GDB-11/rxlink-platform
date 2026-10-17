<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { auth } from '$lib/features/auth';

	onMount(() => {
		if (auth.isAuthenticated) {
			goto(resolve('/inicio'), { replaceState: true });
		} else {
			goto(resolve('/login'), { replaceState: true });
		}
	});
</script>
