import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ProgressBar from "./ProgressBar";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import EXIF from "exif-js";
import CameraIcon from "@material-ui/icons/CameraAlt";
import AperatureIcon from "@material-ui/icons/Camera";
import IsoIcon from "@material-ui/icons/Iso";
import ShutterSpeedIcon from "@material-ui/icons/ShutterSpeed";

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-width: 500px;
    > .MuiFormControl-root {
        width: 100%;
        height: 200px;
    }
    .MuiInputBase-root {
        width: 100%;
        height: 100%;
    }
    .MuiFilledInput-multiline {
        padding: 50px 14px 14px;
    }
    > .uploadButton {
        position: absolute;
        left: 15px;
        top: 0px;
    }
    > span {
        position: absolute;
        right: 15px;
        top: 20px;
    }
`;
const Form = styled.form`
    margin: 0px auto;
    text-align: center;
    width: 100%;
`;
const ExifContainer = styled.div`
    display: flex;
    align-items: center;
`;
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
                <Form onSubmit={submitForm}>
                    {file && <div>{file.name}</div>}
                    <Container>
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
                    </Container>
                    <div className="output">
                        {error && <div className="error">{error}</div>}

                        {file && (
                            <>
                                <ExifContainer>
                                    <CameraIcon fontSize="large" />
                                    <span>
                                        {exifInfo?.model ||
                                            "Unidentified Camera"}
                                    </span>
                                </ExifContainer>
                                <ExifContainer>
                                    <AperatureIcon fontSize="large" /> <i>f</i>/
                                    {exifInfo?.aperature?.value || "N/A"}
                                </ExifContainer>
                                <ExifContainer>
                                    <ShutterSpeedIcon fontSize="large" />
                                    {exifInfo?.exposure?.numerator || "1"}/
                                    {exifInfo?.exposure?.denominator || "N/A"}
                                </ExifContainer>
                                <ExifContainer>
                                    <IsoIcon fontSize="large" />{" "}
                                    {exifInfo?.iso || "N/A"}
                                </ExifContainer>
                            </>
                        )}

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
                </Form>
            );
        }
    };
    return <>{showUploadForm()}</>;
};
export default UploadForm;
