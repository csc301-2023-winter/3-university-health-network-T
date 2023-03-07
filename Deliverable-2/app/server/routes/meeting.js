const express = require('express');
const router = express.Router();

router.use(express.static('public'));

router.get("/:userId", (req, res) => {
    res.render("meetings", { roomId: req.params.userId });
});

router.setupSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on("join-room", (roomId, userId) => {
          socket.join(roomId);
          socket.to(roomId).emit("user-connected", userId);
          socket.on("disconnect", () => {
            socket.to(roomId).emit('user-disconnected', userId);
          });
        });
    });
};

module.exports = router;