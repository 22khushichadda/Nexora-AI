import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import IntroScreen from "./components/IntroScreen";

import "./styles/global.css";

function Root() {

    const [showDashboard, setShowDashboard] = React.useState(false);

    return (

        <BrowserRouter>

            {

                showDashboard ?

                    <App />

                    :

                    <IntroScreen

                        onFinish={() =>

                            setShowDashboard(true)

                        }

                    />

            }

        </BrowserRouter>

    );

}

ReactDOM.createRoot(

    document.getElementById("root")

).render(

    <React.StrictMode>

        <Root />

    </React.StrictMode>

);