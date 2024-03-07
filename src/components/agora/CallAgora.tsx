"use client";
import { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useLocalScreenTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
  useTrackEvent,
} from "agora-rtc-react";

import {
  MdScreenShare,
  MdStopScreenShare,
  MdCallEnd,
  MdCamera,
  MdOutlineMicNone,
  MdOutlineMicOff,
  MdOutlineVideocam,
  MdOutlineVideocamOff,
} from "react-icons/md";
import { Container } from "../shared/Container";
import { ShareScreenComponent } from "./SharedScreen";
import Link from "next/link";
import Image from "next/image";

function CallAgora(props: { appId: string; channelName: string }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }),
  );
  // const devices = AgoraRTC.getDevices();
  // console.log("devices", devices);

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
    </AgoraRTCProvider>
  );
}

function Videos(props: { channelName: string; AppID: string }) {
  const { AppID, channelName } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const [isMuteVideo, setMuteVideo] = useState(false);
  const [isMuteAudio, setMuteAudio] = useState(false);
  const [isSharingEnabled, setScreenSharing] = useState(false); // sirve para compartir pantalla local

  const handleToggleScreenSharing = () => {
    setScreenSharing((previous) => !previous);
  };

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
  });

  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );

  remoteUsers.length > 0 && console.log("remoteUsers", remoteUsers);

  const numUsers = remoteUsers.length + 1;
  let numCols = 1;
  let numRows = 1;
  switch (numUsers) {
    case 1:
      numCols = 1;
      numRows = 1;
      break;
    case 2:
      numCols = 2;
      numRows = 1;
      break;
    case 3:
      numCols = 3;
      numRows = 1;
      break;
    case 4:
      numCols = 2;
      numRows = 2;
      break;
    default:
      break;
  }

  const toggleMuteVideo = () => {
    localCameraTrack
      ?.setEnabled(isMuteVideo)
      .then(() => setMuteVideo((prev) => !prev))
      .catch((error) => console.error(error));
  };

  const toggleMuteAudio = () => {
    localMicrophoneTrack
      ?.setEnabled(isMuteAudio)
      .then(() => {
        setMuteAudio((prev) => !prev);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="h-screen bg-white">
      {isSharingEnabled && (
        <ShareScreenComponent
          setScreenSharing={setScreenSharing}
          channelName={channelName}
          AppID={AppID}
          isSharingEnabled={isSharingEnabled}
        />
      )}

      <Container className="py-4">
        <div className="relative my-10 flex h-[70vh] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-cyan-500 to-gray-500 p-1">
          {remoteUsers.length > 1 ? (
            <div className="h-full w-full rounded-lg border-2 shadow-md">
              <RemoteUser
                user={remoteUsers[1]}
                key={remoteUsers[1]?.uid}
                className="h-full w-full rounded-lg border-2 shadow-md"
              />
            </div>
          ) : (
            <RemoteUser
              user={remoteUsers[0]}
              key={remoteUsers[0]?.uid}
              className="h-full w-full rounded-lg shadow-md"
            />
          )}
          {/* Parte inferior izquierda nombre remoto usuario */}
          <div className="absolute bottom-0 left-0 m-4 flex items-center rounded-full bg-gray-800 bg-opacity-50 p-2 shadow-sm">
            <span className="relative mr-2 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            <p className="text-[10px] text-white">Remote</p>
          </div>

          {/* parte inferior derecha el usuario local */}
          <div className="gradient-border absolute bottom-0  right-0 m-4  h-36 w-36 rounded-xl border-4 shadow-md">
            <div className={`container h-full w-full rounded-xl`}>
              <LocalVideoTrack
                track={localCameraTrack}
                play={true}
                className="aspect-w-16 aspect-h-9 aspect-video h-full w-full rounded-xl object-cover shadow-md"
              />

              <div className="absolute bottom-0 right-0 flex items-center rounded-full bg-gray-800 bg-opacity-50 p-2">
                <span className="relative mr-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-[10px] text-white">You</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between space-x-4 pb-4">
          <Image
            src="/assets/logo.png"
            alt="Agora Logo"
            width={140}
            height={40}
            className="justify-start"
          />
          <div className="flex flex-row items-center justify-center space-x-4">
            <button
              onClick={toggleMuteVideo}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-500 text-2xl text-white hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              {isMuteVideo ? <MdOutlineVideocamOff /> : <MdOutlineVideocam />}
            </button>

            <button
              onClick={toggleMuteAudio}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-500 text-2xl text-white hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              {isMuteAudio ? <MdOutlineMicOff /> : <MdOutlineMicNone />}
            </button>

            <button
              onClick={handleToggleScreenSharing}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-500 text-2xl text-white hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              {isSharingEnabled ? <MdStopScreenShare /> : <MdScreenShare />}
            </button>

            <Link
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-400 text-2xl text-white hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
              href="/"
            >
              <MdCallEnd />
            </Link>
          </div>
          <div className=" flex-grow-0"></div>
        </div>
      </Container>
    </div>
  );
}

export default CallAgora;
