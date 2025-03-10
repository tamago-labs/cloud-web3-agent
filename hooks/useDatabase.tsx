import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"

const client = generateClient<Schema>();

const useDatabase = () => {

    const getProfile = async (userId: string) => {

        const user = await client.models.User.list({
            filter: {
                username: {
                    eq: userId
                }
            }
        })

        if (user.data.length === 0) {
            const newUser = {
                username: userId
            }
            await client.models.User.create({
                ...newUser
            })
            return newUser
        } else {
            return user.data[0]
        }
    }

    return {
        getProfile
    }
}

export default useDatabase