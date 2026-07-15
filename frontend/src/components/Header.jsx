import { motion } from "framer-motion";
import "../styles/header.css";

function Header() {

    return (

        <motion.div

            className="header"

            initial={{

                opacity:0,

                y:-30

            }}

            animate={{

                opacity:1,

                y:0

            }}

            transition={{

                delay:.3,

                duration:.7

            }}

        >

            <div>

                <h1>

                    Welcome Back,

                    <span>

                        {" "}Nexora User

                    </span>

                </h1>

                <p>

                    AI-powered document assistant

                </p>

            </div>

        </motion.div>

    );

}

export default Header;