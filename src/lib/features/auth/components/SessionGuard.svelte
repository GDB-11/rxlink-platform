<!-- src/lib/features/auth/components/SessionGuard.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '../stores/auth.svelte';
	import {
		ABSOLUTE_SESSION_MS,
		IDLE_TIMEOUT_MS,
		IDLE_WARNING_MS,
		LAST_ACTIVITY_KEY,
		type SessionEndReason
	} from '../sessionPolicy';
	import IdleTimeoutDialog from './IdleTimeoutDialog.svelte';

	interface Props {
		/** Called once when the idle timeout or the absolute session limit is reached. */
		onexpire: (reason: SessionEndReason) => void;
	}

	let { onexpire }: Props = $props();

	const ACTIVITY_EVENTS = [
		'pointerdown',
		'pointermove',
		'keydown',
		'scroll',
		'touchstart'
	] as const;
	const STORE_THROTTLE_MS = 5_000;

	let secondsLeft = $state<number | null>(null);

	let lastActivity = Date.now();
	let lastStored = 0;
	let expired = false;

	function readStoredActivity(): number {
		try {
			return Number(localStorage.getItem(LAST_ACTIVITY_KEY)) || 0;
		} catch {
			return 0;
		}
	}

	function markActive() {
		const now = Date.now();
		lastActivity = now;
		if (now - lastStored < STORE_THROTTLE_MS) return;
		lastStored = now;
		try {
			localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
		} catch {
			// Storage unavailable: this tab still tracks its own activity.
		}
	}

	/** Passive activity is ignored while the warning is up: only the explicit button keeps the session alive. */
	function handleActivity() {
		if (secondsLeft === null) markActive();
	}

	function continueSession() {
		lastStored = 0;
		markActive();
		secondsLeft = null;
	}

	function expire(reason: SessionEndReason) {
		if (expired) return;
		expired = true;
		secondsLeft = null;
		onexpire(reason);
	}

	function check() {
		const now = Date.now();

		if (auth.sessionStartedAt !== null && now - auth.sessionStartedAt >= ABSOLUTE_SESSION_MS) {
			expire('session');
			return;
		}

		// Another tab's activity also counts.
		const idleFor = now - Math.max(lastActivity, readStoredActivity());

		if (idleFor >= IDLE_TIMEOUT_MS) {
			expire('idle');
		} else if (idleFor >= IDLE_TIMEOUT_MS - IDLE_WARNING_MS) {
			secondsLeft = Math.ceil((IDLE_TIMEOUT_MS - idleFor) / 1000);
		} else {
			secondsLeft = null;
		}
	}

	onMount(() => {
		// Resume from the stored clock so a stale session isn't revived by reloading the page.
		lastActivity = readStoredActivity() || Date.now();

		for (const type of ACTIVITY_EVENTS) {
			window.addEventListener(type, handleActivity, { passive: true });
		}
		const timer = setInterval(check, 1000);
		check();

		return () => {
			clearInterval(timer);
			for (const type of ACTIVITY_EVENTS) window.removeEventListener(type, handleActivity);
		};
	});
</script>

{#if secondsLeft !== null}
	<IdleTimeoutDialog {secondsLeft} oncontinue={continueSession} onlogout={() => expire('idle')} />
{/if}
