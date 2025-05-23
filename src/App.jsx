import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { SalesForm } from "./components/SalesForm";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

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
