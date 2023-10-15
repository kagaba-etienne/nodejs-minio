const minioClient = require("./minio-connect");
const commander = require("commander");

let files = [];

commander
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS] [files...]")
  .requiredOption("-b, --bucket <bucket>", "Bucket Name")
  .option("-a, --all", "Delete All Objects in Bucket")
  .option("-dir, --directory <dir>", "delete all objects in a directory")
  .argument("[files...]")
  .action((f) => {
    files = f;
  })
  .parse(process.argv);

const options = commander.opts();

const deleteObjects = async (bucketName, files) => {
  console.log(`Deleting Objects in Bucket: ${bucketName}`);
  await minioClient.removeObjects(bucketName, files).catch((e) => {
    console.log(
      `Error while deleting objects in bucket '${bucketName}': ${e.message}`,
    );
  });
};

const deletingAllObjects = async (bucketName, dir) => {
  console.log(`Deleting All Objects in Bucket: ${bucketName}`);
  let data = [];
  const objectsList = minioClient.listObjects(bucketName, dir, true);
  objectsList.on("data", function (obj) {
    data.push(obj);
  });
  objectsList.on("end", async function () {
    const files = data.map((object) => object.name);
    console.log(files);
    await minioClient.removeObjects(bucketName, files).catch((e) => {
      console.log(
        `Error while deleting objects in bucket '${bucketName}': ${e.message}`,
      );
    });
  });
  objectsList.on("error", function (err) {
    console.log(err);
  });
};

if (options.all) {
  if (options.directory) {
    deletingAllObjects(options.bucket, options.directory);
  } else {
    console.error(
      "ERROR:\nPlease specify a directory to delete all objects in. (The custom directory you specified while creating account)\n",
    );
  }
} else {
  deleteObjects(options.bucket, files);
  // console.log(files);
}
