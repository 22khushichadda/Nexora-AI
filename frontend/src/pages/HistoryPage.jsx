import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
    getHistory,
    getConversation
} from "../services/api";

function HistoryPage() {

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

        try {

            const data = await getHistory();

            setHistory(data);

        }

        catch (err) {

            console.log(err);

        }

    };

    // -----------------------------
    // Open Previous Conversation
    // -----------------------------

    const openConversation = async (conversationId) => {

        try {

            const conversation = await getConversation(conversationId);

            navigate("/dashboard", {

                state: {

                    conversation

                }

            });

        }

        catch (err) {

            console.log(err);

        }

    };

    const formatDate = (date) => {

        return new Date(date).toLocaleString(

            "en-IN",

            {

                day: "2-digit",

                month: "long",

                year: "numeric",

                hour: "2-digit",

                minute: "2-digit",

                hour12: false,

                timeZone: "Asia/Kolkata"

            }

        );

    };

    return (

        <DashboardLayout>

            <h1>History</h1>

            <p>Your previous conversations</p>

            <br />

            {

                history.length === 0 ?

                (

                    <p>No conversations yet.</p>

                )

                :

                (

                    history.map((chat) => (

                        <div

                            key={chat.id}

                            onClick={() => openConversation(chat.id)}

                            style={{

                                background: "#171b27",

                                padding: "18px",

                                borderRadius: "14px",

                                marginBottom: "15px",

                                cursor: "pointer",

                                transition: ".3s"

                            }}

                        >

                            <h3>{chat.title}</h3>

                            <p>{formatDate(chat.created_at)}</p>

                        </div>

                    ))

                )

            }

        </DashboardLayout>

    );

}

export default HistoryPage;