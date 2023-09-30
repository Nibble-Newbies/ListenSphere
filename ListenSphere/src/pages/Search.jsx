import { useContext, useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import ProfileCard from "../components/ProfileCard";
import AuthContext from "../components/authContext";
import { useSelector } from "react-redux";
import axios from "axios";
function Search() {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (token && user) {
      let id = user._id;
      goGetUsers(token, id)
        .then((data) => {
          console.log(data);
          setUsers(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleClose=(id)=>{
    let newUsers=users.filter(user=>user._id!==id);
    setUsers(newUsers);
  }

  return (
    <div className="w-full flex flex-col items-center p-4 pt-0">
      <Navigation page="search"></Navigation>
      {users.length===0 && !loading ? (
        <p className="text-2xl">No Results</p>
      ) : (
        <>
          {users?.sort((a,b)=>b?.score-a?.score)?.map((u,index) => {
            return <ProfileCard tab="search" data={u} key={index} setUsers={setUsers} id={u?._id} userId={user?._id}></ProfileCard>;
          })}
        </>
      )}
    </div>
  );
}
export default Search;

async function goGetUsers(token, id) {
  let config = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  // use axios to get top tracks
  let response = await axios.get(
    `http://localhost:8888/getRanking/${id}`,
    config
  );
  return response.data;
}
