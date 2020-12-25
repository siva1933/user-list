import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
// import _ from "lodash";
import { saveAs } from "file-saver";
import { toBlob } from "html-to-image";
import JSzip from "jszip";
import "./App.css";

function App() {
  const [list, setList] = useState([]);
  // const [sort, setSort] = useState(false);
  // const [selected, setSelected] = useState([]);
  // const [imageUrl, setImageUrl] = useState(
  //   "https://s3-ap-southeast-1.amazonaws.com/he-public-data/user14b9a23c.png"
  // );

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const readURL = (input = []) => {
    // console.log(input.name);
    // if (![".jpg", ".jpeg", ".png", ".gif"].includes(input.name)) {
    //   console.log("not image");
    //   return;
    // }

    let l = [];
    var bar = new Promise((resolve, reject) => {
      Array.from(input).forEach(async (ele, idx, array) => {
        if (ele) {
          let reader = new FileReader();
          await reader.readAsDataURL(ele);
          reader.onload = () => {
            l.push(reader.result);
            if (idx === array.length - 1) resolve(l);
          };
          reader.onerror = (error) => console.log(error);
        }
      });
    });

    bar.then((l) => {
      setList(l);
    });
  };

  // useEffect(() => {
  //   fetch(
  //     "https://s3-ap-southeast-1.amazonaws.com/he-public-data/users49b8675.json"
  //   )
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setList(res);
  //     });
  // }, []);

  return (
    <div className="App">
      <div>
        {list.length > 0 && (
          <div className="details-sec">
            <input
              id="file"
              style={{ display: "none" }}
              type="file"
              accept="image/gif, image/jpeg, image/png, image/jpg"
              multiple
              onChange={(e) => {
                readURL(e.target.files);

                // Array.from(e.target.files).forEach((element) => {
                //   readURL(element);
                // });
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
              className="btn br-4 mr-1"
              onClick={() => {
                let allImgs = document.getElementsByClassName("img-sec");
                let zip = new JSzip();
                console.log(allImgs);
                let promise = new Promise((resolve, reject) => {
                  Array.from(allImgs).forEach((item, i) => {
                    toBlob(item).then((blob) => {
                      zip.file(`my-images-${new Date().getTime()}.png`, blob);
                      if (i === allImgs.length - 1) resolve(true);
                    });
                  });
                });

                promise.then((res) => {
                  if (res) {
                    zip.generateAsync({ type: "blob" }).then((content) => {
                      saveAs(content, "images.zip");
                    });
                  }
                });
              }}
            >
              Save All
            </button>
            <button
              className={"btn br-4"}
              onClick={() => {
                setList([]);
              }}
            >
              Clear All
            </button>
          </div>
        )}
        <div className="img-wrap">
          {list.length > 0 &&
            list.map((imgUrl, i) => (
              <div
                key={i}
                className="img-sec"
                ref={printRef}
                onClick={handlePrint}
              >
                <img src={imgUrl} alt={"name" + i} />
                {/* <a className="img-download" href={imgUrl} download>
                Click here
              </a> */}
              </div>
            ))}
        </div>
        <div className="details-sec">
          <input
            id="file"
            style={{ display: "none" }}
            type="file"
            accept="image/gif, image/jpeg, image/png, image/jpg"
            multiple
            onChange={(e) => {
              readURL(e.target.files);

              // Array.from(e.target.files).forEach((element) => {
              //   readURL(element);
              // });
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
            className="btn br-4 mr-1"
            onClick={() => {
              let allImgs = document.getElementsByClassName("img-sec");
              let zip = new JSzip();
              console.log(allImgs);
              let promise = new Promise((resolve, reject) => {
                Array.from(allImgs).forEach((item, i) => {
                  toBlob(item).then((blob) => {
                    zip.file(`my-images-${new Date().getTime()}.png`, blob);
                    if (i === allImgs.length - 1) resolve(true);
                  });
                });
              });

              promise.then((res) => {
                if (res) {
                  zip.generateAsync({ type: "blob" }).then((content) => {
                    saveAs(content, "images.zip");
                  });
                }
              });
            }}
          >
            Save All
          </button>
          <button
            className={"btn br-4"}
            onClick={() => {
              setList([]);
            }}
          >
            Clear All
          </button>
        </div>
      </div>
      {/* <div className="sort-btns">
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
      )} */}
    </div>
  );
}

export default App;
