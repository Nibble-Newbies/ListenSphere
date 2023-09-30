import { useContext, useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import ProfileCard from "../components/ProfileCard";
import AuthContext from "../components/authContext";
import {useSelector} from "react-redux";
import axios from "axios";
function Review() {
  const [data, setData] = useState([]);
  const {token}= useContext(AuthContext);
  const {user}=useSelector(state=>state.user);
  const [loading,setLoading]=useState(true)
  let goGetRequests=async (token,id)=>{
    let config = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    // use axios to get top tracks
    let response = await axios.get(
      `http://localhost:8888/getRequests/${id}`,
      config
    );
    return response.data;
  }

  useEffect(() => {
    if (token && user) {
      let id = user._id;
      goGetRequests(token, id)
        .then((data) => {
          let formattedData = data?.data?.map((sender)=>{
            return {
              name:sender.senderUserId.name,
              id:sender.senderUserId._id,
              bio:sender.senderUserId.bio,
              pic:sender.senderUserId.pic,
            }
          })
          console.log(formattedData);
          setData(formattedData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false)
        });
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center p-4 pt-0">
      {data.length===0 ? (
        <p className="text-2xl">No Reviews Yet</p>
      ) : (
        <>
          {
            data?.map((user)=>{
              return <ProfileCard tab="review" data={user}></ProfileCard>
            })
          }
        </>
      )}
    </div>
  );
}

function Connect({data}) {
  return (
    <div className="w-full flex flex-col items-center p-4 pt-0">
      {!data ? (
        <p className="text-2xl">No Connections Yet</p>
      ) : (
        <>
          <ProfileCard tab="connect"></ProfileCard>
          <ProfileCard tab="connect"></ProfileCard>
          <ProfileCard tab="connect"></ProfileCard>
          <ProfileCard tab="connect"></ProfileCard>
          <ProfileCard tab="connect"></ProfileCard>
          <ProfileCard tab="connect"></ProfileCard>
        </>
      )}
    </div>
  );
}

function LikesTabs() {
  const [tab, setTab] = useState("review");

  function handleClick(newTab) {
    setTab(newTab);
  }

  return (
    <div className="w-full flex flex-col items-center p-4 pt-0">
      <div className="flex flex-col items-center sticky top-[4.25rem] z-10 bg-white mb-4">
        <hr className="w-[98vw] h-1 bg-black" />
        <div className="flex">
          <button
            onClick={() => handleClick("review")}
            className={`p-2 hover:bg-nav-yellow ${
              tab === "review" ? "bg-nav-yellow" : ""
            }`}
          >
            &nbsp;Review&nbsp;
          </button>
          <button
            onClick={() => handleClick("connect")}
            className={`p-2 hover:bg-nav-yellow ${
              tab === "connect" ? "bg-nav-yellow" : ""
            }`}
          >
            Connect
          </button>
        </div>
      </div>
      {tab === "review" && <Review />}
      {tab === "connect" && <Connect />}
    </div>
  );
}

function Likes() {
  return (
    <div className="w-full flex flex-col items-center p-4 pt-0">
      <Navigation page="likes"></Navigation>
      <LikesTabs></LikesTabs>
    </div>
  );
}

export default Likes;
