import { useState, useEffect, useContext } from "react";
import Title from "../../components/Title";
import { UserContext } from "../../providers/UserContext";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";
import Layout from "../../components/Layout";
import Footer from "../../components/Footer";

const Container = styled.div``;
const Heading = styled.h1`
    ${(props) =>
        props.night &&
        css`
            color: white;
            a {
                color: rgba(255, 255, 255, 0.7);
                text-decoration: none;
            }
            a:hover {
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
            }
        `}
`;
export default function Etc() {
    const [selectedImg, setSelectedImg] = useState(null);
    const router = useRouter();
    const { userData, setUserData } = useContext(UserContext);
    const [bgColor, setBGColor] = useState();
    const [textColor, setTextColor] = useState("#253335");
    const [nightMode, setNightMode] = useState();

    useEffect(() => {
        if (nightMode == "true") {
            setBGColor("#253335");
            setTextColor("#fff");
        }
        if (nightMode == "false") {
            setBGColor("#fff");
            setTextColor("#253335");
        }
    }, [nightMode, setNightMode]);

    useEffect(() => {
        // On Component Mount, set Night Mode from localStorage
        if (localStorage.getItem("nightMode") == null)
            localStorage.setItem("nightMode", false);

        setNightMode(localStorage.getItem("nightMode"));
    }, []);

    if (userData?.user?.uid && userData?.user?.username == null) {
        // When user is new, push user to profile route.
        router.push("/profile");
    }

    let night = nightMode == "true" ? true : false;
    let FindPage = router.asPath;
    let arr = FindPage.split("/");
    let pageTitle = arr[2].charAt(0).toUpperCase() + arr[2].slice(1);
    console.log(pageTitle);

    return (
        <Layout>
            <Container className="App">
                <Title bgColor={bgColor} setNightMode={setNightMode} />
                <Heading night={night}>{pageTitle}</Heading>

                <style jsx global>
                    {`
            html {
                background-color: ${bgColor};
        `}
                </style>
            </Container>
            <Footer nightMode={nightMode} />
        </Layout>
    );
}
