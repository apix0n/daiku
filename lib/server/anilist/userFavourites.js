import * as anilistGlobal from "$lib/server/anilist/global"

async function getUserFavouritesData(userId) {
    const query = `
    query User($userId: Int) {
      User(id: $userId) {
        favourites {
          anime {
            edges {
              node {
                coverImage {
                  large
                }
                title {
                  english
                  romaji
                }
                id
              }
              favouriteOrder
            }
          }
          manga {
            edges {
              node {
                coverImage {
                  large
                }
                title {
                  english
                  romaji
                }
                id
              }
              favouriteOrder
            }
          }
          characters {
            edges {
              node {
                image {
                  large
                }
                name {
                  full
                }
                siteUrl
              }
              favouriteOrder
            }
          }
        }
      }
    }`
    return await anilistGlobal.fetchGraphQL(query, { userId: userId });
}

function anilistFavourites(userFavouritesData) {
    const favourites = userFavouritesData.data.User.favourites;
    favourites.anime.edges.forEach(edge => {
        anilistGlobal.applyPosterOverrides(edge.node);
    });
    favourites.manga.edges.forEach(edge => {
        anilistGlobal.applyPosterOverrides(edge.node);
    });

    return [
        {
            type: 'anime',
            favourites: favourites.anime.edges
                .sort((a, b) => a.favouriteOrder - b.favouriteOrder)
                .map(edge => ({
                    cover: edge.node.coverImage.large,
                    name: edge.node.title.english || edge.node.title.romaji,
                    link: anilistGlobal.siteUrl + '/anime/' + edge.node.id
                }))
        },
        {
            type: 'manga',
            favourites: favourites.manga.edges
                .sort((a, b) => a.favouriteOrder - b.favouriteOrder)
                .map(edge => ({
                    cover: edge.node.coverImage.large,
                    name: edge.node.title.english || edge.node.title.romaji,
                    link: anilistGlobal.siteUrl + '/manga/' + edge.node.id
                }))
        },
        {
            type: 'characters',
            favourites: favourites.characters.edges
                .sort((a, b) => a.favouriteOrder - b.favouriteOrder)
                .map(edge => ({
                    cover: edge.node.image.large,
                    name: edge.node.name.full,
                    link: edge.node.siteUrl
                }))
        }
    ];
}

export async function fetchFavouritesData(userId) {
    try {
        const userData = await getUserFavouritesData(userId);
        return {
            updatedAt: new Date().toISOString(),
            favourites: anilistFavourites(userData),
        };
    } catch (error) {
        console.error('Error fetching anime data:', error);
        throw error;
    }
}