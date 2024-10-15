export default function name({ show, setCurrentShow }) {
  return (
    <>
      <div
        key={show.id}
        className={`block p-1 shadow-lg hover:scale-105 transisiton duration-300 bg-black text-white ${
          show.user && show.user.archived && "opacity-75"
        }`}
        onClick={() => setCurrentShow(show.id)}
      >
        <img
          src={
            show.images.poster ??
            "https://image.shutterstock.com/image-illustration/picture-icon-no-image-symbol-260nw-1572613234.jpg"
          }
          alt=""
        />
        <p className="p-1 text-lg text-center">{show.title}</p>
      </div>
    </>
  );
}
