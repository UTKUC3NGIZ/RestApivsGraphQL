import React, { createContext, useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineEdit,
  AiOutlineClose,
  AiOutlinePlus,
} from "react-icons/ai";
import { IoIosSettings } from "react-icons/io";

import { Switch } from "@headlessui/react";
import axios from "axios";

export const ThemeContext = createContext("null ");

function App(props) {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState({});
  const [addButton, setaddButton] = useState(false);
  const [enabled, setEnabled] = useState(false);
  console.log(edit);
  useEffect(() => {
    fetchTasks();
  }, []);
  console.log(modal);
  // Rest Api
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "https://todoapp-7ttl.onrender.com/api/todo/getall"
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://todoapp-7ttl.onrender.com/api/todo/create", {
        title: newTask,
        done: false,
      });
      setNewTask("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const editTask = async (id, title, done) => {
    try {
      await axios.put(`https://todoapp-7ttl.onrender.com/api/todo/update`, {
        id: id,
        title: title,
        done: done,
      });
      setModal(false);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://todoapp-7ttl.onrender.com/api/todo/delete`, {
        params: {
          toDoItem: id,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // GraphQL

  const modalBtn = (task) => {
    setEdit(task);
    setModal(true);
  };

  const plusButton = () => {
    setaddButton(!addButton);
  };

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
            {tasks.map((task, index) => {
              return (
                <div
                  key={index}
                  className={` flex relative hover:scale-110 hover:z-10 last:rounded-b-xl lg:pl-10 border-l-8 border-transparent  items-center mb-1 justify-between shadow-xl   py-5 lg:px-10 px-5  ${
                    props.theme
                      ? "hover:border-slate-600   shadow-slate-800 bg-slate-700"
                      : "hover:border-cyan-300  shadow-cyan-200 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex flex-col ">
                      <h2
                        className={`${
                          task.done ? "line-through text-gray-300" : ""
                        }  ${
                          props.theme ? "text-white" : ""
                        } text-2xl font-bold text-gray-600`}
                      >
                        {task.title}
                      </h2>
                      <p
                        className={`${
                          task.done ? "line-through text-gray-300" : ""
                        }  ${
                          props.theme ? "text-white" : ""
                        } text-xl text-gray-600`}
                      >
                        {task.description}
                      </p>
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
                      onClick={() => editTask(task.id, task.title, task.done)}
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
                  onChange={(e) => setNewTask(e.target.value)}
                  value={newTask}
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
              {edit.title}
            </span>
            <span className="text-xl font-bold text-cyan-300">=</span>
            <div className="relative flex">
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  value={edit.title}
                  onChange={(e) => {
                    setEdit({ ...edit, title: e.target.value });
                  }}
                  placeholder="Update the task!"
                  className={`border-2 ml-2 rounded-2xl border-transparent shadow-lg py-2 sm:px-4 pl-2 sm:pr-24 pr-24  text-xl font-bold text-gray-600 placeholder:w-2 ${
                    props.theme
                      ? "bg-slate-700 text-white outline-none"
                      : "bg-white outline-cyan-300"
                  }`}
                />
                <button
                  type="submit"
                  onClick={() => editTask(edit.id, edit.title, edit.done)}
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
