import * as cdk from '@aws-cdk/core';
import { IngestionPipeline } from './ingestion-pipeline';
import * as kinesis from '@aws-cdk/aws-kinesis';

export class IngestionPipelineStack extends cdk.Stack {
  public readonly stream: kinesis.IStream;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const streaming = new IngestionPipeline(this, 'IngestionPipeline');

    this.stream = streaming.stream;
  }
}
