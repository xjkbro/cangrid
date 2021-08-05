import { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Title from "../../components/Title";
import { UserContext } from "../../providers/UserContext";
const FourOhFour = ({ isError }) => {
    const { userData, setUserData } = useContext(UserContext);

    const [bgColor, setBGColor] = useState("#fff");
    const [nightMode, setNightMode] = useState(userData?.user?.nightMode);
    console.log(nightMode);
    useEffect(() => {
        if (nightMode == true) setBGColor("#253335");
        else setBGColor("#fff");
    }, [nightMode]);
    useEffect(() => {
        setNightMode(userData?.user?.nightMode);
    }, [userData]);
    return (
        <Layout>
            <div className="App">
                <Title
                    isError={isError}
                    bgColor={bgColor}
                    setNightMode={setNightMode}
                />
                <style jsx global>
                    {`
                html {
                    background-color: ${bgColor};
            `}
                </style>
            </div>
        </Layout>
    );
};
export default FourOhFour;
export async function getServerSideProps(context) {
    return {
        props: { isError: true },
    };
}
