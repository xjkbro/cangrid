import { useState, createContext } from "react";
import { auth } from "../firebase/config";

export const UserContext = createContext({ user: null });
// class UserProvider extends Component {

// const UserProvider = () => {
//     // state = {
//     //     user: null,
//     // };
//     const [userData, setUserData] = useState({ user: null });

//     getInitialProps = async (ctx) => {
//         auth.onAuthStateChanged((userAuth) => {
//             setUserData({ user: userAuth });
//         });
//     };
//     return (
//         <UserContext.Provider value={{ userData, setUserData }}>
//             {this.props.children}
//         </UserContext.Provider>
//     );
// };

// export default UserProvider;
