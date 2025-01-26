// src/lib/sanity/getUser.ts
import sanityClient from '@/lib/sanityClient'

export async function getUserById(userId: string) {
    return sanityClient.fetch(`
    *[_type == "user" && _id == $userId][0] {
      _id,
      name,
      email,
      handicapIndex,
      heimatclub->{
        _id,
        name
      }
    }
  `, { userId });
}

