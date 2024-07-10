import { Logger } from '@nestjs/common';

import { inngest } from '@modules/common/inngest/client';

import { AppService } from 'src/app.service';

import { Engine } from 'src/workflow-sdk';

// Define all possible actions
const engine = new Engine({
  actions: [
    {
      kind: 'send-email',
      handler: async ({ event, step, action }) => {
        await step.run('send-email', async () => {
          // ...
        });
      },
    },
  ],
});

// Define the user created DAG
// Load the DAG from the user

/**
 *
 * @param dependencies dependencies to be injected in the function
 * @returns inngest function that will be supplied to serve middleware
 */
export const hello = (dependencies: {
  appService: AppService;
  logger: Logger;
}) => {
  return inngest.createFunction(
    { id: 'hello-world' },
    { event: 'job/hello.world' },
    async ({ event, step }) => {
      // loader

      await step.run('start-single-jobs', async () => {
        dependencies.logger.log(`Initiating Job`);
        dependencies.appService.helloWorld(); // Call helloWorld() method from app service provider
      });
    },
  );
};
