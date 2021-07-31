import styled from "styled-components";
import CameraIcon from "@material-ui/icons/CameraAlt";
import AperatureIcon from "@material-ui/icons/Camera";
import IsoIcon from "@material-ui/icons/Iso";
import ShutterSpeedIcon from "@material-ui/icons/ShutterSpeed";

const ExifContainer = styled.div`
    display: flex;
    align-items: center;
    width: 70%;
    flex-direction: row;
    flex-wrap: wrap;
    color: ${(props) => props.theme.colors.primary};

    > div {
        display: flex;
        padding-right: 10px;
        align-items: center;
    }
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;
export const ImageMetaData = ({ exifInfo, modal }) => {
    const DisplayModal = () => (
        <Container>
            <ExifContainer>
                <div>
                    <CameraIcon fontSize="large" />
                    <div>{exifInfo?.model || "Unidentified Camera"}</div>
                    {/* </ExifContainer>
            <ExifContainer> */}
                </div>
                <div>
                    <AperatureIcon fontSize="large" /> <i>f</i>/
                    {exifInfo?.aperature?.value || "N/A"}
                </div>
                <div>
                    <ShutterSpeedIcon fontSize="large" />
                    {exifInfo?.exposure?.numerator || "1"}/
                    {exifInfo?.exposure?.denominator || "N/A"}
                </div>
                <div>
                    <IsoIcon fontSize="large" /> {exifInfo?.iso || "N/A"}
                </div>
            </ExifContainer>
        </Container>
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
