import Link from "next/link";
import styled from "styled-components";

const List = styled.ul`
    width: 100%;
    padding-left: 0;
    margin: 0 auto;
    text-align: center;
    position: fixed;
    bottom: 10px;
`;
const ListItem = styled.li`
    display: inline;
    font-size: 12px;
    color: white;
    margin: auto;
    text-align: center;
    padding: 0 12px;
    a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
    }
    a:hover {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
    }
    @media (min-width: 600px) {
        font-size: 14px;
    }
`;

const Footer = () => {
    return (
        <List>
            <ListItem>
                <Link href="/">About</Link>
            </ListItem>
            <ListItem>
                <Link href="/">Privacy</Link>
            </ListItem>
            <ListItem>
                <Link href="/">Terms</Link>
            </ListItem>
            <ListItem>
                <Link href="/">Copyright</Link>
            </ListItem>
            <ListItem>
                <Link href="/">Policy and Safety</Link>
            </ListItem>
            <ListItem>
                <Link href="/">Contact</Link>
            </ListItem>
            <ListItem>
                <Link href="/">Privacy</Link>
            </ListItem>
        </List>
    );
};
export default Footer;
