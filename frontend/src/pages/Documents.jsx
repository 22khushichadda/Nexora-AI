import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { FileText } from "lucide-react";
import { getDocuments } from "../services/api";
import "../styles/documents.css";

function Documents() {

    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {

        try {

            const data = await getDocuments();

            setDocuments(data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const formatDate = (date) => {

        return new Date(date).toLocaleDateString(

            "en-IN",

            {

                day: "2-digit",

                month: "long",

                year: "numeric"

            }

        );

    };

    const formatTime = (date) => {

        return new Date(date).toLocaleTimeString(

            "en-IN",

            {

                hour: "2-digit",

                minute: "2-digit",

                hour12: true

            }

        );

    };

    return (

        <DashboardLayout>

            <div className="documents-page">

                <h1>Documents</h1>

                <p className="documents-subtitle">

                    All uploaded PDFs

                </p>

                {

                    documents.length === 0 ?

                    (

                        <div className="empty-doc">

                            No Documents Uploaded Yet

                        </div>

                    )

                    :

                    (

                        documents.map((doc) => (

                            <div

                                className="document-card"

                                key={doc.id}

                            >

                                <div className="document-icon">

                                    <FileText size={28} />

                                </div>

                                <div className="document-info">

                                    <h2>

                                        {doc.filename}

                                    </h2>

                                    <p>

                                        Uploaded on

                                    </p>

                                    <span>

                                        {formatDate(doc.uploaded_at)}

                                    </span>

                                    <small>

                                        {formatTime(doc.uploaded_at)}

                                    </small>

                                </div>

                            </div>

                        ))

                    )

                }

            </div>

        </DashboardLayout>

    );

}

export default Documents;