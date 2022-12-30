#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StreamingAppStack } from '../lib/streaming-app-stack';
import { IngestionPipelineStack } from '../lib/ingestion-pipeline-stack';

const app = new cdk.App();
const IngestionStack = new IngestionPipelineStack(app, 'IngestionPipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
new StreamingAppStack(app, 'StreamingAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stream: IngestionStack.stream
});
