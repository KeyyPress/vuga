// import Feed from "./feed/Feed";
import NewPostForm from "./feed/NewPostForm";

const HomePage = () => {
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-7xl h-[calc(100vh-8rem]">
          <div className="h-full rounded-lg overflow-hidden">
            <NewPostForm />
            {/* <Feed /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
