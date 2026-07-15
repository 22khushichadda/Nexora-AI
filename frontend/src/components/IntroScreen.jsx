import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useState } from "react";
import "../styles/intro.css";

function IntroScreen({ onEnter }) {

    const [showButton, setShowButton] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {

            setShowButton(true);

        }, 3200);

        return () => clearTimeout(timer);

    }, []);

    return (

        <motion.div

            className="intro"

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            transition={{ duration: 1 }}

        >

            <div className="background-blur"></div>

            <motion.div

                className="logo"

                initial={{ scale: .5, opacity: 0 }}

                animate={{ scale: 1, opacity: 1 }}

                transition={{

                    duration: 1.2,

                    ease: "easeOut"

                }}

            >

                N

            </motion.div>

            <TypeAnimation

                sequence={[

                    "",

                    500,

                    "NEXORA AI"

                ]}

                wrapper="h1"

                speed={45}

                cursor={false}

                className="title"

            />

            <motion.p

                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}

                transition={{ delay: 1.8 }}

            >

                AI-powered document assistant

            </motion.p>

            {

                showButton &&

                <motion.button

                    className="enter-btn"

                    whileHover={{

                        scale: 1.05

                    }}

                    whileTap={{

                        scale: .95

                    }}

                    onClick={onEnter}

                    initial={{

                        opacity:0,

                        y:20

                    }}

                    animate={{

                        opacity:1,

                        y:0

                    }}

                >

                    Enter Nexora

                </motion.button>

            }

        </motion.div>

    );

}

export default IntroScreen;