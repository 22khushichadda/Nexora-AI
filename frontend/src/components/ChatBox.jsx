import { useRef, useState } from "react";
import { Plus, ArrowUp, FileText, X } from "lucide-react";

import Message from "./Message";

import { uploadDocument, askAI } from "../services/api";

import "../styles/chat.css";

function ChatBox() {

    const fileInput = useRef();

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    const [uploadedFile, setUploadedFile] = useState(null);

    const [messages, setMessages] = useState([]);

    // -----------------------------
    // Upload PDF
    // -----------------------------

    const handleUpload = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            setLoading(true);

            await uploadDocument(file);

            setUploadedFile(file.name);

            setMessages((prev) => [

                ...prev,

                {

                    sender: "ai",

                    text: `"${file.name}" uploaded successfully. You can now ask me anything about this document.`

                }

            ]);

        }

        catch (err) {

            setMessages((prev) => [

                ...prev,

                {

                    sender: "ai",

                    text:

                        err.response?.data?.detail ||

                        err.message ||

                        "Upload failed."

                }

            ]);

        }

        finally {

            setLoading(false);

        }

    };

    // -----------------------------
    // Ask AI
    // -----------------------------

    const handleAsk = async () => {

        if (!question.trim()) return;

        const currentQuestion = question;

        setMessages((prev) => [

            ...prev,

            {

                sender: "user",

                text: currentQuestion

            }

        ]);

        setQuestion("");

        try {

            setLoading(true);

            const response = await askAI(currentQuestion);

            setMessages((prev) => [

                ...prev,

                {

                    sender: "ai",

                    text: response.answer

                }

            ]);

        }

        catch (err) {

            setMessages((prev) => [

                ...prev,

                {

                    sender: "ai",

                    text:

                        err.response?.data?.detail ||

                        err.message ||

                        "Something went wrong."

                }

            ]);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <>

            <input

                hidden

                type="file"

                accept=".pdf"

                ref={fileInput}

                onChange={handleUpload}

            />

            <div className={`chat-wrapper ${uploadedFile ? "has-file" : ""}`}>

                {/* Chat History */}

                {

                    messages.length > 0 &&

                    <div className="chat-history">

                        {

                            messages.map((msg, index) => (

                                <Message

                                    key={index}

                                    sender={msg.sender}

                                    text={msg.text}

                                />

                            ))

                        }

                    </div>

                }

                {/* Attached PDF */}

                {

                    uploadedFile &&

                    <div className="attached-file">

                        <div className="file-left">

                            <FileText size={20} />

                            <span>

                                {uploadedFile}

                            </span>

                        </div>

                        <button

                            className="remove-file"

                            onClick={() => setUploadedFile(null)}

                        >

                            <X size={18} />

                        </button>

                    </div>

                }

                {/* Chat Input */}

                <div className="chat-box">

                    <button

                        className="plus-btn"

                        onClick={() => fileInput.current.click()}

                    >

                        <Plus size={20} />

                    </button>

                    <input

                        value={question}

                        placeholder="Ask anything about your document..."

                        onChange={(e) =>

                            setQuestion(e.target.value)

                        }

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                handleAsk();

                            }

                        }}

                    />

                    <button

                        className="send-btn"

                        onClick={handleAsk}

                        disabled={loading}

                    >

                        <ArrowUp size={18} />

                    </button>

                </div>

            </div>

        </>

    );

}

export default ChatBox;