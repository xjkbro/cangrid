import { useEffect } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { auth, provider } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
`;
const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
    > button {
        border: none;
        :hover {
            background-color: #e9ecef;
        }
    }
`;
const Logo = styled.div`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;

function Login() {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const signIn = () => {
        auth.signInWithRedirect(provider)
            .then((res) => {
                router.push("/profile");
            })
            .catch(alert);
    };

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user]);

    return (
        <Layout>
            <Container>
                <LoginContainer>
                    <Logo>GalleryIO</Logo>
                    <p></p>
                    <Button onClick={signIn} variant="outlined">
                        Sign In with Google
                    </Button>
                </LoginContainer>
            </Container>
        </Layout>
    );
}
export default Login;
