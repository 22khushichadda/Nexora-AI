import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import {
    getMembers,
    getInvitations,
    addMember,
    removeMember,
    updateMemberRole,
    WORKSPACE_ID
} from "../services/api";


function TeamPage() {

    const [members, setMembers] = useState([]);

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [role, setRole] = useState("Member");

    const [loading, setLoading] = useState(false);

    const [inviteMessage, setInviteMessage] = useState("");

    const [pendingInvitations, setPendingInvitations] = useState([]);


    // ======================================================
    // Load Members + Invitations
    // ======================================================

    useEffect(() => {

        loadMembers();

        loadInvitations();

    }, []);


    // ======================================================
    // Load Current Members
    // ======================================================

    const loadMembers = async () => {

        try {

            const data = await getMembers(
                WORKSPACE_ID
            );

            setMembers(data);

        }

        catch (err) {

            console.log(
                "Unable to load members:",
                err
            );

        }

    };


    // ======================================================
    // Load Pending Invitations
    // ======================================================

    const loadInvitations = async () => {

        try {

            const data = await getInvitations(
                WORKSPACE_ID
            );

            setPendingInvitations(data);

        }

        catch (err) {

            console.log(
                "Unable to load invitations:",
                err
            );

        }

    };


    // ======================================================
    // Invite Member
    // ======================================================

    const handleAddMember = async () => {

        if (!name.trim() || !email.trim()) {

            setInviteMessage(
                "❌ Please fill in both name and email."
            );

            return;

        }


        try {

            setLoading(true);

            setInviteMessage("");


            // ------------------------------------------
            // Create Invitation
            // ------------------------------------------

            const response = await addMember({

                workspace_id: WORKSPACE_ID,

                name: name.trim(),

                email: email.trim(),

                role: role

            });


            // ------------------------------------------
            // Clear Form
            // ------------------------------------------

            setName("");

            setEmail("");

            setRole("Member");


            // ------------------------------------------
            // Reload Members
            // ------------------------------------------

            await loadMembers();


            // ------------------------------------------
            // Reload Pending Invitations
            // ------------------------------------------

            await loadInvitations();


            // ------------------------------------------
            // Success Message
            // ------------------------------------------

            setInviteMessage(

                `✅ ${
                    response.message ||
                    "Invitation created successfully."
                }`

            );

        }

        catch (err) {

            console.log(
                "Invite error:",
                err
            );


            setInviteMessage(

                err.response?.data?.detail ||

                "❌ Unable to create invitation."

            );

        }

        finally {

            setLoading(false);

        }

    };


    // ======================================================
    // Remove Member
    // ======================================================

    const handleRemoveMember = async (
        memberId
    ) => {

        const confirmDelete = window.confirm(

            "Are you sure you want to remove this member?"

        );


        if (!confirmDelete) {

            return;

        }


        try {

            await removeMember(
                memberId
            );

            await loadMembers();

        }

        catch (err) {

            console.log(
                "Remove member error:",
                err
            );

            alert(

                err.response?.data?.detail ||

                "Unable to remove member."

            );

        }

    };


    // ======================================================
    // Change Member Role
    // ======================================================

    const handleRoleChange = async (

        memberId,

        newRole

    ) => {

        try {

            await updateMemberRole(

                memberId,

                newRole

            );

            await loadMembers();

        }

        catch (err) {

            console.log(
                "Role update error:",
                err
            );

            alert(

                err.response?.data?.detail ||

                "Unable to update member role."

            );

        }

    };


    // ======================================================
    // Render
    // ======================================================

    return (

        <DashboardLayout>

            {/* ==================================================
                Header
            ================================================== */}

            <h1>
                👥 Team Members
            </h1>

            <p>
                Manage your workspace members
            </p>

            <br />


            {/* ==================================================
                Invite Member
            ================================================== */}

            <div
                style={{
                    background: "#171b27",
                    padding: "24px",
                    borderRadius: "14px",
                    marginBottom: "30px"
                }}
            >

                <h3>
                    Invite Member
                </h3>

                <br />


                {/* Full Name */}

                <input

                    type="text"

                    placeholder="Full Name"

                    value={name}

                    onChange={(e) =>
                        setName(e.target.value)
                    }

                    disabled={loading}

                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "15px",
                        borderRadius: "10px",
                        border:
                            "1px solid #2c3247",
                        background: "#10131d",
                        color: "white",
                        boxSizing: "border-box"
                    }}

                />


                {/* Email */}

                <input

                    type="email"

                    placeholder="Email Address"

                    value={email}

                    onChange={(e) =>
                        setEmail(e.target.value)
                    }

                    disabled={loading}

                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "15px",
                        borderRadius: "10px",
                        border:
                            "1px solid #2c3247",
                        background: "#10131d",
                        color: "white",
                        boxSizing: "border-box"
                    }}

                />


                {/* Role */}

                <select

                    value={role}

                    onChange={(e) =>
                        setRole(e.target.value)
                    }

                    disabled={loading}

                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "20px",
                        borderRadius: "10px",
                        border:
                            "1px solid #2c3247",
                        background: "#10131d",
                        color: "white",
                        boxSizing: "border-box"
                    }}

                >

                    <option value="Member">
                        Member
                    </option>

                    <option value="Admin">
                        Admin
                    </option>

                    <option value="Owner">
                        Owner
                    </option>

                </select>


                {/* Invite Button */}

                <button

                    onClick={handleAddMember}

                    disabled={loading}

                    style={{
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "10px",
                        background: loading
                            ? "#44475a"
                            : "#6366f1",
                        color: "white",
                        cursor: loading
                            ? "not-allowed"
                            : "pointer",
                        fontWeight: "600"
                    }}

                >

                    {
                        loading
                            ? "Inviting..."
                            : "Invite Member"
                    }

                </button>


                {/* Success / Error Message */}

                {
                    inviteMessage && (

                        <p
                            style={{
                                marginTop: "15px",
                                marginBottom: "0",
                                color:
                                    inviteMessage.startsWith("✅")
                                        ? "#4ade80"
                                        : "#f87171",
                                fontWeight: "500"
                            }}
                        >

                            {inviteMessage}

                        </p>

                    )
                }

            </div>


            {/* ==================================================
                Pending Invitations
            ================================================== */}

            {

                pendingInvitations.length > 0 && (

                    <>

                        <h2>
                            Pending Invitations
                        </h2>

                        <br />


                        {

                            pendingInvitations.map(
                                (invitation) => (

                                    <div

                                        key={
                                            invitation.id
                                        }

                                        style={{
                                            background:
                                                "#171b27",
                                            padding:
                                                "20px",
                                            borderRadius:
                                                "14px",
                                            marginBottom:
                                                "15px",
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            gap:
                                                "20px",
                                            border:
                                                "1px solid #2c3247"
                                        }}

                                    >

                                        {/* Invitation Information */}

                                        <div>

                                            <h3
                                                style={{
                                                    margin:
                                                        "0 0 5px 0"
                                                }}
                                            >

                                                {
                                                    invitation.name
                                                }

                                            </h3>

                                            <p
                                                style={{
                                                    margin:
                                                        "0",
                                                    color:
                                                        "#aeb7d0"
                                                }}
                                            >

                                                {
                                                    invitation.email
                                                }

                                            </p>

                                        </div>


                                        {/* Invitation Status */}

                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap:
                                                    "15px"
                                            }}
                                        >

                                            <span
                                                style={{
                                                    background:
                                                        "#2d3653",
                                                    color:
                                                        "#a5b4fc",
                                                    padding:
                                                        "8px 14px",
                                                    borderRadius:
                                                        "20px",
                                                    fontSize:
                                                        "14px",
                                                    fontWeight:
                                                        "600"
                                                }}
                                            >

                                                ⏳ Pending

                                            </span>


                                            <span
                                                style={{
                                                    color:
                                                        "#ffffff"
                                                }}
                                            >

                                                {
                                                    invitation.role
                                                }

                                            </span>

                                        </div>

                                    </div>

                                )

                            )

                        }

                        <br />

                    </>

                )

            }


            {/* ==================================================
                Current Members
            ================================================== */}

            <h2>
                Current Members
            </h2>

            <br />


            {

                members.length === 0

                    ?

                    (

                        <p>
                            No members found.
                        </p>

                    )

                    :

                    (

                        members.map(
                            (member) => (

                                <div

                                    key={
                                        member.id
                                    }

                                    style={{
                                        background:
                                            "#171b27",
                                        padding:
                                            "20px",
                                        borderRadius:
                                            "14px",
                                        marginBottom:
                                            "15px",
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        gap:
                                            "20px"
                                    }}

                                >

                                    {/* Member Information */}

                                    <div>

                                        <h3
                                            style={{
                                                margin:
                                                    "0 0 5px 0"
                                            }}
                                        >

                                            {
                                                member.name
                                            }

                                        </h3>

                                        <p
                                            style={{
                                                margin:
                                                    "0",
                                                color:
                                                    "#aeb7d0"
                                            }}
                                        >

                                            {
                                                member.email
                                            }

                                        </p>

                                    </div>


                                    {/* Member Controls */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap:
                                                "10px",
                                            alignItems:
                                                "center"
                                        }}
                                    >

                                        {/* Role */}

                                        <select

                                            value={
                                                member.role
                                            }

                                            onChange={

                                                (e) =>

                                                    handleRoleChange(

                                                        member.id,

                                                        e.target.value

                                                    )

                                            }

                                            style={{
                                                padding:
                                                    "10px",
                                                borderRadius:
                                                    "8px",
                                                background:
                                                    "#2d3653",
                                                color:
                                                    "white",
                                                border:
                                                    "none",
                                                cursor:
                                                    "pointer"
                                            }}

                                        >

                                            <option value="Owner">
                                                Owner
                                            </option>

                                            <option value="Admin">
                                                Admin
                                            </option>

                                            <option value="Member">
                                                Member
                                            </option>

                                        </select>


                                        {/* Remove */}

                                        <button

                                            onClick={() =>
                                                handleRemoveMember(
                                                    member.id
                                                )
                                            }

                                            style={{
                                                background:
                                                    "#ef4444",
                                                border:
                                                    "none",
                                                color:
                                                    "white",
                                                padding:
                                                    "10px 16px",
                                                borderRadius:
                                                    "8px",
                                                cursor:
                                                    "pointer",
                                                fontWeight:
                                                    "600"
                                            }}

                                        >

                                            Remove

                                        </button>

                                    </div>

                                </div>

                            )

                        )

                    )

            }

        </DashboardLayout>

    );

}


export default TeamPage;