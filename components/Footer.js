import Link from "next/link";
import styled, { css } from "styled-components";

const List = styled.ul`
    width: 100%;
    padding-left: 0;
    margin: 0 auto;
    text-align: center;
    position: absolute;
    padding-bottom: 10px;

    @media (min-width: 600px) {
        font-size: 14px;
        position: fixed;
        bottom: 10px;
        padding-bottom: 0;
    }
`;
const ListItem = styled.li`
    display: inline;
    font-size: 12px;
    margin: auto;
    text-align: center;
    padding: 0 12px;
    color: black;
    a {
        color: rgba(0, 0, 0, 0.7);
        text-decoration: none;
    }
    a:hover {
        color: rgba(0, 0, 0, 0.8);
        text-decoration: none;
    }

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

    @media (min-width: 600px) {
        font-size: 14px;
    }
`;

const Footer = ({ nightMode }) => {
    let night = nightMode == "true" ? true : false;
    return (
        <List>
            <ListItem night={night}>
                <Link href="/etc/about">About</Link>
            </ListItem>
            <ListItem night={night}>
                <Link href="/etc/privacy">Privacy</Link>
            </ListItem>
            <ListItem night={night}>
                <Link href="/etc/terms">Terms</Link>
            </ListItem>
            <ListItem night={night}>
                <Link href="/etc/copyright">Copyright</Link>
            </ListItem>
            <ListItem night={night}>
                <Link href="/etc/policy-safety">Policy and Safety</Link>
            </ListItem>
            <ListItem night={night}>
                <Link href="/etc/contact">Contact</Link>
            </ListItem>
        </List>
    );
};
export default Footer;
