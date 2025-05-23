import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_n84YveCLs",
      userPoolClientId: "5sovu2fdflgvrur96sa30vjiel",
      loginWith: {
        oauth: {
          domain: "your-cognito-domain.auth.us-east-1.amazoncognito.com",
          scopes: ["openid", "email", "profile"],
          redirectSignIn: ["https://d84l1y8p4kdic.cloudfront.net"],
          redirectSignOut: ["https://d84l1y8p4kdic.cloudfront.net"],
          responseType: "code",
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
