import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { SalesForm } from "./components/SalesForm";

Amplify.configure(outputs);

function App() {
  return (
    <div className="App">
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h2>Welcome, {user.username}!</h2>
              <button onClick={signOut} style={{ marginBottom: "20px" }}>
                Sign out
              </button>
            </div>
            <SalesForm />
          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
