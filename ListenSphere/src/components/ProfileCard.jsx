import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidPencil } from "react-icons/bi";
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

function Reactions({setUsers,id,userId}) {
  const {token}=useContext(AuthContext);
  const handleClose=()=>{
    setUsers((users)=>{
      let newUsers=users.filter(user=>user._id!==id);
      return newUsers; 
    })
  }
  const handleSendRequest=async ()=>{
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

    setUsers((users)=>{
      let newUsers=users.filter(user=>user._id!==id);
      return newUsers; 
    })
  }
  return (
    <div className="flex gap-32 md:gap-44 absolute -bottom-5 left-[50%] -translate-x-[50%]">
      <button onClick={handleClose} >
        <AiOutlineClose className="text-white hover:text-cross-red bg-black text-4xl p-1 rounded-full" />
      </button>
      <button onClick={handleSendRequest}>
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

function ProfileCard({ tab = "userProfile", data ,setUsers,id,userId}) {

  let socials = false,
    reactions = false,
    editButton = false,
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
    cardPb = "pb-2";
  }
  
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
        <p className="w-full bg-white p-1 rounded-lg " style={{minHeight:"30px"}}>{data?.bio}</p>
        {socials === true && (
          <Socials
            insta={data?.socials?.instagram}
            twitter={data?.socials?.twitter}
          />
        )}
      </div>
      {reactions === true && <Reactions setUsers={setUsers} id={id} userId={userId}/>}
      {editButton === true && <EditButton />}
    </div>
  );
}



export default ProfileCard;
