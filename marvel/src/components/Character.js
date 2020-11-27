import React, { useState, useEffect } from "react";
import md5 from "md5";

export default function Character() {
  const [characters, setCharacter] = useState(null);

  let content = "Cargando ...";

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("characters") === null) {
        setCharacter("Loading...");
      } else {
        setCharacter(JSON.parse(localStorage.getItem("characters")));
      }
    } else {
      let url = new URL("https://gateway.marvel.com/v1/public/characters");
      const ts = "welcome";
      const privada = "982cac68fa386b68b041167129d0d3f7c7a94d95";
      const publica = "e6922c73089c7398de76e7c759ab7fc7";

      const hash = md5(ts + privada + publica);

      const params = new URLSearchParams({
        ts: ts,
        hash: hash,
        apikey: publica,
      });

      url.search = params;

      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          setCharacter(res.data.results);
          localStorage.setItem("characters", JSON.stringify(res.data.results));
        });
    }
  }, []);

  if (characters) {
    content = characters.map((character, index) => (
      <div key={index} className="polaroid">
        <img
          src={character.thumbnail.path + "." + character.thumbnail.extension}
          alt={character.name}
        />
        <p>{character.name}</p>
      </div>
    ));
  }

  return (
    <main>
      <h1>Marvel characters</h1>
      <div className="wrapper">{content}</div>
    </main>
  );
}
