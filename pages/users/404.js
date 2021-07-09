import Title from "../../components/Title";
const FourOhFour = ({ isError }) => {
    return (
        <>
            <Title isError={isError} />
            404 ERROR - USER NOT FOUND
        </>
    );
};
export default FourOhFour;
export async function getServerSideProps(context) {
    return {
        props: { isError: true },
    };
}
