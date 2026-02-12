# Final Clean Example Snippet

## Add these imports

```typescript
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
```

## Add inside constructor

```typescript
const ragBucket = new s3.Bucket(this, 'RagDocumentsBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});

new s3deploy.BucketDeployment(this, 'DeployRagDocs', {
    sources: [s3deploy.Source.asset('./rag-docs')],
    destinationBucket: ragBucket,
});
```

## Create local folder

```
rag-docs/company-policy.txt
```

## Deploy again

---

## 🧠 Architect-Level Insight

For serious enterprise RAG:

- Documents managed via CI/CD
- S3 versioning enabled
- Lifecycle policies enabled
- Metadata tagging for filtering
- Automated KB re-sync via Lambda