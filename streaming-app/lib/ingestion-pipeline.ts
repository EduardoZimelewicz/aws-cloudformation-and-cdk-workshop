import * as cdk from '@aws-cdk/core';
import * as include from '@aws-cdk/cloudformation-include';
import * as kinesis from '@aws-cdk/aws-kinesis';

import * as path from 'path';

export class IngestionPipeline extends cdk.Construct {
    public readonly stream: kinesis.IStream

    constructor(scope: cdk.Construct, id: string) {
      super(scope, id);
  
      const template = new include.CfnInclude(this, 'Template', {
        templateFile: path.join(__dirname, '../templates/aws-kinesis-streaming-solution.json'),
        parameters: {
            ShardCount: 2,
            RetentionHours: 24,
            EnableEnhancedMonitoring: 'false',
            BufferingSize: 5,
            CompressionFormat: 'GZIP',
          },
          preserveLogicalIds: false,
      });

      const cfnStream = template.getResource('KdsDataStream4BCE778D') as kinesis.CfnStream;
      this.stream = kinesis.Stream.fromStreamArn(this, 'Stream', cfnStream.attrArn); 
    }
  }  
