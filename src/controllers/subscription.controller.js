import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  //If the user Subscribed or not
  const isSubscribed = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });
  //   console.log(isSubscribed);
  //if already subscribed
  if (isSubscribed) {
    await Subscription.findByIdAndDelete(isSubscribed?._id);

    return res
      .status(200)
      .json(new ApiResponse(200, { subscribed: false }, "Unsubscribed"));
  }

  //if not subscribed
  await Subscription.create({
    subscriber: req.user?._id,
    channel: channelId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { subscribed: true }, "Subscribed"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
