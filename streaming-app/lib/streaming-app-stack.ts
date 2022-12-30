import * as cdk from '@aws-cdk/core';
import * as kinesis from '@aws-cdk/aws-kinesis';
import { StreamingProducer } from './streaming-producer';

export interface StreamingAppStackProps extends cdk.StackProps {
  stream: kinesis.IStream;
}

export class StreamingAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: StreamingAppStackProps) {
    super(scope, id, props);

    new StreamingProducer(this, 'StreamingProducer', {
      stream: props.stream,
    });
  }
}