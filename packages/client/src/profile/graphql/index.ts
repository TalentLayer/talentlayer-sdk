import { Hash } from "viem";

export const getProfileByAddress = (address: Hash) => (
    `
      {
        users(where: {address: "${address.toLocaleLowerCase()}"}, first: 1) {
          id
          address
          handle
          rating
          delegates
          userStats {
            numReceivedReviews
          }
          updatedAt
          createdAt
          description {
            about
            role
            name
            country
            headline
            id
            image_url
            video_url
            title
            timezone
            skills_raw
          }
        }
      }
      `
)