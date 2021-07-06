import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ProgressBar from "./ProgressBar";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

const UploadForm = () => {
    const [user, loading] = useAuthState(auth);

    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const typeCheck = ["image/png", "image/jpeg", "image/jpg"];
    const [form, setForm] = useState(null);

    const changeHandler = (e) => {
        let selected = e.target.files[0];
        if (selected && typeCheck.includes(selected.type)) {
            setFile(selected);
            setError("");
        } else {
            setFile(null);
            setError("Please Select an image file. (png/jpeg/jpg)");
        }
    };
    const submitForm = (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please Select an image file. (png/jpeg/jpg)");
        } else {
            setForm(true);
        }
        console.log(caption);
        console.log(file);
    };

    const showUploadForm = () => {
        if (user == null) {
            // return <p>Please Login to have the option to upload.</p>;
            return <></>;
        } else {
            return (
                <form onSubmit={submitForm}>
                    <div className="fileContainer">
                        <TextField
                            multiline
                            rows={4}
                            placeholder="Caption"
                            variant="filled"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <label className="uploadButton uploadLabel">
                            <input type="file" onChange={changeHandler} />
                            <span>+</span>
                        </label>
                        <Button
                            variant="contained"
                            component="span"
                            className="submitButton"
                            // color="primary"
                            onClick={submitForm}
                        >
                            Upload
                        </Button>
                    </div>
                    <div className="output">
                        {error && <div className="error">{error}</div>}
                        {file && <div>{file.name}</div>}
                        {form && (
                            <ProgressBar
                                file={file}
                                setFile={setFile}
                                caption={caption}
                                setCaption={setCaption}
                                setForm={setForm}
                            />
                        )}
                    </div>
                </form>
            );
        }
    };
    return <>{showUploadForm()}</>;
};
export default UploadForm;
