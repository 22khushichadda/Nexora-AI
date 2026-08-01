import axios from "axios";

const API = axios.create({

    baseURL: "http://127.0.0.1:8000"

});

export const WORKSPACE_ID = 7;


// ----------------------
// Upload PDF
// ----------------------

export const uploadDocument = async (file) => {

    console.log("========== UPLOAD DEBUG ==========");
    console.log("WORKSPACE_ID:", WORKSPACE_ID);
    console.log("FILE:", file);
    console.log("FILE TYPE:", typeof file);
    console.log("UPLOAD URL:", `/documents/upload/${WORKSPACE_ID}`);

    const formData = new FormData();

    formData.append("file", file);

    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    try {

        const response = await API.post(

            `/documents/upload/${WORKSPACE_ID}`,

            formData,

            {

                headers: {

                    "Content-Type": "multipart/form-data"

                }

            }

        );

        console.log("UPLOAD SUCCESS");
        console.log(response.data);

        return response.data;

    }

    catch (error) {

        console.log("UPLOAD FAILED");

        console.log(error);

        if (error.response) {

            console.log("STATUS:", error.response.status);
            console.log("DATA:", error.response.data);

        }

        throw error;

    }

};


// ----------------------
// Get Documents
// ----------------------

export const getDocuments = async () => {

    console.log("Fetching documents...");
    console.log("Workspace:", WORKSPACE_ID);

    const response = await API.get(

        `/documents/${WORKSPACE_ID}`

    );

    return response.data;

};


// ----------------------
// Check Processing Status
// ----------------------

export const getDocumentStatus = async () => {

    const response = await API.get(

        `/documents/status/${WORKSPACE_ID}`

    );

    return response.data;

};


// ----------------------
// Ask AI
// ----------------------

export const askAI = async (question) => {

    console.log("Question:", question);

    const response = await API.post(

        "/chat/",

        {

            workspace_id: WORKSPACE_ID,

            question

        }

    );

    return response.data;

};

export default API;