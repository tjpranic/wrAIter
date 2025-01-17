import { test, expect } from '@playwright/test';

test( 'home page has expected h1', async ( { page } ) => {
    await page.goto( '/' );
    await expect( page.locator( 'h1' ) ).toBeVisible( );
} );

// https://svelte.dev/docs/svelte/testing#E2E-tests-using-Playwright