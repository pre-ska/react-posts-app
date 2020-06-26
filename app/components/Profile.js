import React, { useState, useEffect, useContext } from "react";

import Page from "./Page";
import { useParams } from "react-router-dom";
import Axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import { useImmer } from "use-immer";

const Profile = () => {
  const appState = useContext(StateContext);

  const { username } = useParams();

  const [state, setState] = useImmer({
    followActionLoading: false,
    startFoloowingrequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFolloving: false,
      counts: {
        followerCount: 0,
        followingCount: 0,
        postCount: 0
      }
    }
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    const getUser = async () => {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token
          },
          {
            canceltoken: ourRequest.token
          }
        );

        setState(draft => {
          draft.profileData = response.data;
        });
      } catch (error) {
        console.log(error.response.data);
      }
    };

    getUser();

    return () => ourRequest.cancel();
  }, []);

  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
        {state.profileData.profileUsername}
        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              // onClick={startFollowing}
              // disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2">
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePosts />
    </Page>
  );
};

export default Profile;
