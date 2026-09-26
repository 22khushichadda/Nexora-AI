import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import IntroScreen from "./components/IntroScreen";
import App from "./App";

import "./styles/global.css";

function Root() {
    const [showDashboard, setShowDashboard] = React.useState(false);

    const handleFinish = React.useCallback(() => {
        setShowDashboard(true);
    }, []);

    return (
        <BrowserRouter>
            {
                showDashboard
                ?
                <App />
                :
                <IntroScreen onFinish={handleFinish} />
            }
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(

    <React.StrictMode>

        <Root />

    </React.StrictMode>

);