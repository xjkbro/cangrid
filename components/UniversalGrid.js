import useFirestore from "../hooks/useFirestore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Router from "next/router";
import { FadeTransform, Stagger } from "react-animation-components";
import { TransitionGroup } from "react-transition-group";

const ImageGrid = ({ setSelectedImg }) => {
    const { docs } = useFirestore("images");
    const [imgs, setImgs] = useState([]);

    useEffect(() => {
        // setImgs(docs.sort(() => 0.5 - Math.random()));
    }, [docs]);
    console.log(imgs);

    return (
        <TransitionGroup>
            <Stagger in className="img-grid">
                {docs &&
                    docs
                        .filter((item, idx) => idx < 30) //limits the number of items on main page to max at 30
                        .map((doc) => (
                            <FadeTransform
                                in
                                fadeProps={{
                                    enterOpacity: 1,
                                    exitOpacity: 0,
                                }}
                                transformProps={{
                                    exitTransform: "translateY(100px)",
                                }}
                            >
                                <div
                                    className="img-wrap"
                                    key={doc.id}
                                    onClick={() => setSelectedImg(doc)}
                                >
                                    <motion.img
                                        src={doc.url}
                                        alt="uploaded pic"
                                    />
                                </div>
                            </FadeTransform>
                        ))}
            </Stagger>
        </TransitionGroup>
    );
};

export default ImageGrid;
