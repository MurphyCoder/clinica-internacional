import Call from "@/components/agora/CallAgora";

const ChannelPage = ({ params }: { params: { channel: string } }) => {
  return (
    <div>
      ChannelPag: {params.channel} {process.env.PUBLIC_AGORA_APP_ID}
      <Call
        channelName={params.channel}
        appId={process.env.PUBLIC_AGORA_APP_ID || ""}
      />
    </div>
  );
};

export default ChannelPage;
