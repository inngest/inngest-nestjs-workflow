type CustomerPolicyChangedEvent = {
  data: {
    accountId: string;
    action: 'policy.created' | 'policy.updated';
    policyId: string;
    policyVersion: number;
  };
};
/* Example event
{
  "name": "customer/policy.changed",
  "data": {
    "accountId": "123",
    "action": "policy.created",
    "policyId": "abc",
    "policyVersion": 8
  }
}
*/

export type CustomerApprovalCompletedEvent = {
  data: {
    accountId: string;
    approvalId: string;
    approverUserId: string;
    isApproved: boolean;
  };
};
/* Example event
{
  "name": "customer/approval.completed",
  "data": {
    "accountId": "123",
    "approvalId": "96413716-7748-4af5-96ae-28fdbfa42315",
    "approverUserId": "64e1a49e-af54-48a9-a141-625d222b439f",
    "isApproved": true
  }
}
*/

export type Events = {
  'customer/policy.changed': CustomerPolicyChangedEvent;
  'customer/approval.completed': CustomerApprovalCompletedEvent;
};
