import "../styles/cards.css";

const workspaces=[

    "Research",

    "College",

    "AI Papers",

    "Personal"

];

function WorkspaceCards(){

    return(

        <div className="glass card">

            <h2>

                Workspaces

            </h2>

            {

                workspaces.map((item,index)=>(

                    <div

                        key={index}

                        className="list-item"

                    >

                        {item}

                    </div>

                ))

            }

        </div>

    );

}

export default WorkspaceCards;