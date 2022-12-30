import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as kinesis from '@aws-cdk/aws-kinesis';
import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';

import * as path from 'path';

export interface StreamingProducerProps {
    readonly stream: kinesis.IStream;
}

export class StreamingProducer extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: StreamingProducerProps) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc')
    const cluster = new ecs.Cluster(this, 'Cluster', {
        vpc,
    });

    const def = new ecs.FargateTaskDefinition(this, 'TaskDef', {
        cpu: 256,
        memoryLimitMiB: 512,
    });
    
    def.addContainer('app', {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../code/kpl-demo')),
        logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'StreamingApp' }),
        environment: {
            STREAM_NAME: props.stream.streamName,
            AWS_REGION: cdk.Stack.of(this).region,
            SECONDS_TO_RUN: '60',
          },
        
    });

    props.stream.grantReadWrite(def.taskRole)

    def.addToTaskRolePolicy(new iam.PolicyStatement({
        actions: ['cloudwatch:PutMetricData', 'kinesis:ListShards', 'kinesis:PutRecords'],
        resources: ['*'],
      }));

    const service = new ecs.FargateService(this, 'Service', {
        desiredCount: 1,
        cluster,
        taskDefinition: def,
    });
  }
}
