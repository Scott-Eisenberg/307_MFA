import userModel from "../models/user.js";

function addUser(user) {
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

function getUsers(name, job) {
  if (name !== undefined && job !== undefined) {
    return findUserByNameAndJob(name, job);
  } else if (name !== undefined) {
    return findUserByName(name);
  } else if (job !== undefined) {
    return findUserByJob(job);
  } else {
    return userModel.find();
  }
}

function findUserById(id) {
  return userModel.findById(id);
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function findUserByNameAndJob(name, job) {
  return userModel.find({ name: name, job: job });
}

function removeUser(id) {
  return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  findUserByNameAndJob,
  removeUser
};
