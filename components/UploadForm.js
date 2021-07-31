import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ProgressBar from "./ProgressBar";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import EXIF from "exif-js";
import { ImageMetaData } from "./ImageMetaData";

const Form = styled.div`
    margin: 0px 0px;
    text-align: center;
    width: 100%;
    @media (min-width: 600px) {
        width: 500px;
    }
`;
const Container = styled.div`
    display: flex;
    flex-flow: column wrap;
    position: relative;
    max-width: 100%;
    min-height: auto;

    > .MuiFormControl-root {
        width: 100%;
        /* height: 200px; */
        margin: 5px 0;
    }
    .MuiInputBase-root .MuiFilledInput-root {
        width: 100%;
        height: 100%;
    }
    .MuiInputBase-root .MuiOutlinedInput-root {
        width: 100%;
    }
    .MuiFilledInput-multiline {
        /* padding: 50px 14px 14px; */
    }
    .MuiInputBase-inputMultiline {
        height: 175px;
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
    @media (min-width: 600px) {
        max-width: 490px;
    }
`;

const ExifContainer = styled.div`
    display: flex;
    align-items: center;
`;
const UploadLabel = styled.label`
    display: block;
    width: 30px;
    height: 30px;
    border: 1px solid var(--primary);
    border-radius: 50%;
    /* margin: 10px auto; */
    line-height: 30px;
    color: var(--primary);
    font-weight: bold;
    font-size: 24px;
    border-bottom: 1px solid gray;
    /* padding-bottom: 15px; */
    /* width: 100%; */
    input {
        height: 0;
        width: 0;
        opacity: 0;
    }
    :hover {
        background: var(--primary);
        color: white;
    }
`;
const UploadButton = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 10px;
    top: 0;
    left: 0;
`;
const UploadOutput = styled.div`
    /* display: absolute; */
    padding-left: 10px;
`;
const Tag = styled.span`
    margin: 3px 3px;
    padding: 5px 12px;
    background-color: #89b0ae;
    color: white;
    border-radius: 20px;
    cursor: pointer;
`;
const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
`;
const UploadForm = ({ setSelectUpload }) => {
    const [user, loading] = useAuthState(auth);

    const [caption, setCaption] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const typeCheck = ["image/png", "image/jpeg", "image/jpg"];
    const [form, setForm] = useState(null);
    const [tags, setTags] = useState([]);
    const [singleTag, setSingleTag] = useState("");

    const [exifInfo, setExifInfo] = useState(null);

    const changeHandler = (e) => {
        let selected = e.target.files[0];
        if (selected && typeCheck.includes(selected.type)) {
            EXIF.getData(selected, () => {
                // let exifData = EXIF.getAllTags(selected);
                // let lensModel = EXIF.getTag(selected, "LensModel");  Unfortunately no lens model on my pictures :c
                console.log(EXIF.getAllTags(selected));
                let imgMake = EXIF.getTag(selected, "Make");
                let imgModel = EXIF.getTag(selected, "Model");
                let imgISO = EXIF.getTag(selected, "ISOSpeedRatings");
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
                console.log(imgISO);

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
                    <Container>
                        <UploadButton>
                            <UploadLabel>
                                <input type="file" onChange={changeHandler} />
                                <span>+</span>
                            </UploadLabel>
                            <UploadOutput>
                                {file && (
                                    <span>
                                        {file.name.substring(0, 25) +
                                            "..." +
                                            file.name.substring(
                                                file.name.length - 4,
                                                file.name.length
                                            )}
                                    </span>
                                )}
                                {error && <div className="error">{error}</div>}
                            </UploadOutput>
                        </UploadButton>
                        <TextField
                            multiline
                            rows={4}
                            placeholder="Caption"
                            variant="filled"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <Tags>
                            {tags.map((item) => (
                                <Tag
                                    onClick={(e) =>
                                        setTags(
                                            tags.filter(
                                                (item) =>
                                                    item !== e.target.innerHTML
                                            )
                                        )
                                    }
                                >
                                    {item}
                                </Tag>
                            ))}
                        </Tags>
                        <TextField
                            placeholder="Tags"
                            variant="outlined"
                            value={singleTag}
                            onChange={(e) => setSingleTag(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    if (tags.length < 15) {
                                        setTags([
                                            ...tags,
                                            singleTag.toLowerCase(),
                                        ]);
                                        setSingleTag("");
                                    }
                                }
                            }}
                        />
                        <div className="output">
                            {file && <ImageMetaData exifInfo={exifInfo} />}
                            <Button
                                variant="contained"
                                component="span"
                                className="submitButton"
                                // color="primary"
                                onClick={submitForm}
                            >
                                Upload
                            </Button>
                            {form && (
                                <ProgressBar
                                    file={file}
                                    setFile={setFile}
                                    exifInfo={exifInfo}
                                    setExifInfo={setExifInfo}
                                    caption={caption}
                                    setCaption={setCaption}
                                    setForm={setForm}
                                    tags={tags}
                                    setTags={setTags}
                                    setSelectUpload={setSelectUpload}
                                />
                            )}
                        </div>
                    </Container>
                </Form>
            );
        }
    };
    return <>{showUploadForm()}</>;
};
export default UploadForm;
