import { motion } from "framer-motion";
import "../styles/background.css";

function AnimatedBackground() {

    return (

        <div className="animated-bg">

            <motion.div

                className="blob blob1"

                animate={{

                    x:[0,100,0],
                    y:[0,-80,0]

                }}

                transition={{

                    duration:18,

                    repeat:Infinity,

                    ease:"easeInOut"

                }}

            />

            <motion.div

                className="blob blob2"

                animate={{

                    x:[0,-120,0],
                    y:[0,70,0]

                }}

                transition={{

                    duration:22,

                    repeat:Infinity,

                    ease:"easeInOut"

                }}

            />

            <motion.div

                className="blob blob3"

                animate={{

                    x:[0,60,0],
                    y:[0,100,0]

                }}

                transition={{

                    duration:26,

                    repeat:Infinity,

                    ease:"easeInOut"

                }}

            />

        </div>

    );

}

export default AnimatedBackground;