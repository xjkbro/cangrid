import useSWR from "swr";

const getHomeQuery = async (query) => {
    const fetcher = async (query) => {
        return await projectFirestore
            .collection(query)
            .orderBy("createdAt", "desc")
            .get();
    };
    const { data, error } = await useSWR(query, fetcher);

    const images = data.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((img) => {
            return {
                id: img.id,
                caption: img.caption,
                url: img.url,
                exif: img.exif,
                tags: img.tags,
                userData: img.userData,
                createdAt: img.createdAt.toDate().toString(),
                comments: img.comments,
                likes: img.likes,
            };
        });
};
export default getHomeQuery;
