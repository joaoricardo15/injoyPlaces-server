var express = require("express"),
  bodyParser = require("body-parser"),
  geolocation = require("./geolocationMethods"),
  castMethods = require("./castMethods"),
  mongo = require("./mongo"),
  app = express(),
  expressWs = require("express-ws")(app),
  env = { Local: 0, Azure: 1 },
  envMode = env.Azure,
  port;

app.use(express.static("www"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//////////////////////////////////////////////////////////
// http server connection
//////////////////////////////////////////////////////////

process.argv.forEach((val, index, array) => {
  if (val === "local") {
    envMode = env.Local;
  }
});

if (envMode === env.Local) port = 1000;
else port = process.env.PORT;

app.listen(port, function (error) {
  if (!error) console.log("Find server is listen to port: " + port);
  else console.log("error on find server inicialization: " + error);
});

//////////////////////////////////////////////////////////
// http server methods
//////////////////////////////////////////////////////////

app.get("/users", (request, response) => {
  mongo.UserModel.find(function (err, users) {
    if (err) {
      response.send({ message: "Não Éh uz Guri: " + err });
      throw err;
    }

    response.send(users);
  });
});

app.get("/user", (request, response) => {
  mongo.UserModel.find({ user: request.query.user }, function (err, users) {
    if (err) {
      response.send({ message: "Não Éh uz Guri: " + err });
      throw err;
    }

    response.send(users);
  });
});

app.post("/user", (request, response) => {
  let newUserModel = new mongo.UserModel(request.body);
  newUserModel.save((err) => {
    if (err) {
      response.send({ message: "Não Éh uz Guri: " + err });
      throw err;
    }

    response.send({ message: "Éh uz Guri" });
  });
});

app.delete("/user", (request, response) => {
  mongo.UserModel.deleteOne({ user: request.query.user }, function (
    err,
    users
  ) {
    if (err) {
      response.send({ message: "Não Éh uz Guri: " + err });
      throw err;
    }

    mongo.ExperienceModel.deleteMany({ user: request.query.user }, function (
      err,
      users
    ) {
      if (err) {
        response.send({ message: "Não Éh uz Guri: " + err });
        throw err;
      }

      response.send(request.query.user + " deletado com sucesso");
    });
  });
});

app.get("/positions", (request, response) => {
  response.send(geolocation.userPositions);
});

app.post("/positions", (request, response) => {
  for (let i = 0; i < request.body.length; i++) {
    geolocation.addLocation(request.body[i]);
  }
  response.send({ message: "É uz Guri" });
});

app.get("/roles", (request, response) => {
  mongo.RoleModel.find(function (err, roles) {
    if (err) {
      response.send({ message: "Não Éh uz Guri: " + err });
      throw err;
    }

    response.send(roles);
  });
});

app.delete("/role", (request, response) => {
  mongo.RoleModel.deleteOne({ name: request.query.name }, function (err, role) {
    if (err) {
      response.send({ message: "Não Éh uz Guri: " + err });
      throw err;
    }

    response.send(request.query.name + " deletado com sucesso");
  });
});

app.get("/rolesForMe", (request, response) => {
  mongo.RoleModel.find({}, function (err, roles) {
    if (err) {
      response.send({ message: "Não Éh uz Guri: " + err });
      throw err;
    }

    response.send(castMethods.createMyLists(roles));
  });
});

app.get("/rolesAround", (request, response) => {
  let location = JSON.parse(request.query.location);

  let longitudeThreshold =
    geolocation.squaredArea /
    (geolocation.geoLocationConstant * Math.cos(location.lng));

  mongo.RoleModel.find({
    $and: [
      { "location.lat": { $lt: location.lat + geolocation.latitudeThreshold } },
      { "location.lat": { $gt: location.lat - geolocation.latitudeThreshold } },
      { "location.lng": { $lt: location.lng + longitudeThreshold } },
      { "location.lng": { $gt: location.lng - longitudeThreshold } },
    ],
  })
    .sort({ "ratting.rattings": -1 })
    .limit(20)
    .then((roles) => {
      response.send(roles);
    })
    .catch((err) => {
      if (err) {
        response.send({ message: "Não Éh uz Guri: " + err });
        throw err;
      }
    });
});

app.get("/myExperiences", (request, response) => {
  mongo.ExperienceModel.find({ user: request.query.user }, function (
    err,
    experiences
  ) {
    if (err) {
      response.send({ message: "Não Éh uz Guri: " + err });
      throw err;
    }

    response.send(castMethods.createMyExperiences(experiences));
  });
});

app.post("/experience", (request, response) => {
  let newExperience = castMethods.castExperience(request.body);

  // esse trecho de código tem que ser apagado pois contêm uma gambiarra
  let gambi = null;
  if (newExperience.comment && newExperience.comment[0] === "#") {
    gambi = newExperience.comment;
    newExperience.comment = null;
  }
  ///////////////////////////////////////////////////////////////////////

  let newExperienceModel = new mongo.ExperienceModel(newExperience);
  newExperienceModel.save((err) => {
    if (err) {
      response.send({ message: "Não Éh uz Guri: " + err });
      throw err;
    }

    mongo.RoleModel.findOne({ name: newExperience.name }, (err, role) => {
      if (err) {
        response.send({ message: "Não Éh uz Guri: " + err });
        throw err;
      } else if (!role) {
        // se não tiver nenhum rolê com esse nome, cria um novo rolê
        let newRoleModel = new mongo.RoleModel(
          castMethods.castNewRole(newExperience)
        );
        newRoleModel.save((err) => {
          if (err) {
            response.send({ message: "Não Éh uz Guri: " + err });
            throw err;
          }

          // esse trecho de código tem que ser apagado pois contêm uma gambiarra
          if (gambi) addGambi(newExperience.name, gambi);
          ///////////////////////////////////////////////////////////////////////
        });
      } else {
        // se já tiver um rolê com esse nome, atualiza o rolê
        let updates = {
          "location.lat":
            (role.location.lat * role.ratting.rattings +
              newExperience.location.lat) /
            (role.ratting.rattings + 1),
          "location.lng":
            (role.location.lng * role.ratting.rattings +
              newExperience.location.lng) /
            (role.ratting.rattings + 1),
        };

        if (newExperience.ratting) {
          updates["ratting.average"] =
            (role.ratting.average * role.ratting.rattings +
              newExperience.ratting) /
            (role.ratting.rattings + 1);
          updates["ratting.rattings"] = role.ratting.rattings + 1;
        }
        if (newExperience.pic || role.pic !== 0) updates["pic"] = 0;

        mongo.RoleModel.updateMany(
          { name: role.name },
          { $set: updates },
          (err) => {
            if (err) {
              response.send({ message: "Não Éh uz Guri: " + err });
              throw err;
            }
          }
        );

        let lists = {};
        if (newExperience.occasion) lists["occasions"] = newExperience.occasion;
        if (newExperience.tag) lists["tags"] = newExperience.tag;
        if (newExperience.pic) lists["pics"] = newExperience.pic;
        if (newExperience.comment) lists["comments"] = newExperience.comment;
        if (Object.keys(lists).length > 0)
          mongo.RoleModel.updateMany(
            { name: role.name },
            { $push: lists },
            (err) => {
              if (err) {
                response.send({ message: "Não Éh uz Guri: " + err });
                throw err;
              }
            }
          );

        // esse trecho de código tem que ser apagado pois contêm uma gambiarra
        if (gambi) addGambi(role.name, gambi);
        ///////////////////////////////////////////////////////////////////////
      }

      response.send({ message: "Éh uz Guri" });
    });
  });
});

function addGambi(name, gambi) {
  let rawTags = gambi.split(",")[0].split("#");
  for (let i = 0; i < rawTags.length; i++)
    if (rawTags[i] !== "")
      mongo.RoleModel.updateOne(
        { name: name },
        { $push: { tags: rawTags[i] } },
        (err) => {
          if (err) {
            response.send({ message: "Não Éh uz Guri: " + err });
            throw err;
          }
        }
      );

  let rawOccasions = gambi.split(",");
  for (let i = 1; i < rawOccasions.length; i++)
    if (rawOccasions[i] !== "")
      mongo.RoleModel.updateOne(
        { name: name },
        { $push: { occasions: rawOccasions[i] } },
        (err) => {
          if (err) {
            response.send({ message: "Não Éh uz Guri: " + err });
            throw err;
          }
        }
      );
}

var aWss = expressWs.getWss("/");

//////////////////////////////////////////////////////////
// http server methods
//////////////////////////////////////////////////////////

var USERS = [];
var ONLINE_USERS = [];

function updateUsers(userId, userCurrentRoomName, userConnectionId) {
  var myIndex = USERS.findIndex((x) => x.id === userId);

  if (myIndex < 0) {
    USERS.push({
      id: userId,
      userConnectionId,
      friends: [],
    });

    myIndex = USERS.length - 1;
  } else {
    USERS[myIndex].userConnectionId = userConnectionId;
  }

  var myNewFriendsIds = [];

  // if entering in a room
  if (userCurrentRoomName && userCurrentRoomName !== "null") {
    var usersOnRoom = ONLINE_USERS.filter(
      (x) => x.roomName === userCurrentRoomName
    );
    for (let i = 0; i < usersOnRoom.length; i++) {
      // add the user's id in my list

      var indexOnMyFriends = USERS[myIndex].friends.filter(
        (x) => x !== usersOnRoom[i].id
      );
      if (indexOnMyFriends < 0) myNewFriendsIds.push(usersOnRoom[i].id);

      // add my id on the user's list
      var userOnRoomIndex = USERS.findIndex((x) => x.id === usersOnRoom[i].id);
      var myIndexOnUser = USERS[userOnRoomIndex].friends.findIndex(
        (x) => x === userId
      );
      if (myIndexOnUser < 0) USERS[userOnRoomIndex].friends.push(userId);
    }
  }

  USERS[myIndex].friends = USERS[myIndex].friends.concat(myNewFriendsIds);

  return myIndex;
}

function getOnlineRooms(userConnectionId) {
  var rooms = [];
  var myIndex = USERS.findIndex((x) => x.userConnectionId === userConnectionId);
  var onlineUsers = ONLINE_USERS.filter((x) => {
    return (
      x.roomName &&
      x.roomName !== "null" &&
      (myIndex < 0 || USERS[myIndex].friends.findIndex((y) => y === x.id) > -1)
    );
  });

  for (let i = 0; i < onlineUsers.length; i++) {
    if (onlineUsers[i].roomName !== null) {
      var roomIndex = rooms.findIndex(
        (x) => x.roomName === onlineUsers[i].roomName
      );
      if (roomIndex < 0)
        rooms.push({
          roomName: onlineUsers[i].roomName,
          users: [onlineUsers[i].displayName],
        });
      else rooms[roomIndex].users.push(onlineUsers[i].displayName);
    }
  }

  return rooms;
}

app.ws("/user", (ws, req) => {
  const userConnectionId = req.headers["sec-websocket-key"];
  const { id, displayName, roomName } = req.query;
  ONLINE_USERS.push({ id, displayName, roomName, userConnectionId });
  const myIdOnUsers = updateUsers(id, roomName, userConnectionId);

  aWss.clients.forEach((client) => {
    client.send(JSON.stringify(getOnlineRooms(userConnectionId, myIdOnUsers)));
  });

  ws.on("message", (msg) => {
    const userConnectionId = req.headers["sec-websocket-key"];
    const userIndex = ONLINE_USERS.findIndex(
      (x) => x.userConnectionId === userConnectionId
    );
    const updatedUser = JSON.parse(msg);
    ONLINE_USERS[userIndex].roomName = updatedUser.roomName;
    ONLINE_USERS[userIndex].displayName = updatedUser.displayName;
    aWss.clients.forEach((client) => {
      client.send(JSON.stringify(getOnlineRooms(userConnectionId)));
    });
  });

  ws.on("close", () => {
    const userConnectionId = req.headers["sec-websocket-key"];
    ONLINE_USERS = ONLINE_USERS.filter(
      (x) => x.userConnectionId !== userConnectionId
    );
    aWss.clients.forEach((client) => {
      client.send(JSON.stringify(getOnlineRooms(userConnectionId)));
    });
  });
});
