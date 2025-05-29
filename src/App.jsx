import "./App.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { SalesForm } from "./components/SalesForm";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

function App() {
  return (
    <div className="App">
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <div>
              <h1>Hello {user?.username}</h1>
              <button onClick={signOut}>Sign out</button>
            </div>
            <SalesForm />
          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default App;
