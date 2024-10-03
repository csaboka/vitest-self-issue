import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Hello World worker', () => {
	it('responds with Hello World! (unit style)', async () => {
		const request = new Request('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});

	for (let i = 0; i < 5; i++) {
		it(i + ' responds with Hello World! (integration style)', async function() {
			const request = new Request('http://example.com');
			const ctx = createExecutionContext();
			const response = await SELF.fetch(request, env, ctx);
			expect(await response.text()).toBe("Hello World!");
			await waitOnExecutionContext(ctx);
		});
	};
});
