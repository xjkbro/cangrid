import { motion } from "framer-motion";
import { FadeTransform, Stagger } from "react-animation-components";
import { TransitionGroup } from "react-transition-group";
import Image from "next/image";

const ImageGrid = ({ images, setSelectedImg }) => {
    return (
        <TransitionGroup>
            <Stagger in className="img-grid" duration={300} delay={50}>
                {images &&
                    images?.map((doc) => {
                        return (
                            <FadeTransform
                                key={doc.id}
                                in
                                fadeProps={{
                                    enterOpacity: 1,
                                    exitOpacity: 0,
                                }}
                                transformProps={{
                                    exitTransform: "translateY(100px)",
                                }}
                            >
                                {/* <div
                                    className="img-wrap"
                                    onClick={() => setSelectedImg(doc)}
                                > */}
                                {/* <motion.div> */}
                                <Image
                                    src={doc.url}
                                    width={300}
                                    height={300}
                                    objectFit="cover"
                                    style={{ cursor: "pointer" }}
                                    alt="uploaded pic"
                                    onClick={() => setSelectedImg(doc)}
                                />
                                {/* </motion.div> */}
                                {/* </div> */}
                            </FadeTransform>
                        );
                    })}
            </Stagger>
        </TransitionGroup>
    );
};

export default ImageGrid;
