import "../styles/message.css";

function Message({ sender, text }) {

    return (

        <div className={`message ${sender}`}>

            <div className="avatar">

                {sender === "user" ? "👤" : "🤖"}

            </div>

            <div className="bubble">

                {text}

            </div>

        </div>

    );

}

export default Message;