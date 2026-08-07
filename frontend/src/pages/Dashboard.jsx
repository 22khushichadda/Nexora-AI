import { useLocation } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";

import { motion } from "framer-motion";

import ChatBox from "../components/ChatBox";

import "../styles/dashboard.css";

function Dashboard() {

    const location = useLocation();

    const conversation = location.state?.conversation;

    return (

        <DashboardLayout>

            <PageTransition>

                <div className="dashboard-content">

                    {/* ---------------- Hero Section ---------------- */}

                    <motion.div

                        className="hero-card"

                        initial={{

                            opacity: 0,

                            scale: 0.92

                        }}

                        animate={{

                            opacity: 1,

                            scale: 1

                        }}

                        transition={{

                            delay: 0.4,

                            duration: 0.8

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

                                Upload your PDFs and ask intelligent questions.

                                Nexora analyzes documents using Retrieval-Augmented

                                Generation (RAG) and provides accurate answers

                                with source citations.

                            </p>

                        </div>

                        <div className="hero-right">

                            <div className="hero-glow"></div>

                        </div>

                    </motion.div>

                    {/* ---------------- Chat ---------------- */}

                    <motion.div

                        initial={{

                            opacity: 0,

                            y: 40

                        }}

                        animate={{

                            opacity: 1,

                            y: 0

                        }}

                        transition={{

                            delay: 0.7

                        }}

                    >

                        <ChatBox

                            conversation={conversation}

                            key={conversation?.conversation_id || "new"}

                        />

                    </motion.div>

                </div>

            </PageTransition>

        </DashboardLayout>

    );

}

export default Dashboard;