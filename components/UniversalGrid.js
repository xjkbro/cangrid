import { motion } from "framer-motion";
import { FadeTransform, Stagger } from "react-animation-components";
import { TransitionGroup } from "react-transition-group";

const ImageGrid = ({ images, setSelectedImg }) => {
    return (
        <TransitionGroup>
            <Stagger in className="img-grid" duration={300} delay={50}>
                {images &&
                    images
                        .filter((item, idx) => idx < 30) //limits the number of items on main page to max at 30
                        .map((doc) => (
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
                                <div
                                    className="img-wrap"
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
