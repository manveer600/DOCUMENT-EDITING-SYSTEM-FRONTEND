import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../Redux/Slices/AuthSlice";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
  ["image", "link", "video"],
];

function Editor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const { id } = useParams();

  async function handleLogout() {
    try {
      await dispatch(logout());
    } catch (e) {
      toast.error(e?.response?.data?.message);
    }
  }

  useEffect(() => {
    const quillServer = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    setQuill(quillServer);
  }, []);

  useEffect(() => {
    if (quill) {
      if (isLoggedIn === "true" || isLoggedIn) {
        quill.enable();
      } else if (isLoggedIn === "false" || !isLoggedIn) {
        quill.disable();
      }
    }
  }, [quill, isLoggedIn]);

  useEffect(() => {
    const socketServer = io("http://localhost:8000");
    setSocket(socketServer);

    return () => {
      socketServer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const handleChange = (delta, oldData, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handleChange);

    return () => {
      quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!socket || !quill) return;
    const handleReceiveChanges = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handleReceiveChanges);

    return () => {
      socket.off("receive-changes", handleReceiveChanges);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!quill || !socket) return;

    socket &&
      socket.once("load-document", (documentData) => {
        quill && quill.setContents(documentData);
      });
    socket && socket.emit("get-document", 
    id
    );
  }, [quill, socket, 
    id
  ]);

  useEffect(() => {
    if (!socket || !quill) return;
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  return (
    <div className="relative">
      <div className="border p-4 text-center space-x-3 font-bold ">
        {!isLoggedIn && (
          <span className="font-serif">
            Login/signup in order to collaborate...{" "}
          </span>
        )}{" "}
        {!isLoggedIn ? (
          <button
            onClick={() => navigate("/docs/login", 
            )}
            className="m-auto px-3 py-2 border rounded-lg font-bold  bg-yellow-200 font-serif hover:bg-yellow-300 hover:border-2 hover:border-black"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="m-auto px-3 py-2 border rounded-lg font-bold  bg-yellow-200 font-serif hover:bg-yellow-300 hover:border-2 hover:border-black"
          >
            Logout
          </button>
        )}
        <button
          onClick={() => navigate("/docs/signup",
           )}
          className="m-auto px-3 py-2 border rounded-lg font-bold  bg-yellow-200 font-serif hover:bg-yellow-300 hover:border-2 hover:border-black"
        >
          Signup
        </button>
      </div>
      <div id="container"></div>
    </div>
  );
}

export default Editor;
