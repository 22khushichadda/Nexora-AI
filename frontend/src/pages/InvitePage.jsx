import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


function InvitePage() {

    const { token } = useParams();

    const navigate = useNavigate();

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

                const response = await axios.get(

                    `http://127.0.0.1:8000/workspace/invitation/${token}`

                );

                setInvitation(
                    response.data
                );

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


            const response = await axios.post(

                `http://127.0.0.1:8000/workspace/invitation/${token}/accept`

            );


            alert(
                response.data.message
            );


            navigate("/team");

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

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#0f111a",
                    color: "white"
                }}
            >

                Loading invitation...

            </div>

        );

    }


    // ======================================================
    // Error
    // ======================================================

    if (error) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#0f111a",
                    color: "white"
                }}
            >

                <div
                    style={{
                        background: "#171b27",
                        padding: "40px",
                        borderRadius: "16px",
                        textAlign: "center",
                        maxWidth: "500px"
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

            </div>

        );

    }


    // ======================================================
    // Invitation
    // ======================================================

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#0f111a",
                color: "white"
            }}
        >

            <div
                style={{
                    background: "#171b27",
                    padding: "40px",
                    borderRadius: "16px",
                    textAlign: "center",
                    width: "420px",
                    maxWidth: "90%"
                }}
            >

                <div
                    style={{
                        fontSize: "50px",
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
                        lineHeight: "1.6"
                    }}
                >

                    Hello{" "}

                    <strong>
                        {invitation.name}
                    </strong>

                    ,

                    <br />

                    You have been invited to join a
                    Nexora AI workspace.

                </p>


                <div
                    style={{
                        marginTop: "25px",
                        marginBottom: "25px",
                        padding: "15px",
                        background: "#10131d",
                        borderRadius: "10px"
                    }}
                >

                    <p>
                        <strong>
                            Email:
                        </strong>
                    </p>

                    <p>
                        {invitation.email}
                    </p>


                    <p
                        style={{
                            marginTop: "10px"
                        }}
                    >
                        <strong>
                            Role:
                        </strong>
                    </p>

                    <p>
                        {invitation.role}
                    </p>

                </div>


                <button

                    onClick={handleAccept}

                    disabled={accepting}

                    style={{
                        width: "100%",
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

        </div>

    );

}


export default InvitePage;