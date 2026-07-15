import { UploadCloud } from "lucide-react";
import "../styles/cards.css";

function UploadCard() {

    return (

        <div className="glass upload-card">

            <UploadCloud size={60} />

            <h2>Upload Research Paper</h2>

            <p>

                Drag & Drop your PDF here

            </p>

            <button className="primary-btn">

                Browse PDF

            </button>

        </div>

    );

}

export default UploadCard;