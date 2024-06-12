import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import "./App.css";

function App() {
  const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(0);
  const [textTop, setTextTop] = useState("");
  const [textBottom, setTextBottom] = useState("");
  const [uploadedPic, setUploadedPic] = useState(null);

  const url = "https://api.imgflip.com/get_memes";

  useEffect(() => {
    const fetchMemes = async () => {
      const res = await fetch(url);
      const data = await res.json();
      setMemes(data.data.memes);
    };

    fetchMemes();
  }, []);

  // console.log(memes);

  const prevMeme = () => {
    setCurrentMeme((index) => {
      if (index === 0) {
        return memes.length - 1;
      } else {
        return index - 1;
      }
    });
    reset();
  };

  const nextMeme = () => {
    setCurrentMeme((index) => {
      if (index === memes.length - 1) {
        return 0;
      } else {
        return index + 1;
      }
    });
    reset();
  };

  const randomMeme = () => {
    setCurrentMeme(Math.floor(Math.random() * memes.length));
  };

  const reset = () => {
    setTextTop("");
    setTextBottom("");
    setUploadedPic(null);
  };

  const saveMeme = () => {
    domtoimage.toBlob(document.getElementById("my-meme")).then(function (blob) {
      saveAs(blob, "my-meme.png");
    });
  };

  return (
    <div className="App">
      <h1>Meme generator</h1>
      <div className="container">
        {uploadedPic ? (
          <div id="my-meme">
            <img
              src={URL.createObjectURL(uploadedPic)}
              alt="Uploaded Picture"
            />
          </div>
        ) : (
          <div id="my-meme">
            <h3>{memes[currentMeme]?.name}</h3>
            <img
              src={memes[currentMeme]?.url}
              alt={memes[currentMeme]?.name}
              className="image"
            />
            <h3 className="text-top">{textTop}</h3>
            <h3 className="text-bottom">{textBottom}</h3>
          </div>
        )}
      </div>
      <button onClick={prevMeme} disabled={currentMeme === 0}>
        Prev
      </button>
      <button onClick={nextMeme} disabled={currentMeme === memes.length - 1}>
        Next
      </button>
      <button onClick={randomMeme}>Random</button>
      <br />
      <input
        type="text"
        placeholder="Text Top "
        value={textTop}
        onChange={(e) => setTextTop(e.target.value)}
        disabled={uploadedPic}
      />
      <input
        type="text"
        placeholder="Text Bottom"
        value={textBottom}
        onChange={(e) => setTextBottom(e.target.value)}
        disabled={uploadedPic}
      />
      <button onClick={reset}>Reset</button>
      <br />
      <button onClick={saveMeme}>Save</button>
      <input type="file" onChange={(e) => setUploadedPic(e.target.files[0])} />
    </div>
  );
}

export default App;
