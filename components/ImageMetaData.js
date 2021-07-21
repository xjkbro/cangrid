import styled from "styled-components";
import CameraIcon from "@material-ui/icons/CameraAlt";
import AperatureIcon from "@material-ui/icons/Camera";
import IsoIcon from "@material-ui/icons/Iso";
import ShutterSpeedIcon from "@material-ui/icons/ShutterSpeed";

const ExifContainer = styled.div`
    display: flex;
    align-items: center;
    > span {
        display: flex;
        padding-right: 10px;
        align-items: center;
    }
`;
export const ImageMetaData = ({ exifInfo, modal }) => {
    const DisplayModal = () => (
        <>
            <ExifContainer>
                <CameraIcon fontSize="large" />
                <span>{exifInfo?.model || "Unidentified Camera"}</span>
            </ExifContainer>
            <ExifContainer>
                <span>
                    <AperatureIcon fontSize="large" /> <i>f</i>/
                    {exifInfo?.aperature?.value || "N/A"}
                </span>
                <span>
                    <ShutterSpeedIcon fontSize="large" />
                    {exifInfo?.exposure?.numerator || "1"}/
                    {exifInfo?.exposure?.denominator || "N/A"}
                </span>
                <span>
                    <IsoIcon fontSize="large" /> {exifInfo?.iso || "N/A"}
                </span>
            </ExifContainer>
        </>
    );
    const UploadModal = () => (
        <>
            <ExifContainer>
                <CameraIcon fontSize="large" />
                <span>{exifInfo?.model || "Unidentified Camera"}</span>
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
                <IsoIcon fontSize="large" /> {exifInfo?.iso || "N/A"}
            </ExifContainer>
        </>
    );
    return <>{modal ? <DisplayModal /> : <UploadModal />}</>;
};
