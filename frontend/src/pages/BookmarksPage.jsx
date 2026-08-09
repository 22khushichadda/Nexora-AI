import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {
    getBookmarks,
    getConversation
} from "../services/api";

function BookmarksPage() {

    const navigate = useNavigate();

    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {

        loadBookmarks();

    }, []);

    const loadBookmarks = async () => {

        try {

            const data = await getBookmarks();

            setBookmarks(data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const openBookmark = async (conversationId) => {

        try {

            const conversation = await getConversation(
                conversationId
            );

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

            <h1>Bookmarks</h1>

            <p>Your bookmarked AI responses</p>

            <br />

            {

                bookmarks.length === 0 ?

                (

                    <p>No bookmarks yet.</p>

                )

                :

                (

                    bookmarks.map((bookmark) => (

                        <div

                            key={bookmark.bookmark_id}

                            onClick={() =>

                                openBookmark(

                                    bookmark.conversation_id

                                )

                            }

                            style={{

                                background: "#171b27",

                                padding: "18px",

                                borderRadius: "14px",

                                marginBottom: "15px",

                                cursor: "pointer",

                                transition: ".3s"

                            }}

                        >

                            <h3>

                                {bookmark.conversation_title}

                            </h3>

                            <p>

                                {bookmark.answer.substring(0,150)}...

                            </p>

                            <small>

                                {formatDate(

                                    bookmark.created_at

                                )}

                            </small>

                        </div>

                    ))

                )

            }

        </DashboardLayout>

    );

}

export default BookmarksPage;