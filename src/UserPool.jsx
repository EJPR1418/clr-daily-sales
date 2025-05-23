const express = require("express");
const session = require("express-session");
const { Issuer, generators } = require("openid-client");
const app = express();

let client;
// Initialize OpenID Client
async function initializeClient() {
  const issuer = await Issuer.discover(
    "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_n84YveCLs"
  );
  client = new issuer.Client({
    client_id: "5sovu2fdflgvrur96sa30vjiel",
    client_secret: "<client secret>",
    redirect_uris: ["https://d84l1y8p4kdic.cloudfront.net"],
    response_types: ["code"],
  });
}
initializeClient().catch(console.error);
