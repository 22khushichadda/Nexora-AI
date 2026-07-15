import { FileText, FolderOpen, MessageSquare, Brain } from "lucide-react";
import { motion } from "framer-motion";

import "../styles/stats.css";

const stats = [
  {
    icon: <FileText size={30} />,
    title: "Documents",
    value: "12"
  },
  {
    icon: <FolderOpen size={30} />,
    title: "Workspaces",
    value: "4"
  },
  {
    icon: <MessageSquare size={30} />,
    title: "AI Chats",
    value: "82"
  },
  {
    icon: <Brain size={30} />,
    title: "Research Queries",
    value: "241"
  }
];

function StatsCards() {

    return (

        <div className="stats-grid">

            {

                stats.map((item,index)=>(

                    <motion.div

                        key={index}

                        className="stat-card glass"

                        whileHover={{y:-8}}

                        transition={{duration:.25}}

                    >

                        <div className="stat-icon">

                            {item.icon}

                        </div>

                        <h3>{item.value}</h3>

                        <p>{item.title}</p>

                    </motion.div>

                ))

            }

        </div>

    );

}

export default StatsCards;