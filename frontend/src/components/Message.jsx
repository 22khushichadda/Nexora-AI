import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bookmark } from "lucide-react";

import { addBookmark } from "../services/api";

import "../styles/message.css";

function Message({

    sender,

    text,

    sources,

    messageId

}) {

    const [bookmarked, setBookmarked] = useState(false);

    const safeText =

        typeof text === "string"

            ? text

            : JSON.stringify(text, null, 2);

    const handleBookmark = async () => {

        try {

            await addBookmark(messageId);

            setBookmarked(true);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className={`message ${sender}`}>

            <div className="avatar">

                {sender === "user" ? "👤" : "🤖"}

            </div>

            <div className="bubble">

                <ReactMarkdown>

                    {safeText}

                </ReactMarkdown>

                {

                    sender === "ai" &&

                    messageId && (

                        <button

                            className="bookmark-btn"

                            onClick={handleBookmark}

                        >

                            <Bookmark

                                size={18}

                                fill={

                                    bookmarked

                                        ? "#FFD54A"

                                        : "none"

                                }

                            />

                            {

                                bookmarked

                                    ? " Bookmarked"

                                    : " Bookmark"

                            }

                        </button>

                    )

                }

                {

                    sender === "ai" &&

                    Array.isArray(sources) &&

                    sources.length > 0 && (

                        <div className="sources">

                            <h4>Sources</h4>

                            {

                                sources.map((source, index) => (

                                    <div

                                        key={index}

                                        className="source-item"

                                    >

                                        📄 {

                                            typeof source === "string"

                                                ? source

                                                : JSON.stringify(source)

                                        }

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default Message;