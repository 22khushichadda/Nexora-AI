import axios from "axios";

const API = axios.create({
    baseURL: ""
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
// Get Chat History
// ----------------------

export const getHistory = async () => {

    const response = await API.get(

        `/chat/history/${WORKSPACE_ID}`

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

export const askAI = async (

    question,

    conversationId = null

) => {

    console.log("Question:", question);

    console.log("Conversation:", conversationId);

    const response = await API.post(

        "/chat/",

        {

            workspace_id: WORKSPACE_ID,

            question: question,

            conversation_id: conversationId

        }

    );

    return response.data;

};


// ----------------------
// Create New Conversation
// ----------------------

export const createNewConversation = async () => {

    const response = await API.post(

        "/chat/new",

        {

            workspace_id: WORKSPACE_ID

        }

    );

    return response.data;

};


// ----------------------
// Get Conversation History
// ----------------------

export const getConversationHistory = async () => {

    const response = await API.get(

        `/chat/history/${WORKSPACE_ID}`

    );

    return response.data;

};


// ----------------------
// Get Latest Conversation
// ----------------------

export const getLatestConversation = async () => {

    const response = await API.get(

        `/chat/latest/${WORKSPACE_ID}`

    );

    return response.data;

};

// ----------------------
// Add Bookmark
// ----------------------

export const addBookmark = async (messageId) => {

    const response = await API.post(

        `/chat/bookmark/${messageId}`

    );

    return response.data;

};


// ----------------------
// Delete Bookmark
// ----------------------

export const deleteBookmark = async (messageId) => {

    const response = await API.delete(

        `/chat/bookmark/${messageId}`

    );

    return response.data;

};


// ----------------------
// Get Bookmarks
// ----------------------

export const getBookmarks = async () => {

    const response = await API.get(

        "/chat/bookmarks"

    );

    return response.data;

};


export default API;
// ----------------------
// Get One Conversation
// ----------------------

export const getConversation = async (conversationId) => {

    const response = await API.get(

        `/chat/conversation/${conversationId}`

    );

    return response.data;

};

// ----------------------
// Add Team Member
// ----------------------

export const addMember = async (member) => {

    const response = await API.post(

        "/workspace/member",

        member

    );

    return response.data;

};


// ----------------------
// Get Team Members
// ----------------------

export const getMembers = async (workspaceId) => {

    const response = await API.get(

        `/workspace/members/${workspaceId}`

    );

    return response.data;

};

// ----------------------
// Update Team Member Role
// ----------------------

export const updateMemberRole = async (

    memberId,

    role

) => {

    const response = await API.put(

        `/workspace/member/${memberId}`,

        {

            role: role

        }

    );

    return response.data;

};


// ----------------------
// Remove Team Member
// ----------------------

export const removeMember = async (memberId) => {

    const response = await API.delete(

        `/workspace/member/${memberId}`

    );

    return response.data;

};

// ----------------------
// Get Pending Invitations
// ----------------------

export const getInvitations = async (workspaceId) => {

    const response = await API.get(

        `/workspace/invitations/${workspaceId}`

    );

    return response.data;

};