import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./App.css";

function App() {
  const [list, setList] = useState([]);
  const [sort, setSort] = useState(false);
  const [selected, setSelected] = useState([]);
  const [imageUrl, setImageUrl] = useState(
    "https://s3-ap-southeast-1.amazonaws.com/he-public-data/user14b9a23c.png"
  );

  const readURL = (input) => {
    if (!input[0].name.includes(".jpg" || ".jpeg" || ".png" || ".gif")) {
      console.log("not image");
      return;
    }
    if (input[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(input[0]);
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.onerror = (error) => console.log(error);
    }
  };

  useEffect(() => {
    fetch(
      "https://s3-ap-southeast-1.amazonaws.com/he-public-data/users49b8675.json"
    )
      .then((res) => res.json())
      .then((res) => {
        setList(res);
      });
  }, []);

  return (
    <div className="App">
      <div className="selected-card">
        <div className="img-sec">
          <img src={imageUrl} alt={"name"} />
        </div>
        <div className="details-sec">
          <p>
            <span>Name:</span>
            <input placeholder="Enter name" />
          </p>
          <p>
            <span>Description:</span>
            <textarea placeholder="Enter Description" rows="3" />
          </p>
          <input
            id="file"
            style={{ display: "none" }}
            type="file"
            accept="image/gif, image/jpeg, image/png, image/jpg"
            onChange={(e) => {
              readURL(e.target.files);
            }}
          />
          <button
            className="btn br-4 mr-1"
            onClick={() => {
              document.getElementById("file").click();
            }}
          >
            Upload logo
          </button>
          <button
            className="btn br-4"
            onClick={() => {
              document.getElementById("file").click();
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className="sort-btns">
        <button
          onClick={() => {
            if (!sort) {
              setList(_.sortBy(list, "name"));
              setSort(true);
            } else {
              setList(_.sortBy(list, "name").reverse());
              setSort(false);
            }
          }}
        >
          Sort By Name
        </button>
      </div>
      <div className="card-wrapper">
        {list.map((item, i) => {
          return (
            <div
              className={`card`}
              key={item.id}
              onClick={() => {
                let newSelected = [...selected];
                let idx = newSelected.findIndex((x) => x.id === item.id);
                if (idx !== -1) {
                  newSelected.splice(idx, 1);
                } else {
                  newSelected.push(item);
                }
                console.log(newSelected, i);

                setSelected(newSelected);
              }}
            >
              {selected.find((x) => x.id === item.id) ? (
                <div className="selected">
                  <div />
                </div>
              ) : null}
              <img src={item.Image} alt={item.name} />
              <label>{item.name}</label>
            </div>
          );
        })}
      </div>
      {selected.length > 0 ? (
        <div className="sort-btns">
          <button className="br-4">Update</button>&nbsp;&nbsp;
          <button
            className="remove br-4"
            onClick={() => {
              let newList = [...list];
              selected.forEach((ele) => {
                let idx = newList.findIndex((x) => x.id === ele.id);
                if (idx !== -1) {
                  newList.splice(idx, 1);
                }
              });
              setList(newList);
              setSelected([]);
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="sort-btns">
          <button
            className="br-4"
            onClick={() => {
              fetch(
                "https://s3-ap-southeast-1.amazonaws.com/he-public-data/users49b8675.json"
              )
                .then((res) => res.json())
                .then((res) => {
                  setList(res);
                });
            }}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
