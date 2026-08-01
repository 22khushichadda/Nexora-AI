import { useEffect, useRef, useState } from "react";
import { Plus, ArrowUp, FileText, X } from "lucide-react";

import Message from "./Message";

import {
    uploadDocument,
    askAI,
    getDocumentStatus
} from "../services/api";

import "../styles/chat.css";

function ChatBox() {

    const fileInput = useRef();

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    const [uploadedFile, setUploadedFile] = useState(null);

    const [messages, setMessages] = useState([]);

    const [processing, setProcessing] = useState(false);

    const [documentReady, setDocumentReady] = useState(false);

    // -----------------------------------
    // Check Document Status
    // -----------------------------------

    useEffect(() => {

        if (!processing) return;

        const interval = setInterval(async () => {

            try {

                const response = await getDocumentStatus();

                if (response.status === "ready") {

                    setProcessing(false);

                    setDocumentReady(true);

                    setMessages(prev => [

                        ...prev,

                        {

                            sender: "ai",

                            text: "✅ Document indexed successfully.\n\nNexora AI is ready."

                        }

                    ]);

                    clearInterval(interval);

                }

            }

            catch (err) {

                console.log(err);

            }

        }, 2000);

        return () => clearInterval(interval);

    }, [processing]);

    // -----------------------------------
    // Upload PDF
    // -----------------------------------

    const handleUpload = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            setLoading(true);

            await uploadDocument(file);

            setUploadedFile(file.name);

            setProcessing(true);

            setDocumentReady(false);

            setMessages(prev => [

                ...prev,

                {

                    sender: "ai",

                    text:
                        `📄 "${file.name}" uploaded successfully.\n\n🧠 Nexora AI is analysing your document...`

                }

            ]);

        }

        catch (err) {

            setMessages(prev => [

                ...prev,

                {

                    sender: "ai",

                    text:

                        err.response?.data?.detail ||

                        err.message ||

                        "Upload Failed."

                }

            ]);

        }

        finally {

            setLoading(false);

        }

    };

    // -----------------------------------
    // Ask AI
    // -----------------------------------

    const handleAsk = async () => {

        if (!question.trim()) return;

        if (!documentReady) {

            setMessages(prev => [

                ...prev,

                {

                    sender: "ai",

                    text:

                        "🧠 Your document is still being processed.\n\nPlease wait a few seconds."

                }

            ]);

            return;

        }

        const currentQuestion = question;

        setQuestion("");

        setMessages(prev => [

            ...prev,

            {

                sender: "user",

                text: currentQuestion

            }

        ]);

        try {

            setLoading(true);

            const response = await askAI(currentQuestion);

            setMessages(prev => [

                ...prev,

                {

                    sender: "ai",

                    text: response.answer,

                    sources: response.sources || []

                }

            ]);

        }

        catch (err) {

            setMessages(prev => [

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

                {

                    messages.length > 0 &&

                    <div className="chat-history">

                        {

                            messages.map((msg, index) => (

                                <Message

                                    key={index}

                                    sender={msg.sender}

                                    text={msg.text}

                                    sources={msg.sources}

                                />

                            ))

                        }

                    </div>

                }

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

                            onClick={() => {

                                setUploadedFile(null);

                                setDocumentReady(false);

                                setProcessing(false);

                                fileInput.current.value = "";

                            }}

                        >

                            <X size={18} />

                        </button>

                    </div>

                }

                <div className="chat-box">

                    <button

                        className="plus-btn"

                        onClick={() => fileInput.current.click()}

                    >

                        <Plus size={20} />

                    </button>

                    <input

                        value={question}

                        placeholder={

                            processing

                                ? "Document is processing..."

                                : "Ask anything about your document..."

                        }

                        disabled={processing}

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

                        disabled={loading || processing}

                    >

                        <ArrowUp size={18} />

                    </button>

                </div>

            </div>

        </>

    );

}

export default ChatBox;