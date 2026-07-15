import { useLocation } from "react-router-dom";
import "../styles/pdfviewer.css";

function PdfViewer() {

    const location = useLocation();

    const {

        documentName,

        page

    } = location.state || {};

    return (

        <div className="viewer-container">

            <div className="glass viewer-card">

                <h1>

                    {documentName}

                </h1>

                <h2>

                    Opening Page {page}

                </h2>

                <div className="pdf-placeholder">

                    PDF Viewer will be integrated here.

                </div>

            </div>

        </div>

    );

}

export default PdfViewer;