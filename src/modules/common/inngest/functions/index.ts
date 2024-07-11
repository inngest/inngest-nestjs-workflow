import { Logger } from '@nestjs/common';

import { AppService } from 'src/app.service';
import { userAutomationWorkflow } from './userAutomationWorkflow';

export const getInngestFunctions = (dependencies: {}) => {
  return [
    userAutomationWorkflow({}),
    // Call other functions with dependencies here like above
  ];
};
