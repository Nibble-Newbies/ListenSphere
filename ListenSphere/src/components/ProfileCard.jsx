import { Link, useNavigate } from "react-router-dom";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidPencil } from "react-icons/bi";
import { BsFillChatRightFill } from "react-icons/bs";
import { useContext } from "react";
import axios from "axios";
import AuthContext from "./authContext";

function Socials({ insta, twitter }) {
  if (!insta && !twitter) return <></>;

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={"https://www.instagram.com/" + insta}
        className="flex items-center gap-1 p-1 border-2 border-black bg-button-green hover:bg-button-green-dark rounded-lg break-all"
        target="blank"
      >
        <div>
          <FaInstagram className="text-white  bg-black p-1 text-2xl rounded-lg block" />
        </div>
        <p>{insta}</p>
      </a>
      <a
        href={"https://www.twitter.com/" + twitter}
        className="flex items-center gap-1 p-1 border-2 border-black bg-button-green hover:bg-button-green-dark rounded-lg"
        target="blank"
      >
        <div>
          <FaXTwitter className="text-white  bg-black p-1 text-2xl rounded-lg block" />
        </div>
        <p>{twitter}</p>
      </a>
    </div>
  );
}

function Reactions({ tab,setUsers,setData, id, userId, connect_id,sender_id }) {
  const { token } = useContext(AuthContext);
  const handleClose = async () => {
    if (connect_id) {
      let goGetRequests = async () => {
        let config = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        // use axios to get top tracks
        let response = await axios.get(
          `http://localhost:8888/rejectFriendRequest/${connect_id}`,
          config
        );
        return response.data;
      };
      let data = await goGetRequests();
    }

    setUsers((users) => {
      let newUsers = users.filter((user) => user._id !== id);
      return newUsers;
    });
  };

  const handleSendRequest = async () => {
    async function sendFriendRequest(token) {
      let config = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      // use axios to get top tracks
      let response = await axios.get(
        `http://localhost:8888/sendFriendRequest/${userId}/${id}`,
        config
      );
      return response.data;
    }

    await sendFriendRequest(token);

    setUsers((users) => {
      let newUsers = users.filter((user) => user._id !== id);
      return newUsers;
    });
  };
  const handleAcceptRequest = async () => {
    async function sendAcceptRequest() {
      let config = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      // use axios to get top tracks
      let response = await axios.get(
        `http://localhost:8888/acceptFriendRequest/${connect_id}`,
        config
      );
      return response.data;
    }

    await sendAcceptRequest();

    setData((users) => {
      let newUsers = users.filter((user) => user.sender_id !== sender_id);
      return newUsers;
    });
  };

 
  const handleThumsUpClick=async (e)=>{
      if(tab==="review"){
        await handleAcceptRequest()
      }else{
        await handleSendRequest()
      }
  }

  return (
    <div className="flex gap-32 md:gap-44 absolute -bottom-5 left-[50%] -translate-x-[50%]">
      <button onClick={handleClose}>
        <AiOutlineClose className="text-white hover:text-cross-red bg-black text-4xl p-1 rounded-full" />
      </button>
      <button onClick={handleThumsUpClick} >
        <BiSolidLike className="text-white hover:text-like-blue bg-black text-4xl p-1 rounded-full" />
      </button>
    </div>
  );
}
function EditButton() {
  return (
    <div className="flex gap-32 md:gap-44 absolute -bottom-4 right-5">
      <Link to="/edit-profile">
        <BiSolidPencil className="text-white hover:text-nav-yellow bg-black text-3xl p-1 rounded-full" />
      </Link>
    </div>
  );
}

function ChatButton() {
  return (
    <div className="flex gap-32 md:gap-44 absolute -bottom-5 right-5">
      <Link to="/chat">
        <BsFillChatRightFill className="text-white hover:text-nav-yellow bg-black text-4xl p-2 rounded-lg" />
      </Link>
    </div>
  );
}

function ProfileCard({ tab = "userProfile", setData,data, setUsers, id, userId }) {
  let socials = false,
    reactions = false,
    editButton = false,
    chatButton=false,
    cardBg = "bg-card-yellow",
    cardPb = "pb-7";
  if (tab === "userProfile") {
    socials = true;
    editButton = true;
    cardBg = "bg-gradient-to-r from-card-grad-l to-card-grad-r";
  } else if (tab === "search" || tab === "review") {
    reactions = true;
  } else if (tab === "connect") {
    socials = true;
    chatButton=true
    cardPb = "pb-2";
  }
  console.log("data",data);  
  return (
    <div
      className={`flex flex-wrap  gap-2 p-2 w-[90vw] sm:max-w-[38rem] mb-6 ${cardPb} ${cardBg} border-4 border-black rounded-xl relative`}
    >
      <div className="flex justify-center items-center w-full sm:w-fit ">
        <img
          alt="profile pic"
          src={data?.pic || "/src/assets/avatar (1).png"}
          className="w-28 h-28 border-4 border-black rounded-full"
        />
      </div>
      <div className="flex flex-col  w-full sm:w-[29rem] items-center sm:items-start gap-2">
        <h1 className="font-bold">
          {data?.name} {data?.score ? <>| {data?.score}</> : null}
        </h1>
        <p
          className="w-full bg-white p-1 rounded-lg "
          style={{ minHeight: "30px" }}
        >
          {data?.bio}
        </p>
        {socials === true && (
          <Socials
            insta={data?.socials?.instagram}
            twitter={data?.socials?.twitter}
          />
        )}
      </div>
      {reactions === true && (
        <Reactions
          tab={tab}
          sender_id={data?.sender_id}
          setData={setData}
          setUsers={setUsers}
          id={id}
          userId={userId}
          connect_id={data?.connect_id}
        />
      )}
      {editButton === true && <EditButton />}
      {chatButton === true && <ChatButton />}
    </div>
  );
}

export default ProfileCard;
