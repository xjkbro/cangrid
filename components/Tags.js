import Link from "next/link";
import styled from "styled-components";

const Item = styled.span`
    margin: 3px 3px;
    padding: 3px 10px;
    background-color: #89b0ae;
    color: white;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
`;
const Container = styled.div`
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
`;
export const Tags = ({ tags, setSelectedImg }) => {
    return (
        <>
            <Container>
                {tags?.map((item) => (
                    <Link href={`/tags/${item}`} key={item}>
                        <Item
                            onClick={() => {
                                setSelectedImg(null);
                            }}
                        >
                            {item}
                        </Item>
                    </Link>
                ))}
            </Container>
        </>
    );
};
