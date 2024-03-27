import React, { createContext, useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineEdit,
  AiOutlineClose,
  AiOutlinePlus,
} from "react-icons/ai";
import { IoIosSettings } from "react-icons/io";

import { toast } from "react-hot-toast";
import { auth, addTodo } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Switch } from "@headlessui/react";

export const ThemeContext = createContext("null ");

function App(props) {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState([]);
  const [addButton, setaddButton] = useState(false);
  const [enabled, setEnabled] = useState(false);

  /* date */
  const today = new Date();
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString(undefined, dateOptions);
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  const todoAddDate = today.toLocaleTimeString([], timeOptions);
  /* add task function*/
  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.length !== 0) {
      await addTodo({
        value: newTask,
        completed: false,
        time: todoAddDate,
      });
      setNewTask("");
      setaddButton(false);
      toast.success("Task Added!", {
        style: {
          background: props.theme ? "#2e4155" : "#fff",
          color: props.theme ? "#fff" : "#00ebfb",
        },
      });
    } else {
      toast("don't be idle!", {
        icon: "😡",
        style: {
          background: props.theme ? "#2e4155" : "#fff",
          color: props.theme ? "#fff" : "#00ebfb",
        },
      });
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const q = query(collection(db, "todos"), orderBy("time"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTasks(data);
        });
        return unsubscribe;
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  /* delete task function, parameter: id */
  function deleteTask(id) {
    /* we add the new array all the tasks whose id's are different*/
    const docRef = doc(db, "todos", id);
    deleteDoc(docRef);
    toast("Task Deleted!", {
      icon: "🗑️",
      style: {
        background: props.theme ? "#2e4155" : "#fff",
        color: props.theme ? "#fff" : "#00ebfb",
      },
    });
  }
  /* complete a task */
  function completedTasks(task) {
    const docRef = doc(db, "todos", task.id);
    updateDoc(docRef, { completed: !task.completed });

    if (task.completed !== true) {
      toast("it's over finally!", {
        icon: "🏌️",
        style: {
          background: props.theme ? "#2e4155" : "#fff",
          color: props.theme ? "#fff" : "#00ebfb",
        },
      });
    } else {
      toast("turn back o7!", {
        icon: "🧑‍💼",
        style: {
          background: props.theme ? "#2e4155" : "#fff",
          color: props.theme ? "#fff" : "#00ebfb",
        },
      });
    }
  }
  /* Modal */
  function modalBtn(task) {
    setModal(!modal);
    setEdit(task);
  }
  /* editing existing tasks */
  function editTask(e) {
    setEdit({ ...edit, value: e });
  }
  /* edit existing tasks */
  function change(e) {
    e.preventDefault();
    const updateTask = tasks.map((task) => (task.id === edit.id ? edit : task));
    const docRef = doc(db, "todos", updateTask[0].id);
    updateDoc(docRef, {
      value: edit.value,
      time: todoAddDate,
    });

    setModal(false);

    toast("Task Updated!", {
      icon: "✏️",
      style: {
        background: props.theme ? "#2e4155" : "#fff",
        color: props.theme ? "#fff" : "#00ebfb",
      },
    });
  }

  /* add button */
  function plusButton() {
    setaddButton(true);
  }

  return (
    <div
      className={`responsive flex justify-center  items-center min-h-screen ${
        props.theme ? "bg-slate-900" : "bg-cyan-100"
      }`}
    >
      <div
        className={`w-screen  flex justify-center items-center mt-20  ${
          modal ? "blur-sm" : ""
        }`}
      >
        <div className=" min-w-[40%] w-3/4 md:w-auto">
          <div
            className={`bg-gradient-to-r p-12 rounded-t-xl flex justify-between lg:flex-row flex-col items-start lg:items-center relative ${
              props.theme
                ? "from-slate-800 to-slate-600/40"
                : "from-cyan-300 to-blue-400/75"
            }`}
          >
            {/* Title */}
            <h1 className="text-2xl text-white">{formattedDate}</h1>
            <div className="flex gap-2 text-center items-center">
              <h2 className="text-xl text-white">Rest Api</h2>
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? "bg-cyan-800" : "bg-cyan-400"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${enabled ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              <h2 className="text-xl text-white">GraphQL</h2>
            </div>
          </div>

          {/* lists of the entered tasks */}

          <div className="flex flex-col z-20">
            {tasks.map((task) => {
              return (
                <div
                  key={task.id}
                  className={` flex relative hover:scale-110 hover:z-10 last:rounded-b-xl lg:pl-10 border-l-8 border-transparent  items-center mb-1 justify-between shadow-xl   py-5 lg:px-10 px-5  ${
                    props.theme
                      ? "hover:border-slate-600   shadow-slate-800 bg-slate-700"
                      : "hover:border-cyan-300  shadow-cyan-200 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex flex-col ">
                      <span className="text-gray-400 text-xl ">
                        {task.time}
                      </span>
                      <h2
                        className={`${
                          task.completed ? "line-through text-gray-300" : ""
                        }  ${
                          props.theme ? "text-white" : ""
                        } text-xl text-gray-600`}
                      >
                        {task.value}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center group ">
                    <button
                      onClick={() => modalBtn(task)}
                      className={`absolute text-lg p-3 border-2 border-transparent  shadow-lg rounded-full right-28 hidden group-hover:!flex hover:scale-110 ${
                        props.theme ? "bg-slate-600" : "bg-white"
                      }`}
                    >
                      <AiOutlineEdit className="text-cyan-400" />
                    </button>
                    <span className="absolute w-20 h-20 right-9 "></span>

                    <button
                      onClick={() => completedTasks(task)}
                      className={`absolute text-lg p-3 border-2 border-transparent shadow-lg rounded-full -top-8  hidden group-hover:!flex  hover:scale-110  ${
                        props.theme ? "bg-slate-600" : "bg-white"
                      }`}
                    >
                      <AiOutlineCheck className="text-cyan-400" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`absolute text-lg p-3 border-2 border-transparent  shadow-lg rounded-full -bottom-8 hidden group-hover:!flex z-50 hover:scale-110  ${
                        props.theme ? "bg-slate-600" : "bg-white"
                      }`}
                    >
                      <AiOutlineDelete className="text-cyan-400" />
                    </button>

                    <IoIosSettings className="text-cyan-400 text-3xl" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-3 flex-col items-center">
            <button
              className={`text-lg border-2 rounded-full border-transparent shadow-lg hover:opacity-80 p-4 ${
                addButton ? "!hidden" : ""
              } ${props.theme ? "bg-slate-700" : "bg-white"}`}
              onClick={plusButton}
            >
              <AiOutlinePlus className="text-cyan-400" />
            </button>
            <div
              className={`relative hidden  items-center w-full opacity-0  ${
                addButton ? "animate-wiggle !flex !opacity-100" : ""
              } `}
            >
              <form className="w-full flex items-center">
                <input
                  type="text"
                  placeholder="Enter a new task!"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className={`border-2 rounded-2xl border-transparent pr-16 shadow-lg py-2 px-4 text-xl font-bold outline-none w-full ${
                    addButton ? "animate-opacity" : ""
                  } ${props.theme ? "bg-slate-700 text-white" : ""}`}
                />
                <button
                  onClick={(e) => addTask(e)}
                  className={`absolute right-0 pr-4   ${
                    addButton ? "animate-opacity " : ""
                  } ${
                    props.theme
                      ? "text-slate-400 hover:text-slate-200 "
                      : "text-cyan-400 hover:text-cyan-600"
                  }`}
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute sm:w-auto w-full ${modal ? "block" : "hidden"} `}
      >
        <div
          className={`border-2 border-transparent shadow-lg lg:px-20 lg:py-10 px-10 py-5 sm:max-w-xl max-w-xl lg:max-w-none relative rounded-2xl ${
            props.theme ? "bg-slate-800 " : "bg-white"
          }`}
        >
          <AiOutlineClose
            className={`absolute top-2 right-2 text-2xl cursor-pointer ${
              props.theme ? "text-white" : ""
            } `}
            onClick={() => setModal(false)}
          />
          <h2 className="absolute top-2 left-2 text-xl font-bold text-cyan-300">
            Edit Todo
          </h2>
          <div className="flex items-center sm:justify-center justify-between flex-col sm:flex-row">
            <span className="text-xl font-bold sm:mr-2 line-through text-gray-300 max-w-xs overflow-hidden">
              {edit.value}
            </span>
            <span className="text-xl font-bold text-cyan-300">=</span>
            <div className="relative flex">
              <form>
                <input
                  type="text"
                  value={edit.value}
                  onChange={(e) => editTask(e.target.value)}
                  placeholder="Update the task!"
                  className={`border-2 ml-2 rounded-2xl border-transparent shadow-lg py-2 sm:px-4 pl-2 sm:pr-24 pr-24  text-xl font-bold text-gray-600 placeholder:w-2 ${
                    props.theme
                      ? "bg-slate-700 text-white outline-none"
                      : "bg-white outline-cyan-300"
                  }`}
                />
                <button
                  onClick={(e) => change(e)}
                  className="absolute text-xl right-4 pl-2 h-full rounded-2xl text-cyan-300 hover:text-cyan-500"
                >
                  Change
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
