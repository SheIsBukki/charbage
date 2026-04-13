export default function Avatar({
  avatarUrl,
  alt,
  defaultSize,
  mdToLgSize,
}: {
  avatarUrl: string;
  alt: string;
  defaultSize: number;
  mdToLgSize: number;
}) {
  return (
    <figure
      className={`size-${defaultSize} rounded-full ring-2 sm:size-${mdToLgSize}`}
    >
      <img
        src={avatarUrl || "/avatar-default-svgrepo-com.svg"}
        alt={alt}
        className="aspect-square size-full overflow-hidden object-cover [clip-path:circle(50%)]"
      />
    </figure>
  );
}
