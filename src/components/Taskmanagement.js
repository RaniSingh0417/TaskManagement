import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import logo from "./logo.png";
// var axios = require("axios");

// import img1 from "./img1.png";

const Taskmanagement = () => {
  useEffect(() => {
    gettasks();
  }, []);
  const [task, settask] = useState([]);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [date, setdate] = useState();
  const [status, setstatus] = useState("To-Do");

  const handleCreate = async () => {
    if (title.trim() === "") {
      return toast.warning("Please enter Task Title");
    } else if (description.trim() === "") {
      return toast.warning("Please enter Task Description ");
    } else if (!date) {
      return toast.warning("Please set a due date for task");
    }
    const oldTask = [...task];
    // let newTask = {
    //   taskTitle: title,
    //   taskDescription: description,
    //   taskDueDate: date,
    //   taskStatus: status,
    // };

    // oldTask.unshift(newTask);
    // settask(oldTask);
    settitle("");
    setdescription("");
    setstatus("To-Do");
    setdate(new Date().toLocaleDateString());
    // toast.success("Task created succesfully");

    // code for sending data to backend through API

    const response = await axios.post("/api/task", {
      title,
      description,
      date,
      status,
    });
    console.log(response);
    if (response.data.success) {
      gettasks();
      toast.success("Task created succesfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  const gettasks = async () => {
    let response = await axios.get("/task");
    if (response.data.success) {
      console.log(response.data.data);
      settask(response.data.data);
      // toast.success("All Tasks are displayed");
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (taskid) => {
    // const oldTask = [...task];
    // const newTask = oldTask.filter((v, i) => i !== index);
    // settask(newTask);
    let response = await axios.delete(`/api/delete/${taskid}`);
    if (response.data.success) {
      gettasks();
      toast.success("Task Deleted");
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleUpdate = (index, newdate) => {
    const oldTask = [...task];

    oldTask[index].taskDueDate = newdate;

    settask(oldTask);
  };

  const handleUpdateStatus = async (taskid, taskstatus) => {
    // const oldTask = [...task];
    // const oldstatus = oldTask[index].taskStatus;
    let newtaskStatus;
    if (taskstatus === "To-Do") {
      newtaskStatus = "In-Progress";
    } else if (taskstatus === "In-Progress") {
      newtaskStatus = "Completed";
    } else if (taskstatus === "Completed") {
      newtaskStatus = "To-Do";
    }
    let response = await axios.put(`/api/update/${taskid}/${newtaskStatus}`);
    if (response.data.success) {
      gettasks();
      toast.success("Task-Status Updated Successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  const handlecolour = (taskstatus) => {
    if (taskstatus === "To-Do") {
      return "red";
    } else if (taskstatus === "In-Progress") {
      return "#ffc107";
    } else if (taskstatus === "Completed") {
      return "#194d33";
    }
  };
  const handleUpdateButton = (index) => {
    const oldTask = [...task];

    if (oldTask[index].taskStatus === "To-Do") {
      return "Start ";
    } else if (oldTask[index].taskStatus === "In-Progress") {
      return "Finish ";
    } else if (oldTask[index].taskStatus === "Completed") {
      return "Restart";
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="logo">
        <img src={logo} alt="logo" />
        <h1>Task Management DashBoard</h1>
      </div>
      {/* <nav className="navbar navbar-light bg-dark">
        <div className="container-fluid">
          <img src={logo} alt="logo" class="d-inline-block align-text-top" />
          <h1> Task Mangaement DashBoard</h1>
        </div>
      </nav> */}
      <div className="main">
        {/* <img src={img1}  /> */}
        <h2>
          "The best way to get a task Completed faster is to start sooner"
        </h2>
        <div className="task">
          <form>
            <label>Task Title:</label>
            <input
              type="text"
              required
              placeholder="Enter Task Title"
              value={title}
              onChange={(e) => {
                settitle(e.target.value);
              }}
            />
            <br />
            <br />

            <label>Task Description:</label>
            <textarea
              type="text"
              required
              placeholder="Enter Task  Description"
              value={description}
              onChange={(e) => {
                setdescription(e.target.value);
              }}
            />
            <br />
            <br />
            <label>Task Due date:</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => {
                setdate(e.target.value);
              }}
            />
            <br />
            <br />
            <label>Task Status:</label>
            {/* <input
              type="text"
              value={status}
              onChange={(e) => {
                setstatus(e.target.value);
              }}
            /> */}
            <select
              type="text"
              value={status}
              onChange={(e) => {
                setstatus(e.target.value);
              }}
            >
              <option>To-Do</option>
              <option>In-Progress</option>
              <option>Completed</option>
            </select>
            <br />
            <br />
            <button
              type="button"
              className="createbtn"
              onClick={() => handleCreate()}
              // class="btn btn-secondary btn-lg"
            >
              Create
            </button>
            {/* <button
              type="button"
              className="createbtn"
              onClick={() => gettasks()}
              // class="btn btn-secondary btn-lg"
            >
              Get Task
            </button> */}
          </form>
        </div>
        <div className="tasklist">
          {task.map((v, i) => {
            return (
              <ul key={i} style={{ background: handlecolour(v.taskStatus) }}>
                <li type="none">Task Title:{v.taskTitle}</li>
                <li type="none">Task Description:{v.taskDescription}</li>
                <li type="none">Task Date:{v.taskDueDate}</li>
                {/* v.tasktitle or v["tasktitle"] it will work if key of object 
              is one word or if it have space then we will use v["tasktitle"]*/}

                <li type="none">
                  Task Status:
                  {v.taskStatus}
                </li>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(v._id, v.taskStatus);

                    // refresh(i);
                  }}
                >
                  {handleUpdateButton(i)}
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    handleUpdate(i, <input type="date" />);
                  }}
                >
                  Update Date
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    handleDelete(v._id);
                  }}
                >
                  Delete Task
                </button>
              </ul>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Taskmanagement;
