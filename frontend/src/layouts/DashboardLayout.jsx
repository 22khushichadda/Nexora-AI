import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AnimatedBackground from "../components/AnimatedBackground";


function DashboardLayout({ children }) {

    return (

        <div className="app">

            <AnimatedBackground />

            <Sidebar />

            <motion.div

                className="dashboard"

                initial={{
                    opacity:0,
                    x:40
                }}

                animate={{
                    opacity:1,
                    x:0
                }}

                transition={{
                    duration:0.8,
                    ease:"easeOut"
                }}

                

            >

                <Header />

                {children}

            </motion.div>

        </div>

    );

}

export default DashboardLayout;