import styled from "styled-components";
import CameraIcon from "@material-ui/icons/CameraAlt";
import AperatureIcon from "@material-ui/icons/Camera";
import IsoIcon from "@material-ui/icons/Iso";
import ShutterSpeedIcon from "@material-ui/icons/ShutterSpeed";

const ExifContainer = styled.div`
    display: flex;
    align-items: center;
`;
export const ImageMetaData = ({ exifInfo }) => {
    return (
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
};
