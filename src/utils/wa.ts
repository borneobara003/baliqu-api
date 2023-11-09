interface IPropsSendMessage {
  phone: string;
  message: string;
  whatsapp?: any;
}

export const sendMessage = async (props: IPropsSendMessage) => {
  try {
    const { whatsapp, message, phone } = props;
    // const isConnected = await whatsapp?.waitForConnectionUpdate(
    //   (connection: any) => connection?.connection === "open"
    // );
    if (!whatsapp) {
      throw new Error("Failed to connect to whatsapp");
    }
    whatsapp?.sendMessage(`${phone}@s.whatsapp.net`, {
      text: message,
    });
  } catch {
    throw new Error("Failed to send message");
  }
};
