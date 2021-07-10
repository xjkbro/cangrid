import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ProgressBar from "./ProgressBar";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import EXIF from "exif-js";

const UploadForm = () => {
    const [user, loading] = useAuthState(auth);

    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const typeCheck = ["image/png", "image/jpeg", "image/jpg"];
    const [form, setForm] = useState(null);
    const [exifInfo, setExifInfo] = useState(null);

    const changeHandler = (e) => {
        let selected = e.target.files[0];
        if (selected && typeCheck.includes(selected.type)) {
            EXIF.getData(selected, () => {
                // let exifData = EXIF.getAllTags(selected);
                // let lensModel = EXIF.getTag(selected, "LensModel");  Unfortunately no lens model on my pictures :c
                let imgMake = EXIF.getTag(selected, "Make");
                let imgModel = EXIF.getTag(selected, "Model");
                let imgISO = EXIF.getTag(selected, "ISOSpeedRating");
                let imgFocalLength = EXIF.getTag(selected, "FocalLength");
                let imgAperature = EXIF.getTag(selected, "FNumber");
                let imgExposure = EXIF.getTag(selected, "ExposureTime");
                let imgFlash = EXIF.getTag(selected, "Flash");
                let imgCameraFunction = EXIF.getTag(
                    selected,
                    "ExposureProgram"
                );
                let imgDate = EXIF.getTag(selected, "DateTime");

                let exifData = {};
                if (imgMake) exifData = { ...exifData, make: imgMake };
                if (imgModel) exifData = { ...exifData, model: imgModel };
                if (imgISO) exifData = { ...exifData, iso: imgISO };
                if (imgFocalLength)
                    exifData = {
                        ...exifData,
                        focalLength: {
                            value:
                                imgFocalLength.numerator /
                                imgFocalLength.denominator,
                            numerator: imgFocalLength.numerator,
                            denominator: imgFocalLength.denominator,
                        },
                    };
                if (imgAperature)
                    exifData = {
                        ...exifData,
                        aperature: {
                            value:
                                imgAperature.numerator /
                                imgAperature.denominator,
                            numerator: imgAperature.numerator,
                            denominator: imgAperature.denominator,
                        },
                    };
                if (imgExposure)
                    exifData = {
                        ...exifData,
                        exposure: {
                            value:
                                imgExposure.numerator / imgExposure.denominator,
                            numerator: imgExposure.numerator,
                            denominator: imgExposure.denominator,
                        },
                    };
                if (imgFlash) exifData = { ...exifData, flash: imgFlash };
                if (imgCameraFunction)
                    exifData = {
                        ...exifData,
                        cameraFunction: imgCameraFunction,
                    };
                if (imgDate)
                    exifData = {
                        ...exifData,
                        dateCaptured: imgDate,
                    };
                console.log(exifData);
                // let exifInfo = EXIF.getAllTags(selected);
                // let exifData = {
                //     make: exifInfo?.Make,
                //     model: exifInfo?.Model,
                //     iso: exifInfo?.ISOSpeedRatings,
                //     focalLength: {
                //         value:
                //             exifInfo?.FocalLength?.numerator /
                //             exifInfo?.FocalLength?.denominator,
                //         numerator: exifInfo?.FocalLength?.numerator,
                //         denominator: exifInfo?.FocalLength?.denominator,
                //     },
                //     aperature: {
                //         value:
                //             exifInfo?.FNumber?.numerator /
                //             exifInfo?.FNumber?.denominator,
                //         numerator: exifInfo?.FNumber?.numerator,
                //         denominator: exifInfo?.FNumber?.denominator,
                //     },
                //     exposure: {
                //         value:
                //             exifInfo?.ExposureTime?.numerator /
                //             exifInfo?.ExposureTime?.denominator,
                //         numerator: exifInfo?.ExposureTime?.numerator,
                //         denominator: exifInfo?.ExposureTime?.denominator,
                //     },
                //     flash: exifInfo?.Flash,
                //     cameraFunction: exifInfo?.ExposureProgram,
                //     dateCaptured: exifInfo?.DateTime,
                // };

                if (exifData) {
                    setExifInfo(exifData);
                    // console.log(EXIF.getTag(selected, "Orientation"));
                } else {
                    console.log(
                        "No EXIF data found in image '" + file.name + "'."
                    );
                }
            });
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
                                exifInfo={exifInfo}
                                setExifInfo={setExifInfo}
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
