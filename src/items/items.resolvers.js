import client from '../client';


export default {
    Item: {
        user: ({ userId }) => client.user.findUnique({
            where: {
                id: userId
            }
        }),
        itemPhotos: ({ id }) => client.item.findUnique({
            where: { id }
        }).itemPhotos(),
        isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id
    },
    ItemPhoto: {
        item: ({ itemId }) => client.item.findUnique({
            where: {
                id: itemId
            }
        }),
        user: ({ userId }) => client.user.findUnique({
            where: {
                id: userId
            }
        })
    }

}