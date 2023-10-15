const minioClient = require("./minio-connect");
const commander = require("commander");

let bucket;
commander
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS]...")
  .argument("<bucket>", "Bucket Name")
  .action((b) => {
    bucket = b;
  })
  .parse(process.argv);

const createBucket = async (bucketName) => {
  console.log(`Creating Bucket: ${bucketName}`);
  await minioClient.makeBucket(bucketName, "hello-there").catch((e) => {
    console.log(`Error while creating bucket '${bucketName}': ${e.message}`);
  });

  console.log(`\nListing all buckets...`);
  const bucketsList = await minioClient.listBuckets();
  console.log(
    `Buckets List: \n${bucketsList
      .map((bucket, idx) => idx + 1 + ". " + bucket.name)
      .join("\n")}`,
  );
};

createBucket(bucket);
