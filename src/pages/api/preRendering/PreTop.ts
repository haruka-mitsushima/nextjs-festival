import prisma from '../../../../lib/prisma';

export default async function prePort(take: number, favoriteId: number) {
    const body = { favoriteId };
    const url = 'http://localhost:3005/api/item/preTop'
    const params = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    };
    const response = await fetch(url, params);
    const data = await response.json();
    return data
}

// export default async function PreTop(take: number, favoriteId: number) {
//     const item = await prisma.item.findMany({
//         orderBy: {
//             itemId: 'desc',
//         },
//         take: take,
//     });

//     const newItems = item.map((item) => ({
//         ...item,
//         releaseDate: item.releaseDate.toString(),
//     }));

//     const response = await prisma.item.findMany({
//         where: {
//             categories: {
//                 has: favoriteId,
//             },
//         },
//         orderBy: {
//             itemId: 'desc',
//         },
//         take: take,
//     });

//     const genreItems = response.map((item) => ({
//         ...item,
//         releaseDate: item.releaseDate.toString(),
//     }));

//     return {
//         newItems: newItems,
//         genreItems: genreItems
//     }
// }
