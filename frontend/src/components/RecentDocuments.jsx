import { useEffect, useState } from "react";

import {
    ChevronDown,
    FileText
} from "lucide-react";

import { getDocuments } from "../services/api";

import "../styles/cards.css";

function RecentDocuments() {

    const [open, setOpen] = useState(false);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {

        try {

            const data = await getDocuments();
            setDocuments(data);

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="doc-card">

            <div
                className="card-header"
                onClick={() => setOpen(!open)}
            >

                <div className="title">

                    <FileText size={22} />

                    <h2>Recent Documents</h2>

                </div>

                <ChevronDown
                    size={24}
                    style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "0.3s"
                    }}
                />

            </div>

            {

                open && (

                    <div className="doc-list">

                        {

                            documents.length === 0 ?

                                <p className="empty-text">
                                    No Documents Uploaded
                                </p>

                                :

                                documents.map((doc) => (

                                    <div
                                        className="doc-item"
                                        key={doc.id}
                                    >

                                        <div className="pdf-icon">

                                            PDF

                                        </div>

                                        <div className="doc-info">

                                            <h3>

                                                {doc.filename}

                                            </h3>

                                        </div>

                                    </div>

                                ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default RecentDocuments;