import React, { useState, useEffect, useContext } from "react";
import {
  useParams,
  NavLink,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import Axios from "axios";
import { useImmer } from "use-immer";

import Page from "./Page";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";
import NotFound from "./NotFound";

const Profile = () => {
  const appState = useContext(StateContext);

  const { username } = useParams();

  const [state, setState] = useImmer({
    render: false,
    followActionLoading: false,
    startFollowingRequestCount: 0,
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

        if (!response.data) {
          console.log("nema tog korisnika");
          setState(draft => {
            draft.profileData = false;
          });
        } else {
          console.log(`profil ${username} pronađen`);
          setState(draft => {
            draft.render = true;
            draft.profileData = response.data;
          });
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    getUser();

    return () => ourRequest.cancel();
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      console.log("proces za start-following");
      setState(draft => {
        draft.followActionLoading = true;
      });

      const ourRequest = Axios.CancelToken.source();

      const getUser = async () => {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token
            },
            {
              canceltoken: ourRequest.token
            }
          );

          setState(draft => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log(error.response.data);
        }
      };

      getUser();

      return () => ourRequest.cancel();
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      console.log("proces za STOP-following");
      setState(draft => {
        draft.followActionLoading = true;
      });

      const ourRequest = Axios.CancelToken.source();

      const getUser = async () => {
        try {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token
            },
            {
              canceltoken: ourRequest.token
            }
          );

          setState(draft => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log(error.response.data);
        }
      };

      getUser();

      return () => ourRequest.cancel();
    }
  }, [state.stopFollowingRequestCount]);

  const startFollowing = () => {
    setState(draft => {
      draft.startFollowingRequestCount++;
    });
  };

  const stopFollowing = () => {
    setState(draft => {
      draft.stopFollowingRequestCount++;
    });
  };

  if (!state.profileData) {
    return (
      <Page title="Cannot find that user">
        <NotFound />
      </Page>
    );
  }

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
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2">
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {appState.loggedIn &&
          state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2">
              Stop following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink
          exact
          to={`/profile/${state.profileData.profileUsername}`}
          className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/followers`}
          className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/following`}
          className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      {state.render && (
        <Switch>
          <Route exact path="/profile/:username">
            <ProfilePosts />
          </Route>
          <Route path="/profile/:username/followers">
            <ProfileFollowers />
          </Route>
          <Route path="/profile/:username/following">
            <ProfileFollowing />
          </Route>
        </Switch>
      )}
    </Page>
  );
};

export default Profile;
