import { motion } from "framer-motion";
import { useEffect } from "react";

import AnimatedBackground from "./AnimatedBackground";

import "../styles/intro.css";

function IntroScreen({ onFinish }) {

    useEffect(()=>{

        const timer=setTimeout(()=>{

            onFinish();

        },3500);

        return()=>clearTimeout(timer);

    },[]);

    return(

        <motion.div

            className="intro"

            initial={{opacity:0}}

            animate={{opacity:1}}

            exit={{opacity:0}}

        >

            <AnimatedBackground/>

            <motion.div

                className="logo"

                initial={{

                    scale:.5,

                    opacity:0

                }}

                animate={{

                    scale:1,

                    opacity:1

                }}

                transition={{

                    duration:1

                }}

            >

                N

            </motion.div>

            <motion.h1

                className="title"

                initial={{

                    opacity:0,

                    y:30

                }}

                animate={{

                    opacity:1,

                    y:0

                }}

                transition={{

                    delay:.8

                }}

            >

                NEXORA AI

            </motion.h1>

            <motion.p

                initial={{opacity:0}}

                animate={{opacity:1}}

                transition={{delay:1.4}}

            >

                AI-powered document assistant

            </motion.p>

        </motion.div>

    );

}

export default IntroScreen;