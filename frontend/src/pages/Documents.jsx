import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
    FileText,
    CheckCircle,
    Clock,
    Trash2,
    Users
} from "lucide-react";

import { getDocuments, deleteDocument } from "../services/api";

import "../styles/documents.css";


function Documents() {

    const [documents, setDocuments] = useState([]);


    // ======================================================
    // Load Documents
    // ======================================================

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

    const handleDeleteDocument = async (docId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmDelete) return;

        try {

            await deleteDocument(docId);

            await fetchDocuments();

        }

        catch (err) {

            console.log(err);

            alert(
                err.response?.data?.detail ||
                "Unable to delete document."
            );

        }

    };


    // ======================================================
    // Format Date
    // ======================================================

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


    // ======================================================
    // Format Time
    // ======================================================

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


    // ======================================================
    // Document Status Icon
    // ======================================================

    const getStatusIcon = (status) => {

        if (status === "ready") {

            return (

                <CheckCircle
                    size={16}
                />

            );

        }

        return (

            <Clock
                size={16}
            />

        );

    };


    // ======================================================
    // Page
    // ======================================================

    return (

        <DashboardLayout>

            <div className="documents-page">


                {/* ==================================================
                    Header
                ================================================== */}

                <h1>

                    📂 Shared Documents

                </h1>


                <p className="documents-subtitle">

                    Documents uploaded to your workspace

                </p>


                {/* ==================================================
                    Empty State
                ================================================== */}

                {

                    documents.length === 0

                        ?

                        (

                            <div className="empty-doc">

                                <FileText
                                    size={40}
                                />

                                <h2>

                                    No Documents Uploaded Yet

                                </h2>

                                <p>

                                    Upload a PDF from the dashboard
                                    to see it here.

                                </p>

                            </div>

                        )

                        :

                        (

                            <div className="documents-list">


                                {

                                    documents.map((doc) => (

                                        <div

                                            className="document-card"

                                            key={doc.id}

                                        >


                                            {/* ==================================================
                                                Document Icon
                                            ================================================== */}

                                            <div className="document-icon">

                                                <FileText
                                                    size={30}
                                                />

                                            </div>


                                            {/* ==================================================
                                                Document Information
                                            ================================================== */}

                                            <div className="document-info">


                                                {/* ---------------- File Name ---------------- */}

                                                <h2>

                                                    {doc.filename}

                                                </h2>


                                                {/* ---------------- Uploaded By ---------------- */}

                                                <p className="document-uploader">

                                                    👤 Uploaded by{" "}

                                                    <strong>

                                                        {

                                                            doc.uploaded_by ||

                                                            "Nexora User"

                                                        }

                                                    </strong>

                                                </p>


                                                {/* ---------------- Date & Time ---------------- */}

                                                <div className="document-date">

                                                    <span>

                                                        Uploaded on{" "}

                                                        {

                                                            formatDate(

                                                                doc.uploaded_at

                                                            )

                                                        }

                                                    </span>


                                                    <small>

                                                        {

                                                            formatTime(

                                                                doc.uploaded_at

                                                            )

                                                        }

                                                    </small>

                                                </div>


                                                {/* ==================================================
                                                    Document Meta
                                                ================================================== */}

                                                <div className="document-meta">


                                                    {/* ---------------- File Type ---------------- */}

                                                    <span className="document-badge">

                                                        📄 PDF

                                                    </span>


                                                    {/* ---------------- Pages ---------------- */}

                                                    {

                                                        doc.pages && (

                                                            <span className="document-badge">

                                                                📑{" "}

                                                                {doc.pages}{" "}

                                                                {

                                                                    doc.pages === 1

                                                                        ? "Page"

                                                                        : "Pages"

                                                                }

                                                            </span>

                                                        )

                                                    }


                                                    {/* ---------------- Status ---------------- */}

                                                    <span

                                                        className={

                                                            `document-status ${

                                                                doc.status === "ready"

                                                                    ? "ready"

                                                                    : "processing"

                                                            }`

                                                        }

                                                    >

                                                        {

                                                            getStatusIcon(

                                                                doc.status

                                                            )

                                                        }


                                                        <span>

                                                            {

                                                                doc.status === "ready"

                                                                    ? "Ready"

                                                                    : "Processing"

                                                            }

                                                        </span>

                                                    </span>

                                                    {/* ---------------- Shared Badge ---------------- */}

                                                    <span className="document-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>

                                                        <Users size={14} /> Shared

                                                    </span>

                                                    {/* ---------------- Delete Button ---------------- */}

                                                    <button

                                                        onClick={() => handleDeleteDocument(doc.id)}

                                                        title="Delete Document"

                                                        style={{

                                                            background: "transparent",

                                                            border: "none",

                                                            color: "#ef4444",

                                                            cursor: "pointer",

                                                            padding: "4px",

                                                            marginLeft: "auto",

                                                            display: "inline-flex",

                                                            alignItems: "center"

                                                        }}

                                                    >

                                                        <Trash2 size={16} />

                                                    </button>

                                                </div>


                                            </div>

                                        </div>

                                    ))

                                }


                            </div>

                        )

                }


            </div>

        </DashboardLayout>

    );

}


export default Documents;