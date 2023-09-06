    const { BlobServiceClient } = require("@azure/storage-blob");
    const { v4: uuidv4 } = require('uuid');
    const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
    const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
    var multipart = require('parse-multipart');

    module.exports = async function (context, req) {
        const storageConnectionString = process.env.StorageConnection;
        const containerName = process.env.containerName;
    
        const bodyBuffer = Buffer.from(req.body);
    const boundary = getBoundary(req.headers['content-type']);

    // Parse the multipart body
    const parts = multipart.Parse(bodyBuffer, boundary);

    // Find the file part
    //const filePart = parts.find(part => part.type === 'file');
 
   
      //const blobName = parts.filename;
      const blobName=parts[0].filename;
      const file = parts[0].data;
        const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString)
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);     
          const uploadBlobResponse = await blockBlobClient.upload(file, file.length);
          
    const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': process.env.APIKey } }), process.env.VisionEndpoint);

    const imageURL = 'http://thepaynetrainsa.blob.core.windows.net/images/'+blobName;
    console.log(imageURL);
    const tags = (await computerVisionClient.analyzeImage(imageURL, { visualFeatures: ['Tags'] })).tags;
    //const responseMessage = tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
    console.log (tags);
         
    
      context.done();
};

function getBoundary(contentType) {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  return match[1] || match[2];
}
