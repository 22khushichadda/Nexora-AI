import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";

import { motion } from "framer-motion";

import ChatBox from "../components/ChatBox";
import RecentDocuments from "../components/RecentDocuments";
import Bookmarks from "../components/Bookmarks";

import "../styles/dashboard.css";

function Dashboard() {

    return (

        <DashboardLayout>

            <PageTransition>

                <div className="dashboard-content">

                    <motion.div

                        className="hero-card"

                        initial={{

                            opacity:0,

                            scale:.92

                        }}

                        animate={{

                            opacity:1,

                            scale:1

                        }}

                        transition={{

                            delay:.4,

                            duration:.8

                        }}

                    >

                        <div className="hero-left">

                            <h1>

                                NEXORA AI

                            </h1>

                            <h2>

                                AI-powered document assistant

                            </h2>

                            <p>

                                Summarize, analyze, translate and extract
                                insights from your documents using AI.

                            </p>

                        </div>

                        <div className="hero-right">

                            <div className="hero-glow"></div>

                        </div>

                    </motion.div>

                    <motion.div

                        initial={{

                            opacity:0,

                            y:40

                        }}

                        animate={{

                            opacity:1,

                            y:0

                        }}

                        transition={{

                            delay:.7

                        }}

                    >

                        <ChatBox />

                    </motion.div>

                    <motion.div

                        className="bottom-grid"

                        initial={{

                            opacity:0,

                            y:60

                        }}

                        animate={{

                            opacity:1,

                            y:0

                        }}

                        transition={{

                            delay:1

                        }}

                    >

                        <RecentDocuments />

                        <Bookmarks />

                    </motion.div>

                </div>

            </PageTransition>

        </DashboardLayout>

    );

}

export default Dashboard;