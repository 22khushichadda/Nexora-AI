import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";


function InvitePage() {

    const { token } = useParams();

    const [invitation, setInvitation] = useState(null);

    const [loading, setLoading] = useState(true);

    const [accepting, setAccepting] = useState(false);

    const [error, setError] = useState("");


    // ======================================================
    // Load Invitation
    // ======================================================

    useEffect(() => {

        const loadInvitation = async () => {

            try {

                const response = await API.get(
                    `/workspace/invitation/${token}`
                );

                setInvitation(response.data);

            }

            catch (err) {

                console.log(
                    "Invitation error:",
                    err
                );

                setError(
                    err.response?.data?.detail ||
                    "This invitation is invalid or has expired."
                );

            }

            finally {

                setLoading(false);

            }

        };

        loadInvitation();

    }, [token]);


    // ======================================================
    // Accept Invitation
    // ======================================================

    const handleAccept = async () => {

        try {

            setAccepting(true);

            setError("");

            const response = await API.post(
                `/workspace/invitation/${token}/accept`
            );

            alert(
                response.data.message ||
                "Invitation accepted successfully."
            );

            window.location.href = "/team";

        }

        catch (err) {

            console.log(
                "Accept invitation error:",
                err
            );

            setError(
                err.response?.data?.detail ||
                "Unable to accept invitation."
            );

        }

        finally {

            setAccepting(false);

        }

    };


    // ======================================================
    // Loading
    // ======================================================

    if (loading) {

        return (

            <DashboardLayout>

                <div
                    style={{
                        padding: "40px",
                        color: "white"
                    }}
                >

                    Loading invitation...

                </div>

            </DashboardLayout>

        );

    }


    // ======================================================
    // Error
    // ======================================================

    if (error) {

        return (

            <DashboardLayout>

                <div
                    style={{
                        background: "#171b27",
                        padding: "40px",
                        borderRadius: "16px",
                        maxWidth: "600px",
                        margin: "40px auto",
                        textAlign: "center",
                        color: "white"
                    }}
                >

                    <h1>
                        ❌ Invitation Error
                    </h1>

                    <p
                        style={{
                            marginTop: "15px",
                            color: "#aeb7d0"
                        }}
                    >

                        {error}

                    </p>

                </div>

            </DashboardLayout>

        );

    }


    // ======================================================
    // Invitation Page
    // ======================================================

    return (

        <DashboardLayout>

            <div
                style={{
                    maxWidth: "650px",
                    margin: "50px auto",
                    background: "#171b27",
                    padding: "40px",
                    borderRadius: "18px",
                    textAlign: "center",
                    color: "white"
                }}
            >

                <div
                    style={{
                        fontSize: "55px",
                        marginBottom: "15px"
                    }}
                >

                    👥

                </div>


                <h1>
                    You're Invited!
                </h1>


                <p
                    style={{
                        color: "#aeb7d0",
                        marginTop: "15px",
                        lineHeight: "1.7"
                    }}
                >

                    Hello{" "}

                    <strong>
                        {invitation.name}
                    </strong>

                    !

                    <br />

                    You have been invited to join a
                    Nexora AI workspace.

                </p>


                <div
                    style={{
                        marginTop: "25px",
                        padding: "20px",
                        background: "#10131d",
                        borderRadius: "12px",
                        textAlign: "left"
                    }}
                >

                    <p>

                        <strong>
                            Email:
                        </strong>

                        <br />

                        {invitation.email}

                    </p>


                    <p
                        style={{
                            marginTop: "15px"
                        }}
                    >

                        <strong>
                            Role:
                        </strong>

                        <br />

                        {invitation.role}

                    </p>


                    <p
                        style={{
                            marginTop: "15px"
                        }}
                    >

                        <strong>
                            Status:
                        </strong>

                        <br />

                        ⏳ {invitation.status}

                    </p>

                </div>


                <button

                    onClick={handleAccept}

                    disabled={accepting}

                    style={{
                        width: "100%",
                        marginTop: "25px",
                        padding: "14px",
                        border: "none",
                        borderRadius: "10px",
                        background:
                            accepting
                                ? "#44475a"
                                : "#6366f1",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor:
                            accepting
                                ? "not-allowed"
                                : "pointer"
                    }}

                >

                    {
                        accepting
                            ? "Accepting..."
                            : "Accept Invitation"
                    }

                </button>

            </div>

        </DashboardLayout>

    );

}


export default InvitePage;