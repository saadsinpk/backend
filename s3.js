require('dotenv').config();
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const bucketname = "real-state-store"
const region = "us-east-1"
const accessKeyId = "AKIARAO4RR33DHF2OYHX"
const secretAccessKey = "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"

const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

async function uploadFile(file) {
    if (file && file[0]?.path) {
        const fileStream = fs.createReadStream(file[0].path);
        const uploadParams = {
            Bucket: bucketname,
            Body: fileStream,
            Key: file[0].originalname,
        };
        const command = new PutObjectCommand(uploadParams);
        try {
            const response = await s3.send(command);
            const s3BucketUrl = `https://${bucketname}.s3.amazonaws.com/`;
            const fileKey = file[0].originalname;
            const s3ObjectUrl = s3BucketUrl + encodeURIComponent(fileKey);
            return s3ObjectUrl;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    } else if (file && file.path) {
        const fileStream = fs.createReadStream(file.path);
        const uploadParams = {
            Bucket: bucketname,
            Body: fileStream,
            Key: file.originalname,
        };
        const command = new PutObjectCommand(uploadParams);
        try {
            const response = await s3.send(command);
            const s3BucketUrl = `https://${bucketname}.s3.amazonaws.com/`;
            const fileKey = file.originalname;
            const s3ObjectUrl = s3BucketUrl + encodeURIComponent(fileKey);
            return s3ObjectUrl;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }

}

module.exports = { uploadFile };