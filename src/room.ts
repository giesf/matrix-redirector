import { MatrixClient, Preset } from "matrix-js-sdk";

export async function findRoomWithUser(matrixClient: MatrixClient, userId: string) {

    const rooms = await matrixClient.getJoinedRooms()

    for (const roomId of rooms.joined_rooms) {
        const members = Object.keys((await matrixClient.getJoinedRoomMembers(roomId)).joined)
        const isOneOnOneConversation = members.length == 2;
        const isMember = members.includes(userId)
        console.log({ roomId, members, isMember, isOneOnOneConversation })

        if (isMember && isOneOnOneConversation) return roomId;
    }

    const newRoom = await matrixClient.createRoom({
        invite: [userId],
        is_direct: true,
        preset: Preset.TrustedPrivateChat,
    })

    return newRoom.room_id

}