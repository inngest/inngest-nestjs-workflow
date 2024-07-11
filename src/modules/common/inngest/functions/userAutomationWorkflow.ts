import { Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { inngest } from '@modules/common/inngest/client';
import type { CustomerApprovalCompletedEvent } from '@modules/common/inngest/types/events.type';

import { AppService } from 'src/app.service';

import { Engine, type Instance, EngineAction } from 'src/workflow-sdk';

// Define the user created DAG
// NOTE - This would normally be created by the user via your UI and an API request
const userDefinedWorkflow: Instance = {
  actions: [
    {
      id: 'approve-by-cto',
      kind: 'approval',
      inputs: {
        approvalUserId: '64e1a49e-af54-48a9-a141-625d222b439f',
        // or $ref....whatever
      },
    },
  ],
  edges: [{ from: '$source', to: 'approve-by-cto' }],
};

// Define all possible actions
const approvalAction: EngineAction = {
  kind: 'approval',
  handler: async ({ event, step, action }) => {
    const { approvalId } = await step.run('send-email', async () => {
      // Create a unique approval ID to match the approval event
      const approvalId = uuid();
      // NOTE - Use the action's inputs to determine the user to send the email to
      // The input could reference a prior action, or a hard-coded configured value
      // const approvalUser = db.getApprovalUser(action.inputs.approvalUserId);
      const approvalUser = {
        // example
        id: action.inputs.approvalUserId,
        email: 'my.cto@acme.com',
      };
      // e.g., email.send(...)
      return {
        approvalId,
        message: `Approval email to ${approvalUser.email} (Approval ID: ${approvalId})`,
      };
    });
    // Wait for the approval event for 7 days
    const approvalEvent: CustomerApprovalCompletedEvent =
      await step.waitForEvent('await-approval', {
        event: 'customer/approval.completed',
        if: `async.data.approvalId == "${approvalId}"`,
        timeout: '7d',
      });

    return approvalEvent.data.isApproved;
  },
};

const savePolicyVersionAction: EngineAction = {
  kind: 'save-policy-version',
  handler: async ({ event, step, action }) => {
    await step.run('save-policy-version', async () => {
      // Perform an action
      // await database.savePolicyVersion(event.data.accountId, event.data.policyId, event.data.policyVersion);
      return {
        message: `Policy version saved`,
      };
    });
    return {};
  },
};

const workflowEngine = new Engine({
  actions: [approvalAction, savePolicyVersionAction],
  loader: async function (event) {
    // Load the user-defined DAG
    // NOTE - This would typically be loaded from a database
    //   example:
    // const userDefinedWorkflow = await db.loadWorkflow(event.name, event.data.accountId);
    return userDefinedWorkflow;
  },
});

/**
 *
 * @param dependencies dependencies to be injected in the function
 * @returns inngest function that will be supplied to serve middleware
 */
export const userAutomationWorkflow = ({}) => {
  return inngest.createFunction(
    { id: 'user-automation-workflow' },
    { event: 'customer/policy.changed' },
    async ({ event, step }) => {
      // When `run` is called, the loader function is called with access to the event
      await workflowEngine.run({ event, step });
    },
  );
};
