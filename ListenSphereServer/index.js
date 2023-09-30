import express from "express";
import dotenv from "dotenv";
import appRouter from "./app/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";
import querystring from "querystring";
import request from "request";
import validateSpotifyToken from "./middlewares/authMiddleware.js";
import connectDB from "./config/db.js";
import { User } from "./models/user.js";
import { Song } from "./models/song.js";
import cron from "node-cron";
import { FriendRequest } from "./models/friendRequest.js";

// schedule cron to run every 1 minute

cron.schedule("*/1 * * * *", async () => {
  console.log("running a task every minute");
});

dotenv.config();
connectDB();
const port = 8888;
let app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api", appRouter);
app.use(cors()).use(cookieParser());
let client_id = process.env.CLIENT_ID;
let client_secret = process.env.CLIENT_SECRET;
let redirect_uri = "http://localhost:8888/callback";

let generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

let stateKey = "spotify_auth_state";

app.get("/login", function (req, res) {
  let state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  let scope = "user-read-private user-read-email user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let access_token = body.access_token,
          refresh_token = body.refresh_token;

        let options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        let user_exist = false;
        axios
          .get(options.url, { headers: options.headers })
          .then(async (response) => {
            const body = response.data;
            const user = await User.find({ email: body.email });
            if (user.length > 0) {
              console.log("User already exists");
              user_exist = true;

              // we can also pass the token to the browser to make requests from there
              res.redirect(
                "http://localhost:5173/#" +
                  querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    user_exist: user_exist,
                  })
              );
            } else {
              const newUser = new User({
                name: body.display_name,
                email: body.email,
                socials: {
                  instagram: "",
                  twitter: "",
                },
                bio: "",
              });
              await newUser.save();
              console.log("User created");

              // we can also pass the token to the browser to make requests from there
              res.redirect(
                "http://localhost:5173/#" +
                  querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    user_exist: user_exist,
                  })
              );
            }
          })
          .catch((error) => {
            console.error("Error accessing Spotify Web API:", error);
            res.redirect(
              "http://localhost:5173/#" +
                querystring.stringify({
                  access_token: access_token,
                  refresh_token: refresh_token,
                  user_exist: user_exist,
                  error: "invalid_token",
                })
            );
          });
      } else {
        res.redirect(
          "http://localhost:5173/error" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

app.post("/user", validateSpotifyToken, async function (req, res) {
  try {
    const user = await User.findOne({ email: req.spotifyUser.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, bio, instagram, twitter, pic } = req.body;
    user.name = username;
    user.bio = bio;
    user.socials.instagram = instagram;
    user.socials.twitter = twitter;
    user.pic = pic;
    await user.save();

    return res.json({ message: "User data updated successfully", data: user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user", validateSpotifyToken, async function (req, res) {
  const user = await User.findOne({ email: req.spotifyUser.email });
  res.json({ message: "data", data: user });
});

app.get("/user/topTracks", validateSpotifyToken, function (req, res) {
  const options = {
    url: "https://api.spotify.com/v1/me/top/tracks",
    headers: {
      Authorization:
        "Bearer " + req.header("Authorization").replace("Bearer ", ""),
    },
    json: true,
  };
  axios
    .get(options.url, { headers: options.headers })
    .then(async (response) => {
      const body = response.data;

      let tracks = body.items.map((track) => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          image: track.album.images[0].url,
          preview: track.preview_url,
        };
      });
      const user = await User.findOne({ email: req.spotifyUser.email });
      tracks = tracks.map((track) => {
        return {
          ...track,
          ownedBy: user._id,
        };
      });
      // add tracks to database in song collection
      try {
        const newTracks = await Song.insertMany(tracks);
      } catch (err) {
        console.log(err);
      }

      res.json({ message: "data", data: tracks });
    })
    .catch((error) => {
      res.json({ message: "error", error: error });
    });
});

app.post("/addUsers", async function (req, res) {
  let data = req.body;

  try {
    const newUsers = await User.insertMany(data);
    res.json({ message: "data", data: newUsers });
  } catch (err) {
    res.json({ message: "error", error: err });
  }
});

app.post("/addSongToUser/:id", async function (req, res) {
  let data = req.body;
  let id = req.params.id;
  try {
    // data contains song id fetch data of each song and add to user
    let songDatas= [];
    songDatas = await Promise.all(data.map(async (songId) => {
      let url = `https://api.spotify.com/v1/tracks/${songId}`;
      const options = {
        headers: {
          Authorization:
            "Bearer " + "BQBmV1RYW6yyolcX63ef4efA1gF59U38NpH7Bpf_gn6nQ1zcWSuM-CogsKqCFuOjUbPYcK8Nb5nnMdvWrHrKoji34gbkyWKDoscCmhtfUIcoVl0YjO3nFBhhBR09p-HT8Nix9axvpr8BaTmvVaAK1icSTbOkrCvo6gsxAwD1Th-6kzChALg2MjQISby5OqyjA6k14cCeXNQ8q6_AUIvVPuTK_Z5xUOrWj5cYWOxdnvYc6b47qySxdo0YlonOZzgJCscuSsh6QOLtzpYii7lq9Jz5",
        },
      };
      let songData = await axios.get(url, {headers: options.headers});
      return songData.data;
    }
    ));
    console.log("songDatas",songDatas);
    
    songDatas=songDatas.map((data)=>{
      return {
        id: data.id,
        name: data.name,
        artist: data.artists[0].name,
        image: data.album.images[0].url,
        preview: data.preview_url,
        ownedBy: id
      }
    })

    const newSong = await Song.insertMany(songDatas);
    res.json({ message: "data", data: newSong });
  } catch (err) {
    res.json({ message: "error", error: err });
  }
});




app.get("/getRanking/:id", async function (req, res) {
  let id = req.params.id;
  try {
    let getAllUsers = await User.find();
    getAllUsers = getAllUsers.filter((user) => user._id != id);
    let requestFriends= await FriendRequest.find({senderUserId:id});    
    let requestFriendIds=requestFriends.map((fr)=>{
      return fr.receiverUserId.toString();
    })

    getAllUsers=getAllUsers.map((user)=>{
      return {
        ...user._doc,
        score:Math.floor(Math.random() * 40 ) + 1
      }
    })

    console.log(requestFriendIds);
    getAllUsers=getAllUsers.filter((user)=>{
      console.log(user._id);
      return !requestFriendIds.includes(user._id.toString());
    })
    res.json({ message: "data", data: getAllUsers });
  } catch (err) {
    res.json({ message: "error", error: err });
  }
});



app.get("/sendFriendRequest/:senderId/:receiverId",validateSpotifyToken, async function (req, res) {
  const {senderId,receiverId}=req.params;
  try{  
    const fr = new FriendRequest({
      senderUserId: senderId,
      receiverUserId: receiverId,
      status: 'pending'
    });
    let newFriendRequest=await fr.save();

    console.log("newFriendRequest",newFriendRequest);
    res.json({ message: "data", data: newFriendRequest });
  }catch(err){
    console.log(err);
    res.json({ message: "error", error: err });
  }
});



console.log("Listening on 8888");
app.listen(8888);
