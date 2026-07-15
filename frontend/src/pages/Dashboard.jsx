import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import ChatBox from "../components/ChatBox";

import RecentDocuments from "../components/RecentDocuments";
import Bookmarks from "../components/Bookmarks";

import "../styles/dashboard.css";

function Dashboard() {

    return (

        <div className="app">

            <Sidebar />

            <div className="dashboard">

                <Header />

                <div className="dashboard-content">

                    <div className="hero-card">

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

                    </div>

                    <ChatBox />

                    <div className="bottom-grid">

                        <RecentDocuments />

                        <Bookmarks />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;