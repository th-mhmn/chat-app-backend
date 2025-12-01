export const transformMediaUrl = (obj) =>
  `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj?.resource_type}/upload/v${obj?.version}/${obj?.display_name}`;
