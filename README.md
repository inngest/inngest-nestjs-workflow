# Inngest NestJS-Workflow Example

1. Install dependencies

```
pnpm install
```

2. Start the app

```
pnpm run dev
```

3. Start the Inngest Dev Server, pointing at the app's Inngest endpoint

```
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

# Test the workflow

Send an event to kick off the workflow in the Inngest dev server's "Test Event" button available here: http://localhost:8288.

```json
{
  "name": "customer/policy.changed",
  "data": {
    "accountId": "123",
    "action": "policy.created",
    "policyId": "abc",
    "policyVersion": 8
  }
}
```

The new workflow run should now be visible in the Dev Server's stream. Click the run and expand the output of the steps of the running workflow to find the "approvalId." Then send another test event with that `approvalId`:

```json
{
  "name": "customer/approval.completed",
  "data": {
    "accountId": "123",
    "approvalId": "<REPLACE THIS WITH THE APPROVAL ID FROM THE STEP OUTPUT>",
    "approverUserId": "64e1a49e-af54-48a9-a141-625d222b439f",
    "isApproved": true
  }
}
```

See the `isApproved` payload attribute which gets sent to the workflow which determines which next action in the DAG to run.

The workflow should run it's last action and show "completed" in the Dev Server's UI.
