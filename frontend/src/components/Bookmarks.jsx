import { useState } from "react";

import {
    ChevronDown,
    Bookmark
} from "lucide-react";

import "../styles/cards.css";

function Bookmarks() {

    const [open, setOpen] = useState(false);

    const bookmarkedDocs = [

        {

            id: 1,

            name: "AI Research Paper.pdf",

            pages: [

                {

                    page: 12,

                    time: "12 Jul • 8:42 PM"

                },

                {

                    page: 18,

                    time: "13 Jul • 2:15 PM"

                },

                {

                    page: 27,

                    time: "Yesterday • 7:30 PM"

                }

            ]

        },

        {

            id: 2,

            name: "Machine Learning.pdf",

            pages: [

                {

                    page: 8,

                    time: "11 Jul • 4:18 PM"

                },

                {

                    page: 19,

                    time: "12 Jul • 9:05 AM"

                }

            ]

        }

    ];

    const [selectedDoc, setSelectedDoc] = useState(null);

    return (

        <div className="doc-card">

            <div
                className="card-header"
                onClick={() => {

                    setOpen(!open);

                    if(open){

                        setSelectedDoc(null);

                    }

                }}
            >

                <div className="title">

                    <Bookmark size={22}/>

                    <h2>

                        Bookmarked Pages

                    </h2>

                </div>

                <ChevronDown
                    size={24}
                    style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "0.3s"
                    }}
                />

            </div>

            {

                open && (

                    <div className="doc-list">

                        {

                            !selectedDoc ?

                            bookmarkedDocs.map((doc)=>(

                                <div
                                    key={doc.id}
                                    className="doc-item"
                                    onClick={()=>setSelectedDoc(doc)}
                                >

                                    <div className="pdf-icon">

                                        PDF

                                    </div>

                                    <div className="doc-info">

                                        <h3>

                                            {doc.name}

                                        </h3>

                                    </div>

                                </div>

                            ))

                            :

                            <>

                                {

                                    selectedDoc.pages.map((item,index)=>(

                                        <div
                                            key={index}
                                            className="bookmark-item"
                                        >

                                            <div>

                                                <h3>

                                                    Page {item.page}

                                                </h3>

                                                <p>

                                                    {item.time}

                                                </p>

                                            </div>

                                        </div>

                                    ))

                                }

                            </>

                        }

                    </div>

                )

            }

        </div>

    );

}

export default Bookmarks;