
// server/tests/e2e/brainDump.test.ts

/**
 * @jest-environment node
 */

// This file contains end-to-end tests for the /api/brain-dump endpoint.
// It uses the \'supertest\' library to send HTTP requests to a running server instance.
//
// To run these tests:
// 1. Ensure you have \'jest\' and \'supertest\' installed as dev dependencies:
//    npm install --save-dev jest supertest @types/jest @types/supertest
// 2. Configure Jest to run .ts files (e.g., using ts-jest).
// 3. Make sure your development server is running.
// 4. Execute the tests using the \'jest\' command.

import request from \'supertest\';

// The base URL of the running server. This should match the port your
// development server is configured to use. The Firebase emulator docs suggest 8080.
const API_URL = \'http://localhost:8080\';

describe(\'E2E Tests for /api/brain-dump\', () => {

    // A standard user context for consistent testing.
    const mockUserContext = {
        energyState: \'Medium\',
        cognitiveType: \'unknown\'
    };

    // A list of realistic inputs to test the brain dump processing,
    // sourced from the AgentBenchmark file for consistency.
    const validTestInputs = [
      "Need to fix the login bug, update the public API documentation, and maybe think about adding 2FA down the line.",
      "I\'m working on the new mobile app design. I should create the user onboarding flow, but I\'m worried about the database schema for profiles.",
      "There are some urgent website security issues to patch. Also, the API documentation for the internal services needs work. And the coffee machine is broken.",
      "Just a simple idea: what if we added gamification to the dashboard?",
      "build the new feature, then deploy it to staging and run e2e tests"
    ];

    // --- ERROR AND EDGE CASE TESTS ---

    it(\'should return a 400 Bad Request if the request body is missing\', async () => {
        const response = await request(API_URL).post(\'/api/brain-dump\').send();
        expect(response.status).toBe(400);
    });

    it(\'should return a 400 Bad Request for an empty input string\', async () => {
        const response = await request(API_URL)
            .post(\'/api/brain-dump\')
            .send({ input: \'\', userContext: mockUserContext });

        expect(response.status).toBe(400);
        // Assuming the API returns a consistent JSON error object.
        expect(response.body).toHaveProperty(\'error\');
        expect(response.body.error).toContain(\'Input cannot be empty\');
    });

    it(\'should return a 400 Bad Request if userContext is missing\', async () => {
        const response = await request(API_URL)
            .post(\'/api/brain-dump\')
            .send({ input: \'A valid input string without context.\' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(\'error\');
        expect(response.body.error).toContain(\'User context is required\');
    });

    // --- VALID INPUT TESTS ---

    // Dynamically create a test case for each valid input string.
    validTestInputs.forEach((input, index) => {
        it(`should successfully process valid input #${index + 1} and return a complete MultiFrameworkResponse\`, async () => {
            const response = await request(API_URL)
                .post(\'/api/brain-dump\')
                .send({ input, userContext: mockUserContext });

            // Expect a successful response code.
            expect(response.status).toBe(200);

            // Verify the high-level structure of the MultiFrameworkResponse.
            expect(response.body).toHaveProperty(\'frameworks\');
            expect(response.body).toHaveProperty(\'orchestration\');
            expect(response.body).toHaveProperty(\'metadata\');

            // Verify the structure of the \'frameworks\' object.
            const { frameworks } = response.body;
            expect(frameworks).toHaveProperty(\'agile\');
            expect(frameworks.agile.userStories).toBeInstanceOf(Array);
            expect(frameworks).toHaveProperty(\'kanban\');
            expect(frameworks.kanban.board).toBeInstanceOf(Object);
            expect(frameworks).toHaveProperty(\'gtd\');
            expect(frameworks.gtd.nextActions).toBeInstanceOf(Array);
            expect(frameworks).toHaveProperty(\'para\'); // Check mock agent response
            expect(frameworks).toHaveProperty(\'custom\'); // Check mock agent response

            // Verify the structure of the \'orchestration\' object.
            const { orchestration } = response.body;
            expect(orchestration).toHaveProperty(\'momentumScore\');
            expect(orchestration.recommendations).toBeInstanceOf(Array);
            expect(orchestration.motivationAmplifiers).toBeInstanceOf(Object);

            // Verify the structure of the \'metadata\' object.
            const { metadata } = response.body;
            expect(metadata.processingTimeMs).toBeGreaterThanOrEqual(0);
            expect(metadata.confidenceScore).toBeGreaterThanOrEqual(0);
        }, 15000); // Set a generous timeout (15 seconds) to allow for AI model processing.
    });
});
