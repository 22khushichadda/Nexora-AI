import axios from "axios";

const API = axios.create({

    baseURL: "http://127.0.0.1:8000"

});

export const WORKSPACE_ID = 3;


// ----------------------
// Upload PDF
// ----------------------

export const uploadDocument = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await API.post(

        `/documents/upload/${WORKSPACE_ID}`,

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

    return response.data;

};


// ----------------------
// Get Documents
// ----------------------

export const getDocuments = async () => {

    const response = await API.get(

        `/documents/${WORKSPACE_ID}`

    );

    return response.data;

};


// ----------------------
// Ask AI
// ----------------------

export const askAI = async (question) => {

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