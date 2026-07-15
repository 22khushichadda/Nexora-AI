import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./styles/global.css";

import Dashboard from "./pages/Dashboard";
import IntroScreen from "./components/IntroScreen";

function App(){

    const [entered,setEntered]=React.useState(false);

    return(

        <BrowserRouter>

            {

                entered ?

                <Dashboard/>

                :

                <IntroScreen

                    onEnter={()=>setEntered(true)}

                />

            }

        </BrowserRouter>

    );

}

ReactDOM.createRoot(

    document.getElementById("root")

).render(

    <React.StrictMode>

        <App/>

    </React.StrictMode>

);