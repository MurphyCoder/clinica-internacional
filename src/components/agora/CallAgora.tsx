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
  MdOutlineMicNone,
  MdOutlineMicOff,
  MdOutlineVideocam,
  MdOutlineVideocamOff,
  MdOutlinePersonOff,
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
  // seleccionar el video que queremos en la pantalla grande
  const [selectedUidVideo, setSelectedUidVideo] = useState(0);

  // asignamos el primer usuario que se conecte como el usuario seleccionado
  useEffect(() => {
    if (remoteUsers.length > 0) {
      setSelectedUidVideo(remoteUsers[0].uid as number);
    } else {
      setSelectedUidVideo(0);
    }
  }, [remoteUsers]);

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

  const isActiveRemoteVideo = remoteUsers.find(
    (user) => user.uid === selectedUidVideo,
  )?.hasVideo;
  const isActiveRemoteAudio = remoteUsers.find(
    (user) => user.uid === selectedUidVideo,
  )?.hasAudio;

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
          {/* Aca debo de mostrar el video del usuario seleccionado en pantalla grande y reemplazarlo cuando se comparte pantalla */}
          <div className="h-full w-full rounded-lg border-2 shadow-md">
            <RemoteUser
              user={
                remoteUsers.find((user) => user.uid === selectedUidVideo) ||
                remoteUsers[0]
              }
              key={
                remoteUsers.find((user) => user.uid === selectedUidVideo)
                  ?.uid || remoteUsers[0]?.uid
              }
              className="h-full w-full rounded-lg border-2 shadow-md"
            />

            {!isActiveRemoteVideo && (
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-gray-800 bg-opacity-50">
                <MdOutlineVideocamOff className="text-4xl text-white" />
              </div>
            )}
          </div>

          {/* Parte inferior izquierda nombre remoto usuario */}
          <div className="absolute bottom-0 left-0 m-4 flex items-center rounded-full bg-gray-800 bg-opacity-50 p-2 shadow-sm">
            {isActiveRemoteAudio ? (
              <MdOutlineMicNone className="mx-1 text-sm text-red-500" />
            ) : (
              <MdOutlineMicOff className="mx-1 text-sm text-white" />
            )}

            <span className="relative mr-2 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            <p className="text-[10px] text-white">
              User {selectedUidVideo || 0}
            </p>
          </div>

          <div
            className={`absolute bottom-0 right-0 rounded-xl border-4 shadow-md transition-all duration-500 ${remoteUsers.length === 0 ? "flex h-full w-full p-0" : "m-4 h-36 w-36"}`}
          >
            {!isMuteVideo ? (
              <div className={`container h-full w-full rounded-xl`}>
                <LocalVideoTrack track={localCameraTrack} play={true} />
              </div>
            ) : (
              <div className="container flex h-full w-full items-center justify-center rounded-xl bg-gray-800 bg-opacity-50">
                <MdOutlinePersonOff className="text-4xl text-white" />
              </div>
            )}

            <div className="absolute bottom-0 right-0  ">
              <div className="mb-4 mr-2 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-50 px-2 py-1">
                <div>
                  {isMuteAudio ? (
                    <MdOutlineMicOff className="mx-1 text-sm text-white" />
                  ) : (
                    <MdOutlineMicNone className="mx-1 text-sm text-red-500" />
                  )}
                </div>
                <div className="flex flex-row items-center">
                  <span className="relative mr-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <p className="text-[10px] text-white">You</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Si tengo mas de 2 usuarios colocarlos en una grilla y que se ordene en un cuadrado con bordes blancos separados y sus nombres de usuario */}
        {remoteUsers.length > 1 && (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-cyan-500 to-gray-500 py-4 shadow-md">
            <div className="grid grid-cols-3 gap-4">
              {/* filtraremos  que  el usuario seleccionado no se muestre en la grilla  */}
              {remoteUsers
                .filter((user) => user.uid !== selectedUidVideo)
                .map((user) => (
                  <div
                    key={user.uid}
                    className="relative h-36 w-36 rounded-xl border-4 shadow-md"
                    onClick={() => setSelectedUidVideo(user.uid as number)}
                  >
                    <RemoteUser
                      user={user}
                      key={user.uid}
                      className="h-full w-full rounded-xl"
                    />
                    <div className="absolute bottom-0 right-0 flex items-center rounded-full bg-gray-800 bg-opacity-50 p-2">
                      <span className="relative mr-2 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      </span>
                      <p className="text-[10px] text-white">{user.uid}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Botones de control */}

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
