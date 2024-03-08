"use client";
import CallAgora from "@/components/agora/CallAgora";
import { RootState, useSelector } from "@/redux/store";

const ChannelPage = ({ params }: { params: { channel: string } }) => {
  // ignore this line
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <div className="flex items-center justify-center pt-5">
        <h1 className="text-primary-500 text-xl font-bold">
          Reunión: {params.channel}
        </h1>
        <p>
          {user?.full_name} - {user?.email}
        </p>
      </div>

      <CallAgora
        channelName={params.channel}
        appId={
          process.env.PUBLIC_AGORA_APP_ID?.toString() ||
          "8d0e6c0588194991af086560049f5bea"
        }
      />
    </div>
  );
};

export default ChannelPage;
