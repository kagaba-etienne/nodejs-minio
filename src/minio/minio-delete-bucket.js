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

const options = commander.opts();

const deleteBucket = async (bucketName) => {
  console.log(`Deleting Bucket: ${bucketName}`);
  await minioClient.removeBucket(bucketName).catch((e) => {
    console.log(`Error while deleting bucket '${bucketName}': ${e.message}`);
  });

  console.log(`Listing all buckets...`);
  const bucketsList = await minioClient.listBuckets();
  console.log(
    `Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",\t")}`,
  );
};

deleteBucket(bucket);
