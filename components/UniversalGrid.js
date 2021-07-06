import useFirestore from "../hooks/useFirestore";
import { motion } from "framer-motion";

const ImageGrid = ({ setSelectedImg }) => {
    const { docs } = useFirestore("images");
    console.log(docs);
    return (
        <div className="img-grid">
            {docs &&
                docs
                    .filter((item, idx) => idx < 30) //limits the number of items on main page to max at 30
                    .map((doc) => (
                        <motion.div
                            className="img-wrap"
                            key={doc.id}
                            layout
                            whileHover={{ opacity: 1 }}
                            s
                            onClick={() => setSelectedImg(doc)}
                        >
                            <motion.img
                                src={doc.url}
                                alt="uploaded pic"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            />
                        </motion.div>
                    ))}
        </div>
    );
};

export default ImageGrid;
