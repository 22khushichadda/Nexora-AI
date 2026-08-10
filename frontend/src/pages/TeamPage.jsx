import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import {

    getMembers,

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

    useEffect(() => {

        loadMembers();

    }, []);

    const loadMembers = async () => {

        try {

            const data = await getMembers(

                WORKSPACE_ID

            );

            setMembers(data);

        }

        catch (err) {

            console.log(err);

        }

    };

    // -----------------------------
    // Invite Member
    // -----------------------------

    const handleAddMember = async () => {

        if (!name || !email) {

            alert("Please fill all fields.");

            return;

        }

        try {

            setLoading(true);

            await addMember({

                workspace_id: WORKSPACE_ID,

                name,

                email,

                role

            });

            setName("");

            setEmail("");

            setRole("Member");

            loadMembers();

        }

        catch (err) {

            alert(

                err.response?.data?.detail ||

                "Unable to add member."

            );

        }

        finally {

            setLoading(false);

        }

    };

    // -----------------------------
    // Remove Member
    // -----------------------------

    const handleRemoveMember = async (memberId) => {

        const confirmDelete = window.confirm(

            "Remove this member?"

        );

        if (!confirmDelete) return;

        try {

            await removeMember(memberId);

            loadMembers();

        }

        catch (err) {

            console.log(err);

            alert("Unable to remove member.");

        }

    };

    // -----------------------------
    // Change Role
    // -----------------------------

    const handleRoleChange = async (

        memberId,

        newRole

    ) => {

        try {

            await updateMemberRole(

                memberId,

                newRole

            );

            loadMembers();

        }

        catch (err) {

            console.log(err);

            alert("Unable to update role.");

        }

    };

        return (

        <DashboardLayout>

            <h1>👥 Team Members</h1>

            <p>

                Manage your workspace members

            </p>

            <br />

            {/* ---------------- Invite Member ---------------- */}

            <div

                style={{

                    background: "#171b27",

                    padding: "20px",

                    borderRadius: "14px",

                    marginBottom: "30px"

                }}

            >

                <h3>Invite Member</h3>

                <br />

                <input

                    placeholder="Full Name"

                    value={name}

                    onChange={(e) =>

                        setName(e.target.value)

                    }

                    style={{

                        width: "100%",

                        padding: "12px",

                        marginBottom: "15px",

                        borderRadius: "10px",

                        border: "1px solid #2c3247",

                        background: "#10131d",

                        color: "white"

                    }}

                />

                <input

                    placeholder="Email Address"

                    value={email}

                    onChange={(e) =>

                        setEmail(e.target.value)

                    }

                    style={{

                        width: "100%",

                        padding: "12px",

                        marginBottom: "15px",

                        borderRadius: "10px",

                        border: "1px solid #2c3247",

                        background: "#10131d",

                        color: "white"

                    }}

                />

                <select

                    value={role}

                    onChange={(e) =>

                        setRole(e.target.value)

                    }

                    style={{

                        width: "100%",

                        padding: "12px",

                        marginBottom: "20px",

                        borderRadius: "10px",

                        border: "1px solid #2c3247",

                        background: "#10131d",

                        color: "white"

                    }}

                >

                    <option>Member</option>

                    <option>Admin</option>

                    <option>Owner</option>

                </select>

                <button

                    onClick={handleAddMember}

                    disabled={loading}

                    style={{

                        padding: "12px 24px",

                        border: "none",

                        borderRadius: "10px",

                        background: "#6366f1",

                        color: "white",

                        cursor: "pointer",

                        fontWeight: "600"

                    }}

                >

                    {

                        loading

                            ? "Adding..."

                            : "Invite Member"

                    }

                </button>

            </div>

            {/* ---------------- Members ---------------- */}

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

                        members.map((member) => (

                            <div

                                key={member.id}

                                style={{

                                    background: "#171b27",

                                    padding: "20px",

                                    borderRadius: "14px",

                                    marginBottom: "15px",

                                    display: "flex",

                                    justifyContent: "space-between",

                                    alignItems: "center"

                                }}

                            >

                                <div>

                                    <h3>

                                        {member.name}

                                    </h3>

                                    <p>

                                        {member.email}

                                    </p>

                                </div>

                                <div

                                    style={{

                                        display: "flex",

                                        gap: "10px",

                                        alignItems: "center"

                                    }}

                                >

                                    <select

                                        value={member.role}

                                        onChange={(e) =>

                                            handleRoleChange(

                                                member.id,

                                                e.target.value

                                            )

                                        }

                                        style={{

                                            padding: "10px",

                                            borderRadius: "8px",

                                            background: "#2d3653",

                                            color: "white",

                                            border: "none"

                                        }}

                                    >

                                        <option>

                                            Owner

                                        </option>

                                        <option>

                                            Admin

                                        </option>

                                        <option>

                                            Member

                                        </option>

                                    </select>

                                    <button

                                        onClick={() =>

                                            handleRemoveMember(

                                                member.id

                                            )

                                        }

                                        style={{

                                            background: "#ef4444",

                                            border: "none",

                                            color: "white",

                                            padding: "10px 16px",

                                            borderRadius: "8px",

                                            cursor: "pointer",

                                            fontWeight: "600"

                                        }}

                                    >

                                        Remove

                                    </button>

                                </div>

                            </div>

                        ))

                    )

            }

        </DashboardLayout>

    );

}

export default TeamPage;

