import { useContext, useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import ProfileCard from "../components/ProfileCard";
import AuthContext from "../components/authContext";
import { useSelector } from "react-redux";
import axios from "axios";
function Review() {
  const [data, setData] = useState([]);
  const { token } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  let goGetRequests = async (token, id) => {
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
  };

  useEffect(() => {
    if (token && user) {
      let id = user._id;
      goGetRequests(token, id)
        .then((data) => {
          let formattedData = data?.data?.map((sender) => {
            return {
              name: sender.senderUserId.name,
              sender_id: sender.senderUserId._id,
              connect_id: sender._id,
              bio: sender.senderUserId.bio,
              pic: sender.senderUserId.pic,
            };
          });
          setData(formattedData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [token, user?._id]);

  return (
    <div className="w-full flex flex-col items-center p-4 pt-0">
      {data.length === 0 ? (
        <p className="text-2xl">No Reviews Yet</p>
      ) : (
        <>
          {data?.map((user) => {
            return (
              <ProfileCard
                tab="review"
                setData={setData}
                data={user}
              ></ProfileCard>
            );
          })}
        </>
      )}
    </div>
  );
}

function Connect() {
  const [data, setData] = useState([]);
  const { token } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  let goGetConnections = async (token, id) => {
    let config = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    // use axios to get top tracks
    let response = await axios.get(
      `http://localhost:8888/getFriends/${user._id}`,
      config
    );
    return response.data;
  };

  useEffect(() => {
    if (token) {
      let id = user._id;
      goGetConnections(token, id)
        .then((data) => {
          const st=data?.data?.map((connection) => {
            return {
              name: connection.name,
              id: connection._id,
              bio: connection.bio,
              socials: {
                instagram: connection.socials.instagram,
                twitter: connection.socials.twitter,
              },

              pic: connection.pic,
            };
          });

          setData(st);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center p-4 pt-0">
      {!data ? (
        <p className="text-2xl">No Connections Yet</p>
      ) : (
        <>
          {data?.map((val, index) => {
            return (
              <ProfileCard tab="connect" key={index} data={val}></ProfileCard>
            );
          })}
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
