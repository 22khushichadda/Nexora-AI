import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import IntroScreen from "./components/IntroScreen";

import "./styles/global.css";

function App(){

    const [showDashboard,setShowDashboard]=React.useState(false);

    return(

        <BrowserRouter>

            {

                showDashboard ?

                <Dashboard/>

                :

                <IntroScreen

                    onFinish={()=>

                        setShowDashboard(true)

                    }

                />

            }

        </BrowserRouter>

    );

}

ReactDOM.createRoot(document.getElementById("root")).render(

<React.StrictMode>

<App/>

</React.StrictMode>

);