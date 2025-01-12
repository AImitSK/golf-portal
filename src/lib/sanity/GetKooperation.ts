//import { client } from './client';
import sanityClient from '@/lib/sanityClient';

export async function getKooperation() {
    const clubs = await sanityClient.fetch(`*[_type == "kooperation"]{
        _type,
        beschreibung,
        logo{
          _type,
          asset{
            _ref,
            _type
          }
        },
        name,
        typ
    }`);

    return clubs;
}