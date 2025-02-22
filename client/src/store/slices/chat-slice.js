/*  Veränderungsdatum: 08.03.2025 
    Diese Datei enthält einen Zustandsspeicher für Chats mithilfe von Zustand, einer Bibliothek für das State-Management in React.
*/

export const createChatSlice = (set, get) => ({
    //Diese Werte speichern den aktuellen Zustand der Chat-Funktionalität.
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessagesContacts: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],
    //Diese Funktionen aktualisieren verschiedene Teile des States, wenn sich Daten ändern.
    setChannels: (channels) => set({ channels }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadloadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),

    //Fügt einen neuen Channel an den Anfang der Channel-Liste hinzu.
    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels] })
    },

    //Setzt den aktuellen Chat auf “leer”, sodass kein Chat aktiv ist.
    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: [], }),

    //Fügt eine neue Nachricht in den Chat ein und passt die sender und empfänger IDs an, je nachdem, ob es sich um einen Channel oder eine DM handelt.
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMessages: [
                ...selectedChatMessages, {
                    ...message,
                    recipient: selectedChatType === "channel" ? message.recipient : message.recipient._id,
                    sender: selectedChatType === "channel" ? message.sender : message.sender._id,
                }
            ]
        })
    },
    //Sorgt dafür, dass der Channel, in dem gerade eine Nachricht geschrieben wurde, an den Anfang der Channel-Liste rückt.
    addChannelInChannelList: (message) => {

        const channels = get().channels;
        const data = channels.find((channel) => channel._id === message.channelId);
        const index = channels.findIndex(
            (channel) => channel._id === message.channelId
        );
        console.log(channels, data, index);
        if (index !== -1 && index !== undefined) {
            channels.splice(index, 1);
            channels.unshift(data);
        }
    }
});
