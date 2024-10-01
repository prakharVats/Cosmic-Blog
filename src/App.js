import { createContext, useContext, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}


const PostContext = createContext();


function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isFakeDark, setIsFakeDark] = useState(false);

  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );

    // context API
    const ContextValue = {
      posts : searchedPosts ,
      onClearPosts : handleClearPosts ,
      searchQuery : searchQuery ,
      setSearchQuery : setSearchQuery ,
      onAddPost : handleAddPost
    }
  return (
    <PostContext.Provider value={ContextValue}>
      <section>
      <button onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)} className="btn-fake-dark-mode">
        {isFakeDark ? "☀️" : "🌙"}
      </button>
      <Header/>
      <Main />
      <Archive/>
      <Footer />
      </section>
    </PostContext.Provider>
   
  );
}

function Header() {
  const x = useContext(PostContext)
  console.log(x);
  return (
    <header>
      <h1>
        <span>⚛️</span>The Cosmic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts/>
        <button onClick={x.onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const x = useContext(PostContext);
  return (
    <input
      value={x.searchQuery}
      onChange={(e) => x.setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const x = useContext(PostContext)
  return <p>🚀 {x.posts.length} Cosmic posts found</p>;
}

function Main() {
  
  return (
    <main>
      <FormAddPost/>
      <Posts  />
    </main>
  );
}

function Posts() {
 
  return (
    <section>
      <List/>
    </section>
  );
}

function FormAddPost() {
  const x = useContext(PostContext);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    x.onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List() {
  const x = useContext(PostContext);
  return (
    <ul>
      {x.posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Archive() {

  const [posts] = useState(() =>
   
    Array.from({ length: 10000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(false);
  const x = useContext(PostContext);
  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => x.onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by The Cosmic Blog ✌️</footer>;
}

export default App;
