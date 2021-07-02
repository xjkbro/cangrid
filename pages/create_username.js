import { useEffect } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { auth, provider, projectFirestore } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

function CreateUsername() {
    console.log("HELOOO");
    return <Container>ajhksdjaklsd</Container>;
}
export default CreateUsername;
const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    /* background-color: #495057; */
`;
