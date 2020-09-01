const utilsHelper = require("../helpers/utils.helper")
const Friendship = require("../models/friendship")
const friendsController = {}

friendsController.sendFriendRequest = async (req, res, next) => {
    try {
      const userId = req.userId; // From
      const toUserId = req.params.id; // To
      let friendship = await Friendship.findOne({ from: userId, to: toUserId });
      if (!friendship) {
        await Friendship.create({
          from: userId,
          to: toUserId,
          status: "requesting",
        });
        return utilsHelper.sendResponse(
          res,
          200,
          true,
          null,
          null,
          "Request has ben sent"
        );
      } else {
        switch (friendship.status) {
          case "requesting":
            return next(new Error("The request has been sent"));
            break;
          case "accepted":
            return next(new Error("Users are already friend"));
            break;
          case "accepted":
          case "decline":
          case "cancel":
            friendship.status = "requesting";
            await friendship.save();
            return utilsHelper.sendResponse(
              res,
              200,
              true,
              null,
              null,
              "Request has ben sent"
            );
            break;
          default:
            break;
        }
      }
    } catch (error) {
      next(error);
    }
  };


friendsController.acceptFriendRequest = async (req, res, next) => {
    try {
      const userId = req.userId; // To
      const fromUserId = req.params.id; // From
      let friendship = await Friendship.findOne({
        from: fromUserId,
        to: userId,
        status: "requesting",
      });
      if (!friendship) return next(new Error("Friend Request not found"));
  
      friendship.status = "accepted";
      await friendship.save();
      return utilsHelper.sendResponse(
        res,
        200,
        true,
        null,
        null,
        "Friend request has been accepted"
      );
    } catch (error) {
      next(error);
    }
  };
  
  friendsController.declineFriendRequest = async (req, res, next) => {
    try {
      const userId = req.userId; // To
      const fromUserId = req.params.id; // From
      let friendship = await Friendship.findOne({
        from: fromUserId,
        to: userId,
        status: "requesting",
      });
      if (!friendship) return next(new Error("Request not found"));
  
      friendship.status = "decline";
      await friendship.save();
      return utilsHelper.sendResponse(
        res,
        200,
        true,
        null,
        null,
        "Friend request has been declined"
      );
    } catch (error) {
      next(error);
    }
  };
  
  friendsController.getSentFriendRequestList = async (req, res, next) => {
    try {
      const userId = req.userId;
      const requestList = await Friendship.find({
        from: userId,
        status: "requesting",
      }).populate("to");
      return utilsHelper.sendResponse(res, 200, true, requestList, null, null);
    } catch (error) {
      next(error);
    }
  };
  
  friendsController.getReceivedFriendRequestList = async (req, res, next) => {
    try {
      const userId = req.userId;
      const requestList = await Friendship.find({
        to: userId,
        status: "requesting",
      }).populate("from");
      return utilsHelper.sendResponse(res, 200, true, requestList, null, null);
    } catch (error) {
      next(error);
    }
  };
  
  friendsController.getFriendList = async (req, res, next) => {
    try {
      const userId = req.userId;
      let friendList = await Friendship.find({
        $or: [{ from: userId }, { to: userId }],
        status: "accepted",
      })
        .populate("from")
        .populate("to");
      friendList = friendList.map((friendship) => {
        const friend = {};
        friend.acceptedAt = friendship.updatedAt;
        if (friendship.from._id.equals(userId)) {
          friend.user = friendship.to;
        } else {
          friend.user = friendship.from;
        }
        return friend;
      });
      return utilsHelper.sendResponse(res, 200, true, friendList, null, null);
    } catch (error) {
      next(error);
    }
  };
  
  friendsController.cancelFriendRequest = async (req, res, next) => {
    try {
      const userId = req.userId; // From
      const toUserId = req.params.id; // To
      let friendship = await Friendship.findOne({
        from: userId,
        to: toUserId,
        status: "requesting",
      });
      if (!friendship) return next(new Error("Request not found"));
  
      friendship.status = "cancel";
      await friendship.save();
      return utilsHelper.sendResponse(
        res,
        200,
        true,
        null,
        null,
        "Friend request has been cancelled"
      );
    } catch (error) {
      next(error);
    }
  };
  
  friendsController.removeFriendship = async (req, res, next) => {
    try {
      const userId = req.userId;
      const toBeRemovedUserId = req.params.id;
      let friendship = await Friendship.findOne({
        $or: [
          { from: userId, to: toBeRemovedUserId },
          { from: toBeRemovedUserId, to: userId },
        ],
        status: "accepted",
      });
      if (!friendship) return next(new Error("Friend not found"));
  
      friendship.status = "removed";
      await friendship.save();
      return utilsHelper.sendResponse(
        res,
        200,
        true,
        null,
        null,
        "Friendship has been removed"
      );
    } catch (error) {
      next(error);
    }
  };


module.exports = friendsController