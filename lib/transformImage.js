// Shapes a Prisma `Image` (with the includes below) into the same plain
// object shape the UI components (`ImageGrid`, `Modal`, `Tags`,
// `ImageMetaData`) already expect from the old Firestore documents, so
// ticket #5 only has to change where the data comes from, not every
// consumer's field names.
//
// Expected Prisma query shape:
//   prisma.image.findMany({
//     include: imageInclude,
//     ...
//   })
export const imageInclude = {
    user: { select: { username: true, image: true } },
    tags: { select: { name: true } },
    exif: true,
    likes: { select: { userId: true } },
    comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { username: true, image: true } } },
    },
};

export function transformImage(image) {
    return {
        id: image.id,
        url: image.url,
        caption: image.caption,
        exif: image.exif
            ? {
                  make: image.exif.make,
                  model: image.exif.model,
                  iso: image.exif.iso,
                  focalLength: image.exif.focalLength,
                  aperture: image.exif.aperture,
                  exposure: image.exif.exposure,
                  flash: image.exif.flash,
                  cameraFunction: image.exif.cameraFunction,
                  dateCaptured: image.exif.dateCaptured
                      ? image.exif.dateCaptured.toISOString()
                      : null,
              }
            : null,
        tags: image.tags.map((t) => t.name),
        userData: {
            username: image.user.username,
            photoURL: image.user.image,
        },
        createdAt: image.createdAt.toISOString(),
        comments: image.comments.map((c) => ({
            comment: c.body,
            user: {
                username: c.user.username,
                photoURL: c.user.image,
            },
        })),
        likes: image.likes.map((l) => l.userId),
    };
}
