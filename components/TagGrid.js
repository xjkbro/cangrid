import { motion } from "framer-motion";

import { FadeTransform, Stagger } from "react-animation-components";
import { TransitionGroup } from "react-transition-group";

const ImageGrid = ({ images, setSelectedImg }) => {
    return (
        <TransitionGroup>
            <Stagger in className="img-grid">
                {images &&
                    images?.map((doc) => {
                        return (
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
                        );
                    })}
            </Stagger>
        </TransitionGroup>
    );
};

export default ImageGrid;
