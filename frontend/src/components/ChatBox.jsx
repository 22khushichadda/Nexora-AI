import { useRef, useState } from "react";
import { Plus, ArrowUp, FileText, X } from "lucide-react";

import { uploadDocument, askAI } from "../services/api";

import "../styles/chat.css";

function ChatBox() {

    const fileInput = useRef();

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(false);

    const [uploadedFile, setUploadedFile] = useState(null);

    const handleUpload = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            setLoading(true);

            await uploadDocument(file);

            setUploadedFile(file.name);

            alert("PDF Uploaded Successfully!");

        }

        catch (err) {

            alert(

                err.response?.data?.detail ||

                err.message ||

                "Upload Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };


    const handleAsk = async () => {

        if (!question.trim()) return;

        try {

            const response = await askAI(question);

            alert(response.answer);

        }

        catch (err) {

            alert(

                err.response?.data?.detail ||

                err.message

            );

        }

    };

    return (

        <>

            <input
                type="file"
                hidden
                accept=".pdf"
                ref={fileInput}
                onChange={handleUpload}
            />

            <div className="chat-wrapper">

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

                <div className="chat-box">

                    <button

                        className="plus-btn"

                        onClick={() => fileInput.current.click()}

                    >

                        <Plus size={20}/>

                    </button>

                    <input

                        value={question}

                        onChange={(e)=>setQuestion(e.target.value)}

                        placeholder="Ask anything about your document..."

                    />

                    <button

                        className="send-btn"

                        onClick={handleAsk}

                    >

                        <ArrowUp size={18}/>

                    </button>

                </div>

            </div>

        </>

    );

}

export default ChatBox;